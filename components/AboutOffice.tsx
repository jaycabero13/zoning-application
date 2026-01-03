
import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Landmark, Check, Users, Target } from 'lucide-react';

const AboutOffice: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Hero Section */}
      <section className="relative rounded-[3rem] overflow-hidden h-[400px] bg-slate-900 shadow-2xl group">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          alt="Modern Architecture" 
          className="w-full h-full object-cover opacity-50 scale-105 group-hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
          <div className="bg-blue-600/30 backdrop-blur-md p-4 rounded-full border border-blue-400/30 mb-6">
            <Landmark size={48} className="text-blue-300" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">City Planning Office</h2>
          <p className="text-xl text-slate-300 font-medium max-w-2xl leading-relaxed">
            Shaping the future of Panabo City through intelligent urban design and sustainable development policies.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Target size={28} />
          </div>
          <h3 className="text-3xl font-black text-slate-900">Our Mandate</h3>
          <p className="text-slate-600 leading-relaxed font-medium">
            To formulate integrated economic, social, physical, and other development plans and policies for the consideration of the local development council. We serve as the primary advisory body on the city's overall development strategy.
          </p>
          <ul className="space-y-4 pt-4">
            {[
              'Comprehensive Land Use Planning',
              'Zoning Ordinance Enforcement',
              'Infrastructure Development Strategy',
              'Socio-Economic Data Analysis'
            ].map(item => (
              <li key={item} className="flex items-center gap-3 font-bold text-slate-800 text-sm">
                <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Check size={12} />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-xl text-white space-y-6">
          <div className="w-12 h-12 bg-white/10 text-blue-300 rounded-2xl flex items-center justify-center">
            <Users size={28} />
          </div>
          <h3 className="text-3xl font-black">CPDO Leadership</h3>
          <p className="text-slate-400 leading-relaxed font-medium">
            Our department is led by experienced professionals dedicated to public service and technical excellence in the field of urban planning.
          </p>
          <div className="pt-6 space-y-8">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-300 font-black border border-white/10">
                  ENGR.
               </div>
               <div>
                 <p className="text-xl font-black text-white leading-tight">Engr. Felix C. Rosell</p>
                 <p className="text-xs text-blue-400 mt-1 font-black uppercase tracking-[0.2em]">City Planning & Development Officer</p>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-2xl font-black text-blue-300">25+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Years Experience</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-2xl font-black text-blue-300">40+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Staff Members</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Hours Section */}
      <section className="bg-slate-50 rounded-[3rem] p-10 md:p-16">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="flex-1 space-y-10">
            <div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">Connect With Us</h3>
              <p className="text-slate-500 font-medium">Have questions about zoning laws or land use? Reach out to our technical team.</p>
            </div>

            <div className="space-y-6">
               <div className="flex items-start gap-5 group">
                 <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                    <MapPin size={24} />
                 </div>
                 <div>
                    <p className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">Office Location</p>
                    <p className="text-slate-600 font-medium leading-relaxed">2nd Floor, New City Hall Building, <br/>Brgy. J.P. Laurel, Panabo City, 8105</p>
                 </div>
               </div>

               <div className="flex items-start gap-5 group">
                 <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                    <Phone size={24} />
                 </div>
                 <div>
                    <p className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">Telephone</p>
                    <p className="text-slate-600 font-medium leading-relaxed">(084) 823-0100 ext. 201</p>
                 </div>
               </div>

               <div className="flex items-start gap-5 group">
                 <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                    <Mail size={24} />
                 </div>
                 <div>
                    <p className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">Email Support</p>
                    <p className="text-slate-600 font-medium leading-relaxed">cpdo@panabocity.gov.ph</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="w-full md:w-[400px] bg-white rounded-[2.5rem] shadow-xl p-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Clock size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900">Service Hours</h4>
            </div>
            <div className="space-y-4">
              {[
                { day: 'Monday', hours: '8:00 AM - 5:00 PM' },
                { day: 'Tuesday', hours: '8:00 AM - 5:00 PM' },
                { day: 'Wednesday', hours: '8:00 AM - 5:00 PM' },
                { day: 'Thursday', hours: '8:00 AM - 5:00 PM' },
                { day: 'Friday', hours: '8:00 AM - 5:00 PM' },
              ].map(item => (
                <div key={item.day} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <span className="font-bold text-slate-900">{item.day}</span>
                  <span className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">{item.hours}</span>
                </div>
              ))}
              <div className="pt-4 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Closed on Weekends & Holidays</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutOffice;
