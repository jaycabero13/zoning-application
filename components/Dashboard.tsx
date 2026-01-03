
import React from 'react';
import { Applicant, ZoneType, ApprovalStatus, User } from '../types';
import { getApplicants, deleteApplicant, updateApplicantStatus } from '../services/dbService';
import { exportToExcel } from '../services/excelService';
import { Search, Filter, Download, Trash2, MapPin, Home, Square, User as UserIcon, Eye, CheckCircle, XCircle, Clock, BarChart3, LayoutDashboard, ShieldCheck, X } from 'lucide-react';

interface DashboardProps {
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const [applicants, setApplicants] = React.useState<Applicant[]>([]);
  const [filterZone, setFilterZone] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedApplicant, setSelectedApplicant] = React.useState<Applicant | null>(null);

  const refreshData = () => {
    setApplicants(getApplicants(currentUser.id));
    if (selectedApplicant) {
      const updated = getApplicants(currentUser.id).find(a => a.id === selectedApplicant.id);
      if (updated) setSelectedApplicant(updated);
    }
  };

  React.useEffect(() => {
    refreshData();
  }, [currentUser.id]);

  const stats = React.useMemo(() => {
    const counts = Object.values(ZoneType).reduce((acc, zone) => {
      acc[zone] = applicants.filter(a => a.zone === zone).length;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  }, [applicants]);

  const filteredApplicants = applicants.filter(a => {
    const matchesZone = filterZone === 'All' || a.zone === filterZone;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.zoneLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this applicant?')) {
      deleteApplicant(id);
      refreshData();
    }
  };

  const handleStatusUpdate = (id: string, status: ApprovalStatus) => {
    updateApplicantStatus(id, status);
    refreshData();
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-green-100 text-green-700 uppercase tracking-tighter shadow-sm ring-1 ring-green-200"><CheckCircle size={10} /> Approved</span>;
      case ApprovalStatus.DISAPPROVED:
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 uppercase tracking-tighter shadow-sm ring-1 ring-rose-200"><XCircle size={10} /> Disapproved</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 uppercase tracking-tighter shadow-sm ring-1 ring-amber-200"><Clock size={10} /> Pending</span>;
    }
  };

  return (
    <div className="space-y-12">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-400/20 text-xs font-black uppercase tracking-widest text-blue-400">
              <ShieldCheck size={14} />
              Secured Session: Active
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Officer <span className="text-blue-400">{currentUser.username}</span>, <br/>Dashboard Status.
            </h1>
            <p className="text-slate-400 max-w-lg font-medium leading-relaxed">
              Managing zoning records for your district. Details below reflect applicant residences and proposed project sites without multimedia storage.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center w-32 backdrop-blur-sm">
               <p className="text-3xl font-black">{applicants.length}</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Your Records</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([zone, count]) => (
          <div key={zone} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3 hover:shadow-xl transition-all border-b-4 border-b-blue-500/10">
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{zone} Zone Cluster</div>
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-black text-slate-900">{count}</span>
              <span className="text-xs font-bold text-slate-500">APPLICATIONS</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, residence, or site..." 
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <select 
              className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-black focus:ring-4 focus:ring-blue-100 outline-none shadow-sm cursor-pointer"
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
            >
              <option value="All">ALL ZONING CATEGORIES</option>
              {Object.values(ZoneType).map(z => <option key={z} value={z}>{z.toUpperCase()}</option>)}
            </select>

            <button 
              onClick={() => exportToExcel(filteredApplicants)}
              className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black transition-all shadow-lg active:scale-95"
            >
              <Download size={18} />
              EXPORT DATA
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[11px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-6">Applicant Meta</th>
                  <th className="px-8 py-6">Geography (Residence & Site)</th>
                  <th className="px-8 py-6">Classification</th>
                  <th className="px-8 py-6 text-right">Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplicants.length > 0 ? filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <UserIcon size={24} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{app.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Dossier ID: {app.id.slice(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                          <Home size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]" title="Applicant Residence">{app.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-black text-blue-600">
                          <MapPin size={12} className="shrink-0" />
                          <span className="truncate max-w-[200px]" title="Proposed Site Location">{app.zoneLocation}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{app.zone.toUpperCase()}</span>
                          <span className="text-[10px] font-black text-slate-500 italic">{app.area.toLocaleString()} SQM</span>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedApplicant(app)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-slate-800 transition-all"
                        >
                          OPEN RECORD
                        </button>
                        <button onClick={() => handleDelete(app.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-24 text-center">
                      <p className="text-xl font-black text-slate-300">No Records Identified</p>
                      <p className="text-sm text-slate-400 font-medium mt-2">Adjust your search or register a new applicant to begin.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedApplicant && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-200">
             <div className="p-12 space-y-8">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedApplicant.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Application for Zoning Compliance</p>
                   </div>
                   <button onClick={() => setSelectedApplicant(null)} className="p-2 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                     <X size={20} />
                   </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-8 border-y border-slate-100">
                   <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <Home size={10} /> Residence
                        </p>
                        <p className="text-sm font-bold text-slate-900 leading-relaxed">{selectedApplicant.address}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Requested Zone</p>
                        <p className="text-xl font-black text-slate-900">{selectedApplicant.zone}</p>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <MapPin size={10} /> Subject Property Site
                        </p>
                        <p className="text-sm font-black text-blue-700 leading-relaxed bg-blue-50 p-3 rounded-xl border border-blue-100">
                          {selectedApplicant.zoneLocation}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Proposed Area</p>
                        <p className="text-xl font-black text-slate-900">{selectedApplicant.area.toLocaleString()} sqm</p>
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-xl">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-8 text-center">Regulatory Decision Panel</p>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => handleStatusUpdate(selectedApplicant.id, ApprovalStatus.APPROVED)}
                        className={`flex-1 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
                          selectedApplicant.status === ApprovalStatus.APPROVED ? 'bg-green-600 shadow-lg ring-4 ring-green-600/20' : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <CheckCircle size={20} />
                        APPROVE
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(selectedApplicant.id, ApprovalStatus.DISAPPROVED)}
                        className={`flex-1 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
                          selectedApplicant.status === ApprovalStatus.DISAPPROVED ? 'bg-rose-600 shadow-lg ring-4 ring-rose-600/20' : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <XCircle size={20} />
                        REJECT
                      </button>
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
