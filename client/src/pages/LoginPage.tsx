import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithPhoneAndOtp, setAuthSession } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // 3 Separate Login Modes: FARMER, ADMIN_OFFICER, SUPER_ADMIN
  const [loginMode, setLoginMode] = useState<'FARMER' | 'ADMIN_OFFICER' | 'SUPER_ADMIN'>('FARMER');

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

  // 1. Farmer: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!phone || phone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

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

  // 1. Farmer: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
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

  // 2. Mandi Officer & Admin: Official Email + Password Login
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

  // 3. Super Admin: National Command Authority Login
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

          {/* 3 SEPARATE LOGIN TABS */}
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold gap-1">
            {/* Tab 1: Farmer */}
            <button
              type="button"
              onClick={() => {
                setLoginMode('FARMER');
                setErrorMsg('');
              }}
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
              onClick={() => {
                setLoginMode('ADMIN_OFFICER');
                setErrorMsg('');
              }}
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
              onClick={() => {
                setLoginMode('SUPER_ADMIN');
                setErrorMsg('');
              }}
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
    </div>
  );
};
