
export enum ZoneType {
  COMMERCIAL = 'Commercial',
  AGRICULTURAL = 'Agricultural',
  RESIDENTIAL = 'Residential',
  INDUSTRIAL = 'Industrial'
}

export enum SexType {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum ApprovalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DISAPPROVED = 'Disapproved'
}

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
  createdAt: string;
}

export interface Applicant {
  id: string;
  userId: string; // The ID of the user who owns this data
  name: string;
  sex: SexType;
  address: string;
  zone: ZoneType;
  zoneLocation: string;
  area: number;
  status: ApprovalStatus;
  createdAt: string;
}

export interface ZoneStats {
  zone: ZoneType;
  count: number;
  totalArea: number;
}
