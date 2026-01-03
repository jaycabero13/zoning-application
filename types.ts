
export enum ZoneType {
  COMMERCIAL = 'Commercial',
  AGRICULTURAL = 'Agricultural',
  RESIDENTIAL = 'Residential',
  INDUSTRIAL = 'Industrial',
  AGRO_INDUSTRIAL = 'Agro-Industrial',
  MANGROVE_PROTECTION = 'Mangrove Protection',
  INSTITUTIONAL = 'Institutional'
}

export enum SexType {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum ApprovalStatus {
  PENDING = 'Pending',
  TECHNICAL_REVIEW = 'Under Technical Review',
  APPROVED = 'Approved',
  DISAPPROVED = 'Disapproved'
}

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface Applicant {
  id: string;
  userId: string;
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
