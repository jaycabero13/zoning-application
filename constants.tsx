
import React from 'react';
import { ApprovalStatus, ZoneType, SexType } from './types';

// Updated to use the Official Panabo City Seal
export const PANABO_LOGO = (
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Seal_of_Panabo.svg" 
    alt="Panabo City Seal" 
    className="w-12 h-12 object-contain"
  />
);

export const APP_STORAGE_KEY = 'panabo_zoning_applicants';

export const INITIAL_DATA = [
  {
    id: '1',
    name: 'Juan Dela Cruz',
    sex: SexType.MALE,
    address: 'Brgy. San Vicente, Panabo City',
    zone: ZoneType.RESIDENTIAL,
    zoneLocation: '7.3075° N, 125.6844° E',
    area: 250,
    status: ApprovalStatus.PENDING,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Maria Clara',
    sex: SexType.FEMALE,
    address: 'Poblacion, Panabo City',
    zone: ZoneType.COMMERCIAL,
    zoneLocation: 'Downtown Area near City Hall',
    area: 1200,
    status: ApprovalStatus.APPROVED,
    createdAt: new Date().toISOString()
  }
];
