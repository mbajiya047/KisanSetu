import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, User, Shield, CheckCircle2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoBanner: React.FC = () => {
  const { user, loginAsDemoRole, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const roles: { role: UserRole; labelEn: string; labelHi: string; icon: any; route: string }[] = [
    { role: 'FARMER', labelEn: 'Farmer (Ramesh Kumar)', labelHi: 'किसान (रमेश कुमार)', icon: User, route: '/farmer/dashboard' },
    { role: 'MANDI_OFFICER', labelEn: 'Mandi Officer (Sonipat)', labelHi: 'मंडी अधिकारी (सोनीपत)', icon: Shield, route: '/officer/dashboard' },
    { role: 'SUPER_ADMIN', labelEn: 'Super Admin (India)', labelHi: 'राष्ट्रीय सुपर एडमिन', icon: Sparkles, route: '/admin' },
  ];

  const handleSwitch = async (r: (typeof roles)[0]) => {
    await loginAsDemoRole(r.role);
    navigate(r.route);
  };

  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-2 px-3 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 shadow-inner z-50">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-emerald-400 tracking-wide uppercase">
          {language === 'hi' ? 'स्मार्ट इंडिया हैकथॉन 2026 डेमो' : 'SIH 2026 Evaluation Demo'}
        </span>
        <span className="hidden md:inline text-slate-400">| Problem ID 26032: Agricultural Procurement & Queue Management</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">
          {language === 'hi' ? 'त्वरित भूमिका स्विच:' : 'Switch Demo Role:'}
        </span>
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = user?.role === r.role;
          return (
            <button
              key={r.role}
              onClick={() => handleSwitch(r)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? r.labelHi : r.labelEn}</span>
              {isActive && <CheckCircle2 className="w-3.5 h-3.5 ml-0.5 text-emerald-200" />}
            </button>
          );
        })}

        {user && (
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-700/60 transition-all ml-1 shadow-sm"
            title="Log out of all accounts"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'लॉगआउट' : 'Log Out'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
