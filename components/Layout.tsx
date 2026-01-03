
import React from 'react';
import { PANABO_LOGO } from '../constants.tsx';
import { LayoutDashboard, UserPlus, FileSpreadsheet, Info, Menu, X, LogOut, Facebook, Twitter, Mail, Globe } from 'lucide-react';

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
    { id: 'add', label: 'Registration', icon: UserPlus },
    { id: 'import', label: 'Bulk Import', icon: FileSpreadsheet },
    { id: 'about', label: 'About CPDO', icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="scale-75 md:scale-90">{PANABO_LOGO}</div>
              <div className="ml-3 hidden sm:block">
                <h1 className="text-xl font-black text-slate-900 leading-none">PANABO CITY</h1>
                <p className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">Planning Portal</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="w-px h-6 bg-slate-200 mx-4" />
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg text-slate-600">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="flex mb-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
                <span>City Portal</span>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-slate-400">Personalized Records</span>
              </nav>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight capitalize">
                {navItems.find(i => i.id === activeTab)?.label || 'Overview'}
              </h2>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-3 px-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm uppercase">
                {username.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-none">Officer {username}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Session</p>
              </div>
            </div>
          </header>

          <div className="min-h-[600px]">
            {children}
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center justify-center md:justify-start">
                <div className="bg-white p-1 rounded-full">{PANABO_LOGO}</div>
                <div className="ml-4">
                  <h3 className="text-xl font-black tracking-tight">PANABO CITY</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Planning & Zoning Office</p>
                </div>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed font-medium text-sm mx-auto md:mx-0">
                Official management portal for city planning officers. Scoped data access ensures privacy and accountability for all zoning records.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-sm uppercase tracking-widest text-blue-400">Navigation</h4>
              <ul className="space-y-2 text-slate-400 text-sm font-bold">
                <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-white">Dashboard</button></li>
                <li><button onClick={() => setActiveTab('add')} className="hover:text-white">Register</button></li>
                <li><button onClick={() => setActiveTab('import')} className="hover:text-white">Import</button></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-sm uppercase tracking-widest text-blue-400">Security</h4>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-[10px] font-bold text-slate-400 space-y-2">
                <p>SESSION USER: <span className="text-white">{username}</span></p>
                <p>ACCESS LEVEL: <span className="text-blue-400">ADMINISTRATOR</span></p>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Panabo City CPDO. Internal Government Portal.</p>
            <div className="flex gap-4">
              <span>Secure Layer 256bit</span>
              <span>V1.3.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
