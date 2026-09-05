import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, User, Shield, CheckCircle2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LogoutRequiredModal } from './LogoutRequiredModal';

export const DemoBanner: React.FC = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [targetPortal, setTargetPortal] = useState<{ queryRole: string; name: string } | null>(null);

  const roles = [
    { role: 'FARMER', labelEn: 'Farmer', labelHi: 'किसान', icon: User, queryRole: 'FARMER' },
    { role: 'ADMIN_OFFICER', labelEn: 'Officer / Admin', labelHi: 'अधिकारी / एडमिन', icon: Shield, queryRole: 'ADMIN_OFFICER' },
    { role: 'SUPER_ADMIN', labelEn: 'Super Admin', labelHi: 'सुपर एडमिन', icon: Sparkles, queryRole: 'SUPER_ADMIN' },
  ];

  const isCurrentPortal = (roleCode: string) => {
    if (!user) return false;
    if (roleCode === 'FARMER') return user.role === 'FARMER';
    if (roleCode === 'ADMIN_OFFICER') {
      return ['MANDI_OFFICER', 'DISTRICT_ADMIN', 'STATE_ADMIN'].includes(user.role);
    }
    if (roleCode === 'SUPER_ADMIN') return user.role === 'SUPER_ADMIN';
    return false;
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'SUPER_ADMIN':
        return '/admin';
      case 'STATE_ADMIN':
        return '/state-admin';
      case 'DISTRICT_ADMIN':
        return '/district-admin';
      case 'MANDI_OFFICER':
        return '/officer/dashboard';
      case 'FARMER':
      default:
        return '/farmer/dashboard';
    }
  };

  const handleRoleClick = (r: (typeof roles)[0]) => {
    // 1. If not logged in, go straight to login page for that portal
    if (!user) {
      navigate(`/login?role=${r.queryRole}`);
      return;
    }

    // 2. If already logged in with this role, go to their active dashboard
    if (isCurrentPortal(r.role)) {
      navigate(getDashboardPath());
      return;
    }

    // 3. Trying to access a DIFFERENT portal while another account is active
    // Show the "Logout Required" popup modal!
    setTargetPortal({
      queryRole: r.queryRole,
      name: language === 'hi' ? r.labelHi : r.labelEn,
    });
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogoutAndSwitch = () => {
    const dest = targetPortal ? `/login?role=${targetPortal.queryRole}` : '/login';
    logout();
    setIsLogoutModalOpen(false);
    setTargetPortal(null);
    navigate(dest);
  };

  return (
    <>
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
            {language === 'hi' ? 'लॉगिन पोर्टल चुनें:' : 'Select Login Portal:'}
          </span>
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = isCurrentPortal(r.role);
            return (
              <button
                key={r.queryRole}
                onClick={() => handleRoleClick(r)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
                title={
                  isActive
                    ? language === 'hi' ? 'वर्तमान में सक्रिय पोर्टल (डैशबोर्ड पर जाएं)' : 'Currently active portal (Go to Dashboard)'
                    : user
                    ? language === 'hi' ? `${r.labelHi} में बदलने के लिए क्लिक करें` : `Switch to ${r.labelEn} (Logout required)`
                    : language === 'hi' ? `${r.labelHi} लॉगिन पोर्टल` : `${r.labelEn} Login Portal`
                }
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

      {/* Logout Required Modal */}
      <LogoutRequiredModal
        isOpen={isLogoutModalOpen}
        onClose={() => {
          setIsLogoutModalOpen(false);
          setTargetPortal(null);
        }}
        targetPortalName={targetPortal?.name}
        onConfirmLogout={handleConfirmLogoutAndSwitch}
      />
    </>
  );
};
