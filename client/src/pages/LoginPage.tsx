import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import {
  Smartphone,
  KeyRound,
  Sparkles,
  ShieldCheck,
  User,
  Shield,
  MapPin,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sprout,
  UserPlus,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building,
  Crown,
  Key,
  CalendarCheck2,
  FileSpreadsheet,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { LogoutRequiredModal } from '../components/LogoutRequiredModal';

export const LoginPage: React.FC = () => {
  const { user, isAuthenticated, logout, loginWithPhoneAndOtp, setAuthSession } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 3 Separate Login Modes: FARMER, ADMIN_OFFICER, SUPER_ADMIN
  const [loginMode, setLoginMode] = useState<'FARMER' | 'ADMIN_OFFICER' | 'SUPER_ADMIN'>('FARMER');

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [pendingTargetName, setPendingTargetName] = useState('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const getDashboardRoute = () => {
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

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'FARMER') {
      setLoginMode('FARMER');
    } else if (roleParam === 'ADMIN_OFFICER' || roleParam === 'ADMIN') {
      setLoginMode('ADMIN_OFFICER');
    } else if (roleParam === 'SUPER_ADMIN') {
      setLoginMode('SUPER_ADMIN');
    }
  }, [searchParams]);

  // Farmer State (Phone + OTP)
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [otpSentMsg, setOtpSentMsg] = useState('');

  // Mandi Officer & State/District Admin State
  const [adminEmail, setAdminEmail] = useState('officer.sonipat@agri.gov.in');
  const [adminPassword, setAdminPassword] = useState('GovPass@2026');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Super Admin State (National Command)
  const [superAdminEmail, setSuperAdminEmail] = useState('superadmin.india@agri.gov.in');
  const [superAdminKey, setSuperAdminKey] = useState('GovPass@2026');
  const [showSuperAdminKey, setShowSuperAdminKey] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Tab switcher with logout guard
  const handleTabClick = (mode: 'FARMER' | 'ADMIN_OFFICER' | 'SUPER_ADMIN', labelEn: string, labelHi: string) => {
    const label = language === 'hi' ? labelHi : labelEn;

    if (user) {
      const isSameRole =
        (mode === 'FARMER' && user.role === 'FARMER') ||
        (mode === 'ADMIN_OFFICER' && ['MANDI_OFFICER', 'DISTRICT_ADMIN', 'STATE_ADMIN'].includes(user.role)) ||
        (mode === 'SUPER_ADMIN' && user.role === 'SUPER_ADMIN');

      if (!isSameRole) {
        setPendingTargetName(label);
        setPendingAction(() => () => {
          setLoginMode(mode);
          setSearchParams({ role: mode });
          setErrorMsg('');
        });
        setIsLogoutModalOpen(true);
        return;
      }
    }

    setLoginMode(mode);
    setSearchParams({ role: mode });
    setErrorMsg('');
  };

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      action();
    }
  };

  // 1. Farmer: Send OTP (with account guard)
  const executeSendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await api.sendOtp(phone);
      if (res.success) {
        setOtpSentMsg(res.demoHint || `OTP sent to +91 ${phone}`);
        setStep('OTP');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!phone || phone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    if (user) {
      if (user.role !== 'FARMER' || user.phone !== phone) {
        setPendingTargetName(language === 'hi' ? `किसान पोर्टल (+91 ${phone})` : `Farmer Portal (+91 ${phone})`);
        setPendingAction(() => () => {
          executeSendOtp();
        });
        setIsLogoutModalOpen(true);
        return;
      }
    }

    executeSendOtp();
  };

  // 1. Farmer: Verify OTP (with account guard)
  const executeVerifyOtp = async () => {
    setIsLoading(true);
    try {
      const { isNewUser } = await loginWithPhoneAndOtp(phone, otp);
      if (isNewUser) {
        navigate(`/farmer/register?phone=${phone}`);
      } else {
        navigate('/farmer/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid OTP. Use 123456 for demo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (user && (user.role !== 'FARMER' || user.phone !== phone)) {
      setPendingTargetName(language === 'hi' ? `किसान खाता (+91 ${phone})` : `Farmer Account (+91 ${phone})`);
      setPendingAction(() => () => {
        executeVerifyOtp();
      });
      setIsLogoutModalOpen(true);
      return;
    }

    executeVerifyOtp();
  };

  // 2. Mandi Officer & Admin: Official Email + Password Login (with account guard)
  const executeAdminLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.officialLogin(adminEmail.trim(), adminPassword.trim());
      if (res.success && res.token && res.user) {
        setAuthSession(res.token, res.user);

        const role = res.user.role;
        if (role === 'STATE_ADMIN') {
          navigate('/state-admin');
        } else if (role === 'DISTRICT_ADMIN') {
          navigate('/district-admin');
        } else {
          navigate('/officer/dashboard');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your government email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!adminEmail.trim()) {
      setErrorMsg('Please enter your official government email');
      return;
    }

    if (!adminPassword.trim()) {
      setErrorMsg('Please enter your authorized password');
      return;
    }

    if (user) {
      const isSameAccount =
        ['MANDI_OFFICER', 'DISTRICT_ADMIN', 'STATE_ADMIN'].includes(user.role) &&
        (user as any).email?.toLowerCase() === adminEmail.trim().toLowerCase();

      if (!isSameAccount) {
        setPendingTargetName(language === 'hi' ? `अधिकारी पोर्टल (${adminEmail})` : `Officer Account (${adminEmail})`);
        setPendingAction(() => () => {
          executeAdminLogin();
        });
        setIsLogoutModalOpen(true);
        return;
      }
    }

    executeAdminLogin();
  };

  // 3. Super Admin: National Command Authority Login (with account guard)
  const executeSuperAdminLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.officialLogin(superAdminEmail.trim(), superAdminKey.trim());
      if (res.success && res.token && res.user) {
        setAuthSession(res.token, res.user);
        navigate('/admin');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Super Admin authorization failed. Access restricted to authorized national personnel.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuperAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!superAdminEmail.trim()) {
      setErrorMsg('Please enter your Super Admin National Command email');
      return;
    }

    if (!superAdminKey.trim()) {
      setErrorMsg('Please enter your National Super Admin security key');
      return;
    }

    if (user) {
      const isSameAccount =
        user.role === 'SUPER_ADMIN' && (user as any).email?.toLowerCase() === superAdminEmail.trim().toLowerCase();

      if (!isSameAccount) {
        setPendingTargetName(language === 'hi' ? 'राष्ट्रीय सुपर एडमिन' : 'National Super Admin Portal');
        setPendingAction(() => () => {
          executeSuperAdminLogin();
        });
        setIsLogoutModalOpen(true);
        return;
      }
    }

    executeSuperAdminLogin();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-agri-50/50 via-white to-slate-50">
      <div className="max-w-lg w-full space-y-6">
        {/* Main Container Card */}
        <div className="card p-6 sm:p-8 bg-white border border-slate-200 shadow-2xl rounded-3xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-agri-700 to-agri-900 text-white flex items-center justify-center mx-auto shadow-md shadow-agri-700/20">
              <Sprout className="w-7 h-7 text-emerald-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'किसानसेतु प्रवेश पोर्टल' : 'KisanSetu Sign In Portal'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'अखिल भारतीय कृषि खरीद एवं कतार प्रबंधन प्रणाली'
                : 'All-India Agricultural Procurement & Queue Management Platform'}
            </p>
          </div>

          {/* Active Session Warning Banner */}
          {user && (
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 space-y-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700 flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-slate-900">
                      {language === 'hi' ? 'सक्रिय खाता पहले से लॉग इन है' : 'Active Account Already Logged In'}
                    </p>
                    <span className="text-[10px] font-bold bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    {language === 'hi'
                      ? `आप वर्तमान में ${user.name} के रूप में लॉग इन हैं। किसी अन्य खाते में लॉगिन करने से पहले वर्तमान खाते से लॉगआउट करना अनिवार्य है।`
                      : `You are signed in as ${user.name}. To log in with a different account or portal, please log out first.`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="text-xs py-2 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'वर्तमान खाते से लॉगआउट करें' : 'Log Out Current Account'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(getDashboardRoute())}
                  className="text-xs py-2 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all"
                >
                  <span>{language === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Go to Active Dashboard'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 3 SEPARATE LOGIN TABS */}
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold gap-1">
            {/* Tab 1: Farmer */}
            <button
              type="button"
              onClick={() => handleTabClick('FARMER', 'Farmer Portal', 'किसान पोर्टल')}
              className={`py-2.5 px-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
                loginMode === 'FARMER'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-[11px] sm:text-xs leading-tight">
                {language === 'hi' ? 'किसान लॉगिन' : 'Farmer'}
              </span>
            </button>

            {/* Tab 2: Mandi Officer & Admin */}
            <button
              type="button"
              onClick={() => handleTabClick('ADMIN_OFFICER', 'Officer / Admin', 'अधिकारी / एडमिन')}
              className={`py-2.5 px-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
                loginMode === 'ADMIN_OFFICER'
                  ? 'bg-blue-800 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-[11px] sm:text-xs leading-tight">
                {language === 'hi' ? 'अधिकारी / एडमिन' : 'Officer / Admin'}
              </span>
            </button>

            {/* Tab 3: Super Admin */}
            <button
              type="button"
              onClick={() => handleTabClick('SUPER_ADMIN', 'Super Admin', 'सुपर एडमिन')}
              className={`py-2.5 px-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
                loginMode === 'SUPER_ADMIN'
                  ? 'bg-slate-950 text-amber-400 shadow-md ring-1 ring-amber-500/40'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Crown className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
              <span className="text-[11px] sm:text-xs leading-tight">
                {language === 'hi' ? 'सुपर एडमिन' : 'Super Admin'}
              </span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. FARMER LOGIN PORTAL (Phone Number + OTP)                                */}
          {/* ========================================================================= */}
          {loginMode === 'FARMER' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>
                  {language === 'hi'
                    ? '10-अंकीय मोबाइल नंबर दर्ज करें और तुरंत एसएमएस ओटीपी प्राप्त करें।'
                    : 'Enter your 10-digit mobile number to receive authentication OTP.'}
                </span>
              </div>

              {step === 'PHONE' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {language === 'hi' ? 'मोबाइल नंबर (Mobile Number)' : 'Mobile Number (10 Digits)'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-3 text-xs sm:text-sm font-bold shadow-md bg-emerald-700 hover:bg-emerald-800"
                  >
                    <span>
                      {isLoading
                        ? 'Sending OTP...'
                        : language === 'hi'
                        ? 'ओटीपी प्राप्त करें (Send OTP)'
                        : 'Send OTP to Mobile'}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                  {otpSentMsg && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{otpSentMsg}</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        {language === 'hi' ? '6-अंकीय ओटीपी दर्ज करें' : 'Enter 6-Digit OTP'}
                      </label>
                      <button
                        type="button"
                        onClick={() => setStep('PHONE')}
                        className="text-[11px] font-bold text-emerald-700 hover:underline"
                      >
                        Change (+91 {phone})
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-center tracking-[0.5em] font-mono text-xl font-bold text-slate-900 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-3 text-xs sm:text-sm font-bold shadow-md bg-emerald-700 hover:bg-emerald-800"
                  >
                    {isLoading
                      ? 'Verifying...'
                      : language === 'hi'
                      ? 'सत्यापित करें एवं लॉगिन करें'
                      : 'Verify OTP & Sign In'}
                  </button>
                </form>
              )}

              {/* Link to Register */}
              <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-600">
                  {language === 'hi' ? 'क्या आप नए किसान हैं?' : 'New to KisanSetu?'}{' '}
                  <Link
                    to="/farmer/register"
                    className="font-bold text-emerald-700 hover:text-emerald-800 underline inline-flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'नया किसान खाता बनाएं' : 'Create Farmer Account (Register)'}</span>
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. MANDI OFFICER & STATE/DISTRICT ADMIN LOGIN PORTAL                      */}
          {/* ========================================================================= */}
          {loginMode === 'ADMIN_OFFICER' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-1">
                <div className="flex items-center gap-2 text-blue-800 font-bold uppercase text-[10px] tracking-wider">
                  <Building className="w-3.5 h-3.5 text-blue-700" />
                  <span>APMC Mandi Officer & District / State Administration</span>
                </div>
                <p className="text-[11px] text-blue-900">
                  {language === 'hi'
                    ? 'मंडी सचिव, वेईब्रिज अधिकारी, एवं जिला/राज्य नोडल प्रशासक लॉगिन पोर्टल।'
                    : 'Sign in for APMC Mandi In-Charge Officers, Weighbridge Operators & District Admins.'}
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
                {/* Official Email */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    {language === 'hi' ? 'आधिकारिक सरकारी ईमेल *' : 'Government Official Email Address *'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="officer.sonipat@agri.gov.in"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 font-semibold text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-blue-700 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    {language === 'hi' ? 'प्राधिकृत पासवर्ड *' : 'Authorized Security Password *'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-blue-700 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Issued by State APMC Directorate & Agriculture Department
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-800 hover:bg-blue-900 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-blue-200" />
                  <span>
                    {isLoading
                      ? 'Authenticating...'
                      : language === 'hi'
                      ? 'अधिकारी पोर्टल में लॉगिन करें'
                      : 'Officer / Admin Sign In'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Official Accounts Selector */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Official Accounts (Click to Fill):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminEmail('officer.sonipat@agri.gov.in');
                      setAdminPassword('GovPass@2026');
                    }}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-left border border-blue-200 transition-all truncate"
                  >
                    <strong className="block text-[11px]">Mandi Officer</strong>
                    <span className="text-[10px] text-blue-600 font-mono">Sonipat Mandi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminEmail('district.admin@agri.gov.in');
                      setAdminPassword('GovPass@2026');
                    }}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-left border border-slate-200 transition-all truncate"
                  >
                    <strong className="block text-[11px]">District Admin</strong>
                    <span className="text-[10px] text-slate-500 font-mono">Collectorate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminEmail('state.admin@agri.gov.in');
                      setAdminPassword('GovPass@2026');
                    }}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-left border border-slate-200 transition-all truncate"
                  >
                    <strong className="block text-[11px]">State Admin</strong>
                    <span className="text-[10px] text-slate-500 font-mono">State Nodal</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. SUPER ADMIN NATIONAL COMMAND PORTAL (Ministry of Agriculture, GoI)    */}
          {/* ========================================================================= */}
          {loginMode === 'SUPER_ADMIN' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 text-xs border border-amber-500/30 space-y-1.5 shadow-lg">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[10px] tracking-wider">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>National Command & Governance Portal</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {language === 'hi'
                    ? 'कृषि एवं किसान कल्याण मंत्रालय (भारत सरकार) - राष्ट्रीय सुपर एडमिन नियंत्रण कक्ष।'
                    : 'Ministry of Agriculture & Farmers Welfare (Govt. of India) - National Super Admin Command Matrix.'}
                </p>
                <div className="text-[10px] text-emerald-400 font-mono font-bold pt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  <span>NIC High-Security Multi-Mandi Roster Authority</span>
                </div>
              </div>

              <form onSubmit={handleSuperAdminLogin} className="space-y-4 text-xs">
                {/* Super Admin Email */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    {language === 'hi'
                      ? 'राष्ट्रीय सुपर एडमिन ईमेल (National Command Email) *'
                      : 'National Super Admin Government Email *'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={superAdminEmail}
                      onChange={(e) => setSuperAdminEmail(e.target.value)}
                      placeholder="superadmin.india@agri.gov.in"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 font-semibold text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Master Security Key */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    {language === 'hi'
                      ? 'मास्टर सुरक्षा कुंजी (Master Security Passkey) *'
                      : 'National Master Security Key *'}
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showSuperAdminKey ? 'text' : 'password'}
                      value={superAdminKey}
                      onChange={(e) => setSuperAdminKey(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSuperAdminKey(!showSuperAdminKey)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showSuperAdminKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Confidential Passkey for adding/removing mandis and managing pan-India procurement
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-slate-950 hover:bg-slate-900 border border-amber-500/40 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>
                    {isLoading
                      ? 'Verifying Security Protocol...'
                      : language === 'hi'
                      ? 'राष्ट्रीय सुपर एडमिन प्रवेश'
                      : 'Enter National Command Center'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </form>

              {/* Super Admin Quick Chip */}
              <div className="pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setSuperAdminEmail('superadmin.india@agri.gov.in');
                    setSuperAdminKey('GovPass@2026');
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-amber-500/30 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Click to Fill Super Admin Demo Key</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono">superadmin.india@agri.gov.in</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Required Modal */}
      <LogoutRequiredModal
        isOpen={isLogoutModalOpen}
        onClose={() => {
          setIsLogoutModalOpen(false);
          setPendingTargetName('');
          setPendingAction(null);
        }}
        targetPortalName={pendingTargetName}
        onConfirmLogout={handleConfirmLogout}
      />
    </div>
  );
};
