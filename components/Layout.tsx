
import React from 'react';
import { PANABO_LOGO } from '../constants';
import { LayoutDashboard, UserPlus, FileSpreadsheet, Info, Menu, X, LogOut, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  username: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout, username }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add', label: 'Registry', icon: UserPlus },
    { id: 'import', label: 'Migration', icon: FileSpreadsheet },
    { id: 'about', label: 'Office Info', icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Official Republic of the Philippines Top Bar */}
      <div className="bg-[#0f172a] text-white py-2 px-4 text-[9px] font-bold uppercase tracking-[0.25em] flex justify-center items-center gap-4 z-[60]">
        <span className="opacity-70">Republic of the Philippines</span>
        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
        <span>City Government of Panabo</span>
      </div>

      {/* Primary Branding Section - Centered and Clearly Visible */}
      <header className="bg-white border-b border-slate-100 py-8 flex flex-col items-center justify-center space-y-4 shadow-sm z-50">
        <div 
          className="cursor-pointer transition-transform duration-500 hover:scale-105" 
          onClick={() => setActiveTab('dashboard')}
        >
          <PANABO_LOGO className="w-24 h-24 md:w-28 md:h-28" />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-[1000] text-slate-900 tracking-tighter leading-none">
            LUNGSOD NG PANABO
          </h1>
          <p className="text-[10px] font-black text-green-700 tracking-[0.4em] uppercase">
            Planning & Zoning Management Portal
          </p>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between md:justify-center h-16">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === item.id 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-100' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon size={14} />
                    {item.label}
                  </span>
                </button>
              ))}
              <div className="w-px h-6 bg-slate-200 mx-4" />
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-6 py-2 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>

            {/* Mobile Navigation controls - Only logo placeholder or menu button */}
            <div className="md:hidden flex items-center w-full justify-between">
              <div className="flex items-center gap-2">
                 <PANABO_LOGO className="w-8 h-8" />
                 <span className="text-xs font-black tracking-tight">CPDO PORTAL</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg text-slate-600">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-5 py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-4 ${
                  activeTab === item.id ? 'bg-green-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
            <button 
              onClick={onLogout}
              className="w-full text-left px-5 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-rose-600 flex items-center gap-4"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-green-700 uppercase tracking-[0.3em]">
                <ShieldCheck size={14} />
                Secure CPDO Environment
              </div>
              <h2 className="text-4xl font-[1000] text-slate-900 tracking-tighter capitalize">
                {navItems.find(i => i.id === activeTab)?.label || 'Overview'}
              </h2>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-4 px-6 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-lg">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-none">Officer {username}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Active Local Session
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-[600px] animate-in fade-in duration-700">
            {children}
          </div>
        </div>
      </main>

      <footer className="bg-[#0f172a] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-6 space-y-8">
              <div className="flex items-center">
                <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl">
                  <PANABO_LOGO className="w-16 h-16" />
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-[1000] tracking-tight">Lungsod ng Panabo</h3>
                  <p className="text-[10px] text-green-500 font-black uppercase tracking-[0.4em] mt-1">Planning & Development Office</p>
                </div>
              </div>
              <p className="text-slate-400 max-w-md leading-relaxed font-medium text-sm">
                The City Planning and Development Office serves as the primary technical arm of the City Government of Panabo in the formulation and monitoring of integrated city development plans.
              </p>
              <div className="flex gap-4">
                 <div className="px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black tracking-widest">v1.4.0</div>
                 <div className="px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black tracking-widest text-green-500">AUTHENTICATED</div>
              </div>
            </div>
            
            <div className="md:col-span-3 space-y-6">
              <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-300">Resource Hub</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-bold">
                <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-green-500 transition-colors">Planning Dashboard</button></li>
                <li><button onClick={() => setActiveTab('add')} className="hover:text-green-500 transition-colors">Dossier Registry</button></li>
                <li><button onClick={() => setActiveTab('import')} className="hover:text-green-500 transition-colors">Excel Import</button></li>
                <li><button onClick={() => setActiveTab('about')} className="hover:text-green-500 transition-colors">Contact CPDO</button></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-6">
              <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-300">Jurisdiction</h4>
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500">
                  <span>REGION</span>
                  <span className="text-white">Region XI</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500">
                  <span>PROVINCE</span>
                  <span className="text-white">Davao del Norte</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500">
                  <span>ENCRYPTION</span>
                  <span className="text-green-500">SECURE</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} Lungsod ng Panabo. City Government Administrative Tool.</p>
            <div className="flex gap-8">
              <span className="hover:text-white transition-colors cursor-help">Data Transparency</span>
              <span className="hover:text-white transition-colors cursor-help">Security Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
