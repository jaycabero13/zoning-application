
import React from 'react';
import { Applicant, ZoneType, ApprovalStatus, User } from '../types';
import { getApplicants, deleteApplicant, updateApplicantStatus } from '../services/dbService';
import { exportToExcel } from '../services/excelService';
import { 
  Search, Download, Trash2, MapPin, CheckCircle, XCircle, Clock, 
  ShieldCheck, X, Ruler, RotateCcw, Eye, Map as MapIcon, 
  Award, FileText, ChevronRight, Activity 
} from 'lucide-react';

interface DashboardProps {
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const [applicants, setApplicants] = React.useState<Applicant[]>([]);
  const [filterZone, setFilterZone] = React.useState<string>('All');
  const [filterStatus, setFilterStatus] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedApplicant, setSelectedApplicant] = React.useState<Applicant | null>(null);

  const refreshData = () => {
    setApplicants(getApplicants(currentUser.id));
    if (selectedApplicant) {
      const updated = getApplicants(currentUser.id).find(a => a.id === selectedApplicant.id);
      if (updated) setSelectedApplicant(updated);
    }
  };

  // Fix: Added handleStatusUpdate to update applicant status and refresh the UI
  const handleStatusUpdate = (id: string, status: ApprovalStatus) => {
    updateApplicantStatus(id, status);
    refreshData();
  };

  // Fix: Added handleDelete to remove applicant record and refresh the UI
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently purge this dossier from the city registry?')) {
      deleteApplicant(id);
      refreshData();
    }
  };

  React.useEffect(() => {
    refreshData();
  }, [currentUser.id]);

  const stats = React.useMemo(() => {
    return Object.values(ZoneType).reduce((acc, zone) => {
      acc[zone] = applicants.filter(a => a.zone === zone).length;
      return acc;
    }, {} as Record<string, number>);
  }, [applicants]);

  const filteredApplicants = applicants.filter(a => {
    const matchesZone = filterZone === 'All' || a.zone === filterZone;
    const matchesStatus = filterStatus === 'All' || a.status === filterStatus;
    const query = searchQuery.toLowerCase();
    return matchesZone && matchesStatus && (
      a.name.toLowerCase().includes(query) || 
      a.address.toLowerCase().includes(query) ||
      a.zoneLocation.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase tracking-tighter ring-1 ring-emerald-200"><CheckCircle size={10} /> Approved</span>;
      case ApprovalStatus.DISAPPROVED:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 uppercase tracking-tighter ring-1 ring-rose-200"><XCircle size={10} /> Disapproved</span>;
      case ApprovalStatus.TECHNICAL_REVIEW:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 uppercase tracking-tighter ring-1 ring-blue-200"><Activity size={10} /> Reviewing</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 uppercase tracking-tighter ring-1 ring-amber-200"><Clock size={10} /> Pending</span>;
    }
  };

  return (
    <div className="space-y-10">
      {/* Official Dashboard Header */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-6">
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-400/20 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <ShieldCheck size={14} /> Authorized CPDO Environment
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 rounded-full border border-yellow-400/20 text-[10px] font-black uppercase tracking-widest text-yellow-500">
                <Award size={14} /> SGLG Certified 2024
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-[1000] leading-none tracking-tighter">
              Zoning <span className="text-emerald-500">Dossier</span> Registry.
            </h1>
            <p className="text-slate-400 max-w-xl font-medium leading-relaxed">
              Official planning interface for the management of land-use compliance in Panabo City. All data processed herein is protected under the Data Privacy Act of 2012.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-48 h-48 rounded-[3rem] border-2 border-white/5 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center transform hover:rotate-3 transition-transform">
               <FileText size={48} className="text-emerald-500 mb-2" />
               <p className="text-3xl font-black">{applicants.length}</p>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Active Cases</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Distribution GIS Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Zone Distribution Matrix</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Cross-Sector Data Analysis</p>
               </div>
               <div className="bg-slate-50 p-2 rounded-xl">
                 <MapIcon size={24} className="text-slate-400" />
               </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(stats).slice(0, 4).map(([zone, count]) => (
                <div key={zone} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 transition-all hover:bg-emerald-50 hover:border-emerald-100 group">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-emerald-600">{zone}</p>
                  <p className="text-2xl font-black text-slate-900">{count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filtering & Search */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search applicant name or site location..." 
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-4 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-100"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                {Object.values(ApprovalStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button 
                onClick={() => exportToExcel(filteredApplicants)}
                className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-slate-200"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-emerald-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <h3 className="text-xl font-black mb-6 relative z-10">GIS Rapid Insights</h3>
          <div className="space-y-4 relative z-10">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Top Requested Zone</p>
               <p className="text-lg font-bold">Residential A-1</p>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Approval Efficiency</p>
               <p className="text-lg font-bold">84.2%</p>
            </div>
            <div className="pt-4 border-t border-white/10">
               <button className="w-full py-3 bg-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-emerald-900 transition-all">
                 Launch Detailed GIS Map
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrative ID / Name</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Zone Category</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredApplicants.length > 0 ? filteredApplicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                        {applicant.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{applicant.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CPDO-{applicant.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{applicant.zone}</p>
                    <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {applicant.zoneLocation}</p>
                  </td>
                  <td className="px-8 py-6">{getStatusBadge(applicant.status)}</td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setSelectedApplicant(applicant)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <Eye size={14} /> Open
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <RotateCcw size={40} className="text-slate-200" />
                      <p className="text-lg font-black text-slate-900">No matching dossiers</p>
                      <button onClick={() => {setFilterStatus('All'); setFilterZone('All'); setSearchQuery('');}} className="text-emerald-600 text-xs font-black uppercase tracking-widest hover:underline">Reset Technical Filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal with Timeline */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedApplicant(null)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex flex-col md:flex-row h-full">
              {/* Profile Sidebar */}
              <div className="w-full md:w-80 bg-slate-50 p-10 border-r border-slate-100 space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-center font-black text-3xl mx-auto shadow-xl">
                    {selectedApplicant.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{selectedApplicant.name}</h3>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Official Applicant</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Residence Address</p>
                    <p className="text-xs font-bold leading-relaxed">{selectedApplicant.address}</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sex / ID Type</p>
                    <p className="text-xs font-bold">{selectedApplicant.sex} / PH-ID</p>
                  </div>
                </div>
              </div>

              {/* Main Timeline & Controls */}
              <div className="flex-1 p-10 space-y-10">
                <div className="flex justify-between items-center">
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">Compliance Roadmap</h4>
                  <button onClick={() => setSelectedApplicant(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
                </div>

                <div className="space-y-6">
                  {/* Timeline Steps */}
                  {[
                    { label: 'Initial Application', date: new Date(selectedApplicant.createdAt).toLocaleDateString(), active: true },
                    { label: 'AI Site Evaluation', date: 'Automated Insight', active: true },
                    { label: 'Technical Review', date: 'Officer Level', active: selectedApplicant.status !== ApprovalStatus.PENDING },
                    { label: 'Final Adjudication', date: 'City Planning Decision', active: selectedApplicant.status === ApprovalStatus.APPROVED || selectedApplicant.status === ApprovalStatus.DISAPPROVED }
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${step.active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          {step.active ? <CheckCircle size={14}/> : <Clock size={14}/>}
                        </div>
                        {idx !== 3 && <div className={`w-0.5 h-12 ${step.active ? 'bg-emerald-200' : 'bg-slate-100'}`} />}
                      </div>
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest ${step.active ? 'text-slate-900' : 'text-slate-300'}`}>{step.label}</p>
                        <p className="text-[10px] font-bold text-slate-400">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Project Zone</p>
                      <p className="font-bold text-sm">{selectedApplicant.zone}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Applied Area</p>
                      <p className="font-bold text-sm">{selectedApplicant.area} SQM</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-4">
                    <button 
                      onClick={() => { handleStatusUpdate(selectedApplicant.id, ApprovalStatus.APPROVED); setSelectedApplicant(null); }}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-900/40"
                    >
                      Issue Approval
                    </button>
                    <button 
                      onClick={() => { handleStatusUpdate(selectedApplicant.id, ApprovalStatus.TECHNICAL_REVIEW); setSelectedApplicant(null); }}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                      Technical Review
                    </button>
                    <button 
                      onClick={() => { handleStatusUpdate(selectedApplicant.id, ApprovalStatus.DISAPPROVED); setSelectedApplicant(null); }}
                      className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                      Disapprove
                    </button>
                    <button 
                      onClick={() => { handleDelete(selectedApplicant.id); setSelectedApplicant(null); }}
                      className="p-3 bg-white/5 hover:bg-white/10 text-rose-400 rounded-xl transition-all"
                      title="Purge Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
