import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  LogOut,
  X,
  User,
  Shield,
  ArrowRight,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface LogoutRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPortalName?: string;
  onConfirmLogout: () => void;
}

export const LogoutRequiredModal: React.FC<LogoutRequiredModalProps> = ({
  isOpen,
  onClose,
  targetPortalName,
  onConfirmLogout,
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();

  if (!isOpen || !user) return null;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return {
          label: language === 'hi' ? 'राष्ट्रीय सुपर एडमिन' : 'Super Admin',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: Sparkles,
        };
      case 'STATE_ADMIN':
        return {
          label: language === 'hi' ? 'राज्य प्रशासक' : 'State Admin',
          color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          icon: Shield,
        };
      case 'DISTRICT_ADMIN':
        return {
          label: language === 'hi' ? 'जिला प्रशासक' : 'District Admin',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Shield,
        };
      case 'MANDI_OFFICER':
        return {
          label: language === 'hi' ? 'मंडी अधिकारी' : 'Mandi Officer',
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: Shield,
        };
      case 'FARMER':
      default:
        return {
          label: language === 'hi' ? 'किसान खाता' : 'Farmer Account',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: User,
        };
    }
  };

  const currentRoleInfo = getRoleBadge(user.role);
  const CurrentIcon = currentRoleInfo.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div
        className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 relative transform transition-all animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={language === 'hi' ? 'बंद करें' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1 pr-6">
            <h3 id="logout-modal-title" className="text-lg font-black text-slate-900 leading-tight">
              {language === 'hi' ? 'पहले लॉगआउट करना आवश्यक है' : 'Logout Required First'}
            </h3>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
              {language === 'hi' ? 'सक्रिय खाता सत्र मिला' : 'Active Account Session Detected'}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {language === 'hi'
            ? 'आप वर्तमान में एक खाते में लॉग इन हैं। किसी दूसरे खाते या नए पोर्टल में प्रवेश करने के लिए आपको पहले अपने वर्तमान खाते से लॉगआउट करना होगा।'
            : 'You are currently logged in to an active account. To switch or sign in with a different account or role portal, you must first log out of your current session.'}
        </p>

        {/* Current Account Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'hi' ? 'वर्तमान लॉग इन खाता:' : 'Currently Logged In:'}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {language === 'hi' ? 'सक्रिय' : 'Active'}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-10 h-10 rounded-xl bg-agri-700 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${currentRoleInfo.color}`}>
                  <CurrentIcon className="w-3 h-3" />
                  <span>{currentRoleInfo.label}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {user.phone ? `+91 ${user.phone}` : user.email || 'KisanSetu User'}
              </p>
            </div>
          </div>
        </div>

        {/* Target Destination Hint */}
        {targetPortalName && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-agri-50/70 border border-agri-200 text-xs text-agri-900 font-medium">
            <ArrowRight className="w-4 h-4 text-agri-700 flex-shrink-0" />
            <span>
              {language === 'hi' ? 'लक्षित लॉगिन पोर्टल:' : 'Target Login Portal:'}{' '}
              <strong className="font-bold text-agri-800">{targetPortalName}</strong>
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={onConfirmLogout}
            className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>
              {language === 'hi'
                ? 'लॉगआउट करें और नया लॉगिन करें'
                : `Log Out & Switch to ${targetPortalName || 'New Account'}`}
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm flex items-center justify-center transition-colors"
          >
            <span>
              {language === 'hi' ? 'रद्द करें (वर्तमान खाते में रहें)' : 'Cancel (Stay in Current Account)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
