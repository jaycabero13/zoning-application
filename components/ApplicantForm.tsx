
import React from 'react';
import { SexType, ZoneType, Applicant } from '../types';
import { saveApplicant } from '../services/dbService';
import { getZoningAdvice } from '../services/geminiService';
import { CheckCircle2, AlertCircle, Sparkles, Loader2, Home, MapPin, User as UserIcon } from 'lucide-react';

interface ApplicantFormProps {
  userId: string;
  onSuccess: () => void;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({ userId, onSuccess }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    sex: SexType.MALE,
    address: '',
    zone: ZoneType.RESIDENTIAL,
    zoneLocation: '',
    area: ''
  });

  const [aiAdvice, setAiAdvice] = React.useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const getPlanningAdvice = async () => {
    if (!formData.zoneLocation || !formData.area) return;
    setIsAiLoading(true);
    const advice = await getZoningAdvice(formData.zone, Number(formData.area), formData.zoneLocation);
    setAiAdvice(advice || null);
    setIsAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.area || !formData.zoneLocation) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      saveApplicant(userId, {
        ...formData,
        area: Number(formData.area),
        sex: formData.sex as SexType,
        zone: formData.zone as ZoneType
      });
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 1000);
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Application Recorded!</h2>
        <p className="text-slate-500 font-medium">The dossier has been saved and linked to your officer ID.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Zoning Application Entry</h2>
            <p className="text-slate-400 text-sm font-medium">Input residential and project details for official evaluation.</p>
          </div>
          <button 
            type="button"
            onClick={getPlanningAdvice}
            disabled={isAiLoading || !formData.area || !formData.zoneLocation}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-2xl text-xs font-black transition-all group shadow-lg"
          >
            {isAiLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            ANALYZE PROJECT
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Information Section */}
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name of Applicant</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" required placeholder="Juan P. Dela Cruz" 
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-800 focus:ring-4 focus:ring-blue-50 transition-all"
                  value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Home size={10} />
                Applicant's Home Address (Residence)
              </label>
              <input 
                type="text" required placeholder="Current residential address"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-800 focus:ring-4 focus:ring-blue-50 transition-all"
                value={formData.address} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sex</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-800 cursor-pointer"
                  value={formData.sex} onChange={e => setFormData(prev => ({ ...prev, sex: e.target.value as SexType }))}
                >
                  {Object.values(SexType).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied Area (sqm)</label>
                <input 
                  type="number" required placeholder="0.00" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-800"
                  value={formData.area} onChange={e => setFormData(prev => ({ ...prev, area: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Location & Zoning Section */}
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intended Zone</label>
              <select 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-800 cursor-pointer"
                value={formData.zone} onChange={e => setFormData(prev => ({ ...prev, zone: e.target.value as ZoneType }))}
              >
                {Object.values(ZoneType).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <MapPin size={10} />
                Proposed Site Location (Subject Property)
              </label>
              <textarea 
                required rows={3} placeholder="Coordinates or specific site description for zoning"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-800 resize-none focus:ring-4 focus:ring-blue-50 transition-all"
                value={formData.zoneLocation} onChange={e => setFormData(prev => ({ ...prev, zoneLocation: e.target.value }))}
              />
            </div>

            {aiAdvice && (
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <p className="text-blue-800 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={12} />
                  Zoning Analysis Insights
                </p>
                <p className="text-blue-900/80 text-xs italic leading-relaxed font-medium">"{aiAdvice}"</p>
              </div>
            )}

            {status === 'error' && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-rose-100">
                <AlertCircle size={14} />
                Please fill in all required project details
              </div>
            )}

            <button 
              type="submit" disabled={status === 'loading'}
              className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 disabled:bg-slate-400"
            >
              {status === 'loading' ? 'PROCESSING DOSSIER...' : 'COMMIT APPLICATION'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApplicantForm;
