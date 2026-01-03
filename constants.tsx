
import React from 'react';
import { ApprovalStatus, ZoneType, SexType } from './types';

// Using a high-resolution PNG version of the official seal for maximum compatibility
export const PANABO_LOGO = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Seal_of_Panabo.svg/1024px-Seal_of_Panabo.svg.png" 
      alt="Official Seal of Panabo City" 
      className="max-w-full max-h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)]"
      loading="eager"
    />
  </div>
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
