
import React from 'react';
import { PANABO_LOGO } from '../constants';
import { loginUser, registerUser } from '../services/dbService';
import { User } from '../types';
import { Lock, User as UserIcon, Eye, EyeOff, Loader2, ArrowRight, UserPlus } from 'lucide-react';

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
          setError('Username already exists');
          setIsLoading(false);
        }
      } else {
        const user = loginUser(username, password);
        if (user) {
          onLoginSuccess(user);
        } else {
          setError('Invalid credentials');
          setIsLoading(false);
        }
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-400 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md p-4 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-10">
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="bg-white p-3 rounded-2xl shadow-lg mb-6 ring-1 ring-slate-100 scale-125">
                {PANABO_LOGO}
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                {isRegistering ? 'Create Admin Account' : 'Staff Zoning Portal'}
              </h1>
              <p className="text-slate-500 text-sm font-medium">City Planning & Development Office</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Username</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600">
                    <UserIcon size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none transition-all font-bold focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none transition-all font-bold focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all hover:bg-slate-800 hover:shadow-xl active:scale-95 disabled:opacity-70 group"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {isRegistering ? 'Register Now' : 'Access System'}
                    <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError(null);
                }}
                className="w-full text-blue-600 text-xs font-bold hover:underline"
              >
                {isRegistering ? 'Already have an account? Sign In' : 'New officer? Create an account'}
              </button>
            </form>
          </div>
          <div className="bg-slate-50 py-4 px-10 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Secure Access</span>
            <span>V1.3.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
