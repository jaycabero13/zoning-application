
import { Applicant, ApprovalStatus, User } from '../types';
import { APP_STORAGE_KEY } from '../constants';

const USERS_KEY = 'panabo_zoning_users';
const EXPIRY_DAYS = 12;

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const registerUser = (username: string, password: string): User | null => {
  const users = getUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) return null;
  
  const newUser: User = {
    id: crypto.randomUUID(),
    username,
    password,
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  return newUser;
};

export const loginUser = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
  return user || null;
};

export const getApplicants = (userId: string): Applicant[] => {
  const data = localStorage.getItem(APP_STORAGE_KEY);
  let all: Applicant[] = data ? JSON.parse(data) : [];
  
  const now = new Date();
  let hasChanges = false;

  // Process Automatic Expiry Logic (12-Day Rule)
  const updatedAll = all.map(applicant => {
    const regDate = new Date(applicant.registrationDate);
    const diffTime = now.getTime() - regDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > EXPIRY_DAYS && 
        (applicant.status === ApprovalStatus.PENDING || applicant.status === ApprovalStatus.TECHNICAL_REVIEW)) {
      hasChanges = true;
      return { ...applicant, status: ApprovalStatus.EXPIRED };
    }
    return applicant;
  });

  if (hasChanges) {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updatedAll));
    all = updatedAll;
  }

  return all.filter(a => a.userId === userId);
};

export const saveApplicant = (userId: string, applicant: Omit<Applicant, 'id' | 'createdAt' | 'status' | 'userId'>): Applicant => {
  const data = localStorage.getItem(APP_STORAGE_KEY);
  const all: Applicant[] = data ? JSON.parse(data) : [];
  
  const newApplicant: Applicant = {
    ...applicant,
    userId,
    id: crypto.randomUUID(),
    status: ApprovalStatus.PENDING,
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify([...all, newApplicant]));
  return newApplicant;
};

export const updateApplicantStatus = (id: string, status: ApprovalStatus): void => {
  const data = localStorage.getItem(APP_STORAGE_KEY);
  const all: Applicant[] = data ? JSON.parse(data) : [];
  const updated = all.map(a => a.id === id ? { ...a, status } : a);
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updated));
};

export const updateApplicantDetails = (id: string, updates: Partial<Applicant>): void => {
  const data = localStorage.getItem(APP_STORAGE_KEY);
  const all: Applicant[] = data ? JSON.parse(data) : [];
  const updated = all.map(a => a.id === id ? { ...a, ...updates } : a);
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updated));
};

export const saveBulkApplicants = (userId: string, newApplicants: Omit<Applicant, 'id' | 'createdAt' | 'status' | 'userId'>[]): void => {
  const data = localStorage.getItem(APP_STORAGE_KEY);
  const all: Applicant[] = data ? JSON.parse(data) : [];
  
  const added = newApplicants.map(a => ({
    ...a,
    userId,
    id: crypto.randomUUID(),
    status: ApprovalStatus.PENDING,
    createdAt: new Date().toISOString()
  }));
  
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify([...all, ...added]));
};

export const deleteApplicant = (id: string): void => {
  const data = localStorage.getItem(APP_STORAGE_KEY);
  const all: Applicant[] = data ? JSON.parse(data) : [];
  const filtered = all.filter(a => a.id !== id);
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(filtered));
};
