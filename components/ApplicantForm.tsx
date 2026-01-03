
import React from 'react';
import { SexType, ZoneType, Applicant } from '../types';
import { saveApplicant } from '../services/dbService';
import { getZoningAdvice } from '../services/geminiService';
import { 
  CheckCircle2, AlertCircle, Sparkles, Loader2, Home, MapPin, 
  User as UserIcon, Ruler, ShieldAlert, FileCheck 
} from 'lucide-react';

interface ApplicantFormProps {
  userId: string;
  onSuccess: () => void;
}

interface FormErrors {
  name?: string;
  address?: string;
  zoneLocation?: string;
  area?: string;
  consent?: string;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({ userId, onSuccess }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    sex: SexType.MALE,
    address: '',
    zone: ZoneType.RESIDENTIAL,
    zoneLocation: '',
    area: '',
    consent: false
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [aiAdvice, setAiAdvice] = React.useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success'>('idle');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.address.trim()) newErrors.address = 'Home address is required';
    if (!formData.zoneLocation.trim()) newErrors.zoneLocation = 'Proposed site location is required';
    if (!formData.area || Number(formData.area) <= 0) newErrors.area = 'A valid positive area is required';
    if (!formData.consent) newErrors.consent = 'Citizen consent for data processing is mandatory (RA 10173)';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPlanningAdvice = async () => {
    if (!formData.zoneLocation || !formData.area) return;
    setIsAiLoading(true);
    const advice = await getZoningAdvice(formData.zone, Number(formData.area), formData.zoneLocation);
    setAiAdvice(advice || null);
    setIsAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setTimeout(() => {
      saveApplicant(userId, {
        ...formData,
        area: Number(formData.area),
        sex: formData.sex as SexType,
        zone: formData.zone as ZoneType
      });
      setStatus('success');
      setTimeout(() => onSuccess(), 1500);
    }, 1000);
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-emerald-50">
          <FileCheck size={56} />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-[1000] text-slate-900 tracking-tight">Record Synchronized</h2>
          <p className="text-slate-500 font-medium mt-2">Dossier successfully committed to the city registry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <form onSubmit={handleSubmit} className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
        {/* Form Header */}
        <div className="bg-[#064e3b] p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-[1000] tracking-tight">Zoning Intake Dossier</h2>
            <p className="text-emerald-200 text-sm font-medium opacity-80 uppercase tracking-widest text-[10px]">Registry Form No. 2024-Z-01</p>
          </div>
          <button 
            type="button"
            onClick={getPlanningAdvice}
            disabled={isAiLoading || !formData.area || !formData.zoneLocation}
            className="flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/10 disabled:text-white/40 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-950/20"
          >
            {isAiLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            Technical AI Evaluation
          </button>
        </div>

        <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Column 1: Identity */}
          <div className="space-y-10">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                <UserIcon size={18}/>
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">I. Proponent Identity</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                <input 
                  type="text" placeholder="First Name, Middle, Last" 
                  className={`w-full px-6 py-5 bg-slate-50 border rounded-2xl outline-none font-bold text-slate-800 transition-all ${
                    errors.name ? 'border-rose-400 ring-4 ring-rose-50' : 'border-slate-100 focus:ring-4 focus:ring-emerald-50'
                  }`}
                  value={formData.name} onChange={e => {setFormData({...formData, name: e.target.value}); if(errors.name) setErrors({...errors, name: undefined});}}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Residential Address</label>
                <textarea 
                  rows={2} placeholder="Barangay, Street, House No."
                  className={`w-full px-6 py-5 bg-slate-50 border rounded-2xl outline-none font-bold text-slate-800 transition-all resize-none ${
                    errors.address ? 'border-rose-400 ring-4 ring-rose-50' : 'border-slate-100 focus:ring-4 focus:ring-emerald-50'
                  }`}
                  value={formData.address} onChange={e => {setFormData({...formData, address: e.target.value}); if(errors.address) setErrors({...errors, address: undefined});}}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sex Type</label>
                <select 
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 cursor-pointer"
                  value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value as SexType})}
                >
                  {Object.values(SexType).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Column 2: Project */}
          <div className="space-y-10">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                <MapPin size={18}/>
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">II. Site Specifications</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zoning Class</label>
                  <select 
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 cursor-pointer"
                    value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value as ZoneType})}
                  >
                    {Object.values(ZoneType).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Area (sqm)</label>
                  <input 
                    type="number" placeholder="0" 
                    className={`w-full px-6 py-5 bg-slate-50 border rounded-2xl outline-none font-bold text-slate-800 transition-all ${
                      errors.area ? 'border-rose-400 ring-4 ring-rose-50' : 'border-slate-100 focus:ring-4 focus:ring-emerald-50'
                    }`}
                    value={formData.area} onChange={e => {setFormData({...formData, area: e.target.value}); if(errors.area) setErrors({...errors, area: undefined});}}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exact Project Location</label>
                <textarea 
                  rows={2} placeholder="Lot/Block, Coordinate, or Landmark"
                  className={`w-full px-6 py-5 bg-slate-50 border rounded-2xl outline-none font-bold text-slate-800 transition-all resize-none ${
                    errors.zoneLocation ? 'border-rose-400 ring-4 ring-rose-50' : 'border-slate-100 focus:ring-4 focus:ring-emerald-50'
                  }`}
                  value={formData.zoneLocation} onChange={e => {setFormData({...formData, zoneLocation: e.target.value}); if(errors.zoneLocation) setErrors({...errors, zoneLocation: undefined});}}
                />
              </div>

              {aiAdvice && (
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 space-y-2 animate-in slide-in-from-top-4 duration-500 shadow-sm">
                  <p className="text-emerald-800 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={12} />
                    CPDO System Insight
                  </p>
                  <p className="text-emerald-900/80 text-xs italic leading-relaxed font-bold">"{aiAdvice}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legal Consent Section */}
        <div className="px-12 py-10 bg-slate-50 border-t border-slate-100">
           <div className={`p-6 bg-white rounded-3xl border transition-all flex items-start gap-4 ${errors.consent ? 'border-rose-300 shadow-lg shadow-rose-50' : 'border-slate-200'}`}>
              <div className="pt-1">
                 <input 
                  type="checkbox" 
                  id="consent"
                  className="w-5 h-5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  checked={formData.consent}
                  onChange={e => {setFormData({...formData, consent: e.target.checked}); if(errors.consent) setErrors({...errors, consent: undefined});}}
                 />
              </div>
              <label htmlFor="consent" className="text-xs font-bold text-slate-600 leading-relaxed cursor-pointer select-none">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <ShieldAlert size={12} /> Data Privacy Consent (Republic Act No. 10173)
                </span>
                I hereby authorize the City Government of Panabo to collect and process the information provided herein for the purposes of zoning certification and urban planning analysis in accordance with the Data Privacy Act of 2012.
              </label>
           </div>
           {errors.consent && <p className="text-[10px] font-black text-rose-500 mt-3 px-2 flex items-center gap-2 tracking-tighter"><AlertCircle size={12}/> {errors.consent}</p>}
        </div>

        {/* Form Footer Action */}
        <div className="p-12 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Origin: Officer Portal</p>
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Authorized Data Commitment</p>
          </div>
          <button 
            type="submit" disabled={status === 'loading'}
            className="w-full sm:w-auto px-16 py-6 bg-slate-900 text-white font-black rounded-2xl shadow-2xl shadow-slate-200 hover:bg-emerald-700 transition-all active:scale-95 disabled:bg-slate-400 flex items-center justify-center gap-4 text-xs tracking-[0.2em] uppercase"
          >
            {status === 'loading' ? (
              <Loader2 className="animate-spin" size={20} />
            ) : 'Commit Official Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicantForm;
