
import * as XLSX from 'xlsx';
import { Applicant, SexType, ZoneType, ApprovalStatus } from '../types';

export const exportToExcel = (data: Applicant[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data.map(a => ({
    Name: a.name,
    Sex: a.sex,
    Address: a.address,
    Zone: a.zone,
    'Zone Location': a.zoneLocation,
    'Area (sqm)': a.area,
    Status: a.status,
    'Date Registered': new Date(a.createdAt).toLocaleDateString()
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Applicants');
  XLSX.writeFile(workbook, `Panabo_Zoning_Applicants_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Fix: Omit userId from the return type since the Excel file does not contain user-specific ID information
export const parseExcelFile = async (file: File): Promise<Omit<Applicant, 'id' | 'createdAt' | 'status' | 'userId'>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const formatted = jsonData.map((row: any) => ({
          name: row.Name || row.name || 'Unknown',
          sex: (row.Sex || row.sex || 'Other') as SexType,
          address: row.Address || row.address || '',
          zone: (row.Zone || row.zone || ZoneType.RESIDENTIAL) as ZoneType,
          zoneLocation: row['Zone Location'] || row.zoneLocation || '',
          area: Number(row['Area (sqm)'] || row.area || 0)
        }));
        resolve(formatted);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
