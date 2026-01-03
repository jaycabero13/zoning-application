
import React from 'react';
import { MapPin, Phone, Mail, Clock, Landmark, Check, Users, Target, ShieldCheck, Award, Globe } from 'lucide-react';

const AboutOffice: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-20 pb-20 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative rounded-[4rem] overflow-hidden h-[500px] bg-emerald-950 shadow-3xl group">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
          alt="Government Planning Center" 
          className="w-full h-full object-cover opacity-40 scale-105 group-hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-12">
          <div className="bg-emerald-500/20 backdrop-blur-xl p-5 rounded-[2rem] border border-emerald-400/30 mb-8">
            <Landmark size={64} className="text-emerald-400" />
          </div>
          <h2 className="text-5xl md:text-7xl font-[1000] tracking-tighter mb-4 leading-none">The CPDO Command.</h2>
          <p className="text-lg md:text-xl text-emerald-100/70 font-bold max-w-2xl leading-relaxed uppercase tracking-widest text-[12px]">
            Lungsod ng Panabo - City Planning & Development Office
          </p>
        </div>
      </section>

      {/* Recognition Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'SGLG Awardee', value: '2022-2024', icon: Award },
          { label: 'Urban Capacity', value: 'Level 1-A', icon: ShieldCheck },
          { label: 'Registered GIS', value: 'Official', icon: Globe },
          { label: 'Staff Strength', value: '42 Experts', icon: Users }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center space-y-2 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <item.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
            <p className="text-xl font-black text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Mandate & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
          <div className="w-16 h-16 bg-emerald-900 text-white rounded-[1.5rem] flex items-center justify-center">
            <Target size={32} />
          </div>
          <h3 className="text-4xl font-[1000] text-slate-900 tracking-tight">Technical Mandate</h3>
          <p className="text-slate-500 leading-relaxed font-bold text-lg">
            Authorized under the Local Government Code to spearhead the formulation of socio-economic and spatial development plans for the City Government of Panabo.
          </p>
          <div className="space-y-4 pt-4">
            {[
              'Comprehensive Land Use Monitoring',
              'Spatial Data Infrastructure Management',
              'Zoning Certification & Inspection',
              'Technical Secretariat for City Council'
            ].map(item => (
              <div key={item} className="flex items-center gap-4 group">
                <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Check size={14} />
                </div>
                <span className="font-black text-slate-800 text-[11px] uppercase tracking-widest">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0f172a] p-12 rounded-[3.5rem] shadow-2xl text-white flex flex-col justify-between">
          <div className="space-y-8">
            <h3 className="text-4xl font-[1000] tracking-tight">Leadership</h3>
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center text-emerald-400 font-black text-2xl">
                ENGR.
              </div>
              <div>
                <p className="text-2xl font-black text-white">Engr. Felix C. Rosell</p>
                <p className="text-[10px] text-emerald-500 mt-2 font-black uppercase tracking-[0.3em]">City Planning & Development Officer</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium italic border-l-4 border-emerald-600 pl-6">
              "We strive to build a city that harmonizes industrial growth with the preservation of our agricultural roots and coastal environment."
            </p>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 flex gap-10">
            <div>
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Digital Registry</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">2024</p>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SGLG Horizon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Location Contact */}
      <section className="bg-white rounded-[4rem] p-12 md:p-20 shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div>
            <h3 className="text-4xl font-[1000] text-slate-900 tracking-tight">Liaison Center</h3>
            <p className="text-slate-500 font-bold mt-4">Official administrative contact channels for public inquiries and technical clarifications.</p>
          </div>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <MapPin size={28}/>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Office Hub</p>
                <p className="text-sm font-black text-slate-800 leading-relaxed">
                  2nd Floor, Panabo City Hall, <br/>
                  Brgy. J.P. Laurel, Panabo City, 8105
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Mail size={28}/>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Support</p>
                <p className="text-sm font-black text-slate-800">cpdo.panabo@gov.ph</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-200 space-y-10">
          <div className="flex items-center gap-4">
             <Clock size={32} className="text-emerald-700" />
             <h4 className="text-2xl font-black text-slate-900 tracking-tight">Administrative Hours</h4>
          </div>
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
              <div key={day} className="flex justify-between items-center py-4 border-b border-slate-200 last:border-0">
                 <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{day}</span>
                 <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl">08:00 AM - 05:00 PM</span>
              </div>
            ))}
          </div>
          <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] pt-4">No Administrative Operations on Holidays</p>
        </div>
      </section>
    </div>
  );
};

export default AboutOffice;
