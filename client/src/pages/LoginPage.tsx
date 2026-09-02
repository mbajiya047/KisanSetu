import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';
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
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithPhoneAndOtp, loginAsDemoRole } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [otpSentMsg, setOtpSentMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        setOtpSentMsg(res.demoHint || 'OTP sent: 123456');
        setStep('OTP');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const { isNewUser } = await loginWithPhoneAndOtp(phone, otp);
      if (isNewUser) {
        navigate('/farmer/register');
      } else {
        navigate('/farmer/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid OTP. Use 123456 for demo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemoLogin = async (role: UserRole, targetRoute: string) => {
    setIsLoading(true);
    try {
      await loginAsDemoRole(role);
      navigate(targetRoute);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-agri-50/50 via-white to-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Card */}
        <div className="card p-8 bg-white border border-slate-200 shadow-xl rounded-3xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-agri-700 text-white flex items-center justify-center mx-auto shadow-md shadow-agri-700/20">
              <Sprout className="w-7 h-7 text-emerald-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'किसानसेतु लॉगिन' : 'KisanSetu Sign In'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'मोबाइल नंबर और ओटीपी द्वारा सुरक्षित प्रवेश' : 'Enter your mobile number to receive authentication OTP'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          {step === 'PHONE' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'hi' ? 'मोबाइल नंबर (10 अंक)' : 'Mobile Number (10 digits)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-sm font-bold shadow-md"
              >
                <span>{isLoading ? 'Sending OTP...' : (language === 'hi' ? 'ओटीपी भेजें (Send OTP)' : 'Send OTP')}</span>
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'hi' ? '6-अंकीय ओटीपी दर्ज करें' : 'Enter 6-Digit OTP'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-center tracking-[0.5em] font-mono text-lg font-bold text-slate-900 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="btn-secondary py-2.5 text-xs font-semibold w-1/3"
                >
                  Change
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary py-2.5 text-xs font-bold w-2/3 shadow-md"
                >
                  {isLoading ? 'Verifying...' : (language === 'hi' ? 'सत्यापित करें एवं लॉगिन' : 'Verify & Sign In')}
                </button>
              </div>
            </form>
          )}

          {/* Instant 1-Click Evaluation Logins for SIH Judges */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider justify-center">
              <Sparkles className="w-3.5 h-3.5 text-harvest-500" />
              <span>SIH 2026 1-Click Fast Logins</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleInstantDemoLogin('FARMER', '/farmer/dashboard')}
                className="w-full p-2.5 rounded-xl bg-agri-50 hover:bg-agri-100 border border-agri-200 text-xs font-bold text-agri-900 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-agri-700" />
                  <span>Farmer: Ramesh Kumar (Wheat 42 Qtl, Token WHT-4921)</span>
                </div>
                <ArrowRight className="w-3 h-3 text-agri-600" />
              </button>

              <button
                type="button"
                onClick={() => handleInstantDemoLogin('MANDI_OFFICER', '/officer/dashboard')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-slate-600" />
                  <span>Mandi Officer: Dr. Harish Chander (Sonipat Central)</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => handleInstantDemoLogin('DISTRICT_ADMIN', '/district-admin')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  <span>District Admin: Sonipat District Analytics</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => handleInstantDemoLogin('STATE_ADMIN', '/state-admin')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>State Admin: Haryana State Rules Engine</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => handleInstantDemoLogin('SUPER_ADMIN', '/admin')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Super Admin: National India-Wide Dashboard</span>
                </div>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
