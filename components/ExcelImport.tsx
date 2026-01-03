
import React from 'react';
import { parseExcelFile } from '../services/excelService';
import { saveBulkApplicants } from '../services/dbService';
import { FileSpreadsheet, CloudUpload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ExcelImportProps {
  userId: string;
  onSuccess: () => void;
}

const ExcelImport: React.FC<ExcelImportProps> = ({ userId, onSuccess }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [importedCount, setImportedCount] = React.useState(0);

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setErrorMsg('Invalid file type. Please upload an Excel (.xlsx or .xls) file.');
      setStatus('error');
      return;
    }

    setStatus('parsing');
    try {
      const applicants = await parseExcelFile(file);
      // Link these records to the current user
      saveBulkApplicants(userId, applicants);
      setImportedCount(applicants.length);
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err) {
      setErrorMsg('Error parsing file. Ensure the headers match our office template.');
      setStatus('error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <FileSpreadsheet size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Bulk Dossier Import</h2>
          <p className="text-slate-500 font-medium max-w-sm">Import multiple zoning applications directly into your personal dashboard.</p>
        </div>

        {status === 'parsing' ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="text-lg font-black text-slate-700">Validating Data Scopes...</p>
          </div>
        ) : status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <CheckCircle2 size={64} className="text-green-600" />
            <p className="text-2xl font-black text-slate-900">Import Complete</p>
            <p className="text-slate-500 font-medium">Successfully added {importedCount} records to your profile.</p>
          </div>
        ) : (
          <div 
            className={`relative h-96 rounded-[2.5rem] border-4 border-dashed transition-all flex flex-col items-center justify-center text-center p-12 ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-200'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <CloudUpload size={64} className={`mb-6 ${isDragging ? 'text-blue-500 animate-bounce' : 'text-slate-200'}`} />
            <h3 className="text-xl font-black text-slate-800 mb-2">Drop Official Template</h3>
            <p className="text-slate-400 text-sm font-bold mb-8">Supports .xlsx and .xls formats</p>
            
            <label className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl cursor-pointer hover:bg-slate-800 shadow-xl shadow-slate-200 active:scale-95 transition-all">
              BROWSE FILES
              <input type="file" className="hidden" accept=".xlsx, .xls" onChange={e => e.target.files?.[0] && processFile(e.target.files[0])} />
            </label>

            {status === 'error' && (
              <div className="mt-8 p-4 bg-rose-50 text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={16} />
                {errorMsg}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelImport;
