
import React from 'react';
import { Applicant, ZoneType, ApprovalStatus, User } from '../types';
import { getApplicants, deleteApplicant, updateApplicantStatus, updateApplicantDetails } from '../services/dbService';
import { exportToExcel } from '../services/excelService';
import { 
  Search, Download, Trash2, MapPin, CheckCircle, XCircle, Clock, 
  ShieldCheck, X, RotateCcw, Eye, Map as MapIcon, 
  Award, FileText, Activity, AlertTriangle, Calendar, CreditCard, Send
} from 'lucide-react';

interface DashboardProps {
  currentUser: User;
}

const formatPHT = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return 'N/A';
  }
};

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const [applicants, setApplicants] = React.useState<Applicant[]>([]);
  const [filterZone, setFilterZone] = React.useState<string>('All');
  const [filterStatus, setFilterStatus] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedApplicant, setSelectedApplicant] = React.useState<Applicant | null>(null);

  // States for modal inputs
  const [editReleaseDate, setEditReleaseDate] = React.useState('');
  const [editPaymentDate, setEditPaymentDate] = React.useState('');
  const [editPaymentAmount, setEditPaymentAmount] = React.useState('');

  const refreshData = () => {
    const data = getApplicants(currentUser.id);
    setApplicants(data);
    if (selectedApplicant) {
      const updated = data.find(a => a.id === selectedApplicant.id);
      if (updated) {
        setSelectedApplicant(updated);
        setEditReleaseDate(updated.releaseDate ? updated.releaseDate.slice(0, 16) : '');
        setEditPaymentDate(updated.paymentDate ? updated.paymentDate.slice(0, 16) : '');
        setEditPaymentAmount(updated.paymentAmount?.toString() || '');
      }
    }
  };

  const handleStatusUpdate = (id: string, status: ApprovalStatus) => {
    updateApplicantStatus(id, status);
    refreshData();
  };

  const handleFinancialUpdate = (id: string) => {
    updateApplicantDetails(id, {
      releaseDate: editReleaseDate ? new Date(editReleaseDate).toISOString() : undefined,
      paymentDate: editPaymentDate ? new Date(editPaymentDate).toISOString() : undefined,
      paymentAmount: editPaymentAmount ? Number(editPaymentAmount) : undefined,
    });
    alert('Administrative details updated successfully.');
    refreshData();
  };

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

  const getExpiryDays = (regDateStr: string) => {
    const regDate = new Date(regDateStr);
    const now = new Date();
    const diffTime = now.getTime() - regDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return 12 - diffDays;
  };

  const getStatusBadge = (applicant: Applicant) => {
    const status = applicant.status;
    const daysLeft = getExpiryDays(applicant.registrationDate);

    switch (status) {
      case ApprovalStatus.APPROVED:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase tracking-tighter ring-1 ring-emerald-200"><CheckCircle size={10} /> Approved</span>;
      case ApprovalStatus.DISAPPROVED:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 uppercase tracking-tighter ring-1 ring-rose-200"><XCircle size={10} /> Disapproved</span>;
      case ApprovalStatus.EXPIRED:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-slate-900 text-white uppercase tracking-tighter ring-1 ring-slate-700"><AlertTriangle size={10} /> Expired Rule</span>;
      case ApprovalStatus.TECHNICAL_REVIEW:
        return (
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 uppercase tracking-tighter ring-1 ring-blue-200"><Activity size={10} /> Reviewing</span>
            <span className={`text-[8px] font-black uppercase tracking-widest ${daysLeft < 3 ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`}>Expires in {daysLeft}D</span>
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 uppercase tracking-tighter ring-1 ring-amber-200"><Clock size={10} /> Pending</span>
            <span className={`text-[8px] font-black uppercase tracking-widest ${daysLeft < 3 ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`}>Expires in {daysLeft}D</span>
          </div>
        );
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
                <ShieldCheck size={14} /> 12-Day Regulatory Enforced
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 rounded-full border border-yellow-400/20 text-[10px] font-black uppercase tracking-widest text-yellow-500">
                <Award size={14} /> Official PHT Zone
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-[1000] leading-none tracking-tighter">
              Zoning <span className="text-emerald-500">Dossier</span> Registry.
            </h1>
            <p className="text-slate-400 max-w-xl font-medium leading-relaxed">
              Official planning interface for Panabo City. All timestamps displayed represent Philippine Standard Time (PHT).
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
          <h3 className="text-xl font-black mb-6 relative z-10">Administrative Control</h3>
          <div className="space-y-4 relative z-10">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Direct Status Edit</p>
               <p className="text-lg font-bold">Enabled in Table</p>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Timezone</p>
               <p className="text-lg font-bold">GMT+8 (Manila)</p>
            </div>
            <div className="pt-4 border-t border-white/10">
               <p className="text-[9px] font-medium leading-relaxed opacity-60">Status changes and financial releases are recorded instantly in PHT.</p>
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
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicant / Registration (PHT)</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Zone Category</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actionable Status</th>
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
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                          <Calendar size={10} /> {formatPHT(applicant.registrationDate)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{applicant.zone}</p>
                    <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {applicant.zoneLocation}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      {getStatusBadge(applicant)}
                      <select 
                        value={applicant.status}
                        onChange={(e) => handleStatusUpdate(applicant.id, e.target.value as ApprovalStatus)}
                        className="text-[9px] font-black uppercase tracking-widest bg-slate-100 border-none rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        disabled={applicant.status === ApprovalStatus.EXPIRED}
                      >
                        <option value={ApprovalStatus.PENDING}>Pending</option>
                        <option value={ApprovalStatus.TECHNICAL_REVIEW}>Technical Review</option>
                        <option value={ApprovalStatus.APPROVED}>Approved</option>
                        <option value={ApprovalStatus.DISAPPROVED}>Disapproved</option>
                        {applicant.status === ApprovalStatus.EXPIRED && <option value={ApprovalStatus.EXPIRED}>Expired</option>}
                      </select>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => {
                        setSelectedApplicant(applicant);
                        setEditReleaseDate(applicant.releaseDate ? applicant.releaseDate.slice(0, 16) : '');
                        setEditPaymentDate(applicant.paymentDate ? applicant.paymentDate.slice(0, 16) : '');
                        setEditPaymentAmount(applicant.paymentAmount?.toString() || '');
                      }}
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

      {/* Detail Modal with Timeline and Financials */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedApplicant(null)} />
          <div className="relative w-full max-w-5xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col md:flex-row h-full">
              {/* Profile Sidebar */}
              <div className="w-full md:w-80 bg-slate-50 p-10 border-r border-slate-100 space-y-8 shrink-0">
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
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Registration (PHT)</p>
                    <p className="text-xs font-bold">{formatPHT(selectedApplicant.registrationDate)}</p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-10 space-y-10">
                <div className="flex justify-between items-center">
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">Dossier Management</h4>
                  <button onClick={() => setSelectedApplicant(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
                </div>

                {/* Status Selection */}
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3">
                   {Object.values(ApprovalStatus).filter(s => s !== ApprovalStatus.EXPIRED).map(status => (
                     <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedApplicant.id, status)}
                      className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        selectedApplicant.status === status 
                        ? 'bg-slate-900 text-white shadow-lg' 
                        : 'bg-white text-slate-400 hover:bg-slate-100'
                      }`}
                     >
                       {status}
                     </button>
                   ))}
                </div>

                {/* Release & Payment Controls */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <CreditCard size={20} className="text-emerald-600" />
                    <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest">Administrative & Financials</h5>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12}/> Release Date (PHT)</label>
                      <input 
                        type="datetime-local" 
                        value={editReleaseDate}
                        onChange={(e) => setEditReleaseDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-800 text-xs focus:ring-4 focus:ring-emerald-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><CreditCard size={12}/> Payment Date (PHT)</label>
                      <input 
                        type="datetime-local" 
                        value={editPaymentDate}
                        onChange={(e) => setEditPaymentDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-800 text-xs focus:ring-4 focus:ring-emerald-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Amount (PHP)</label>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={editPaymentAmount}
                        onChange={(e) => setEditPaymentAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-800 text-xs focus:ring-4 focus:ring-emerald-50"
                      />
                    </div>
                    <div className="flex items-end">
                       <button 
                        onClick={() => handleFinancialUpdate(selectedApplicant.id)}
                        className="w-full py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-50"
                       >
                         <Send size={14} /> Update Registry
                       </button>
                    </div>
                  </div>
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
                      onClick={() => { handleDelete(selectedApplicant.id); setSelectedApplicant(null); }}
                      className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                    >
                      <Trash2 size={16} /> Purge Record
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
