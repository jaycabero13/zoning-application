
import React from 'react';
import { PANABO_LOGO } from '../constants';
import { loginUser, registerUser } from '../services/dbService';
import { User } from '../types';
import { Lock, User as UserIcon, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      if (isRegistering) {
        const newUser = registerUser(username, password);
        if (newUser) {
          onLoginSuccess(newUser);
        } else {
          setError('Username already exists in the CPDO database');
          setIsLoading(false);
        }
      } else {
        const user = loginUser(username, password);
        if (user) {
          onLoginSuccess(user);
        } else {
          setError('Invalid government officer credentials');
          setIsLoading(false);
        }
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] relative overflow-hidden">
      {/* Official Top Bar */}
      <div className="absolute top-0 w-full bg-[#0f172a] text-white py-2 px-4 flex justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] z-50">
        <span className="opacity-60">Republic of the Philippines</span>
        <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
        <span>City Government of Panabo</span>
      </div>

      {/* Modern Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[-15%] right-[-10%] w-[70%] h-[70%] bg-green-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-15%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="w-full max-w-lg p-6 relative z-10 animate-in fade-in zoom-in duration-1000">
        <div className="text-center mb-12 flex flex-col items-center">
          {/* Centered Logo Container */}
          <div className="mb-10 transform hover:scale-105 transition-transform duration-700 bg-white p-6 rounded-[3rem] shadow-2xl border border-white/50 inline-block">
            <PANABO_LOGO className="w-48 h-48 md:w-56 md:h-56" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-[1000] text-slate-900 tracking-tighter leading-none">
              Lungsod ng Panabo
            </h1>
            <p className="text-green-700 text-xs font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3">
              <ShieldCheck size={14} className="opacity-60" />
              Planning & Zoning Portal
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-white overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 via-yellow-400 to-blue-600"></div>
          
          <div className="p-10 md:p-14">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Official Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-green-600" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. j_delacruz_cpdo"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.75rem] outline-none font-bold text-slate-800 focus:ring-8 focus:ring-green-50 focus:border-green-500 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-green-600" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-[1.75rem] outline-none font-bold text-slate-800 focus:ring-8 focus:ring-green-50 focus:border-green-500 transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-slate-900 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-4 transition-all hover:bg-green-700 hover:shadow-3xl active:scale-[0.98] disabled:opacity-50 group"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span>{isRegistering ? 'Register Officer' : 'Authorize Access'}</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError(null);
                }}
                className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-green-600 transition-colors py-2"
              >
                {isRegistering ? 'Already Registered? Secure Sign-in' : 'Request Administrative Account'}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 text-center opacity-40 hover:opacity-100 transition-opacity">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] leading-[2.5]">
            Authorized Access Restricted<br/>
            to City Planning Officials
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
