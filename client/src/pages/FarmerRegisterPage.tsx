import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  User,
  Phone,
  Calendar,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Sprout,
  ShieldCheck,
} from 'lucide-react';

export const FarmerRegisterPage: React.FC = () => {
  const { setAuthSession } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Simplified Form State exactly as requested:
  // 1. Name
  // 2. Phone Number
  // 3. Date of Birth (DOB)
  // 4. Email ID (if applicable)
  // 5. State & District
  const [formData, setFormData] = useState({
    fullName: '',
    phone: searchParams.get('phone') || '',
    dob: '1985-06-15',
    email: '',
    stateId: 'state-rj',
    districtId: 'dist-rj-nagaur',
  });

  useEffect(() => {
    api.getStates().then((res) => {
      if (res.success && res.states) {
        setStates(res.states);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (formData.stateId) {
      api.getStateDetails(formData.stateId).then((res) => {
        if (res.success && res.state?.districts) {
          setDistricts(res.state.districts);
          if (res.state.districts.length > 0) {
            setFormData((prev) => ({ ...prev, districtId: res.state.districts[0].id }));
          }
        }
      }).catch(console.error);
    }
  }, [formData.stateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    if (!formData.phone || formData.phone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!formData.dob) {
      setErrorMsg('Please select your Date of Birth (DOB)');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.registerFarmerSimplified(formData);
      if (res.success && res.token && res.user) {
        setAuthSession(res.token, res.user);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        navigate('/farmer/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create farmer account. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-agri-50/50 via-white to-slate-50">
      <div className="max-w-lg w-full space-y-6">
        {/* Main Card */}
        <div className="card p-6 sm:p-8 bg-white border border-slate-200 shadow-2xl rounded-3xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-agri-700 to-agri-900 text-white flex items-center justify-center mx-auto shadow-md shadow-agri-700/20">
              <Sprout className="w-7 h-7 text-emerald-300" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'hi' ? 'त्वरित किसान खाता पंजीकरण' : 'Quick Farmer Registration'}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'नया किसान खाता बनाएं' : 'Create Your Farmer Account'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'केवल बुनियादी जानकारी दर्ज करें और तुरंत स्लॉट बुकिंग शुरू करें।'
                : 'Enter your basic details to register and start booking procurement slots.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* 1. Full Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                {language === 'hi' ? 'किसान का पूरा नाम (Full Name) *' : 'Full Name (as per Aadhaar) *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar / रमेश कुमार"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* 2. Phone Number */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                {language === 'hi' ? 'मोबाइल नंबर (Phone Number for OTP) *' : 'Mobile Number (for OTP & SMS) *'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* 3. Date of Birth (DOB) */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                {language === 'hi' ? 'जन्म तिथि (Date of Birth) *' : 'Date of Birth (DOB) *'}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* 4. Email ID (If applicable / Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-slate-700">
                  {language === 'hi' ? 'ईमेल आईडी (Email ID)' : 'Email Address'}
                </label>
                <span className="text-[10px] text-slate-400 font-medium italic">
                  {language === 'hi' ? '(वैकल्पिक / Optional)' : '(If applicable / Optional)'}
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="farmer@example.com (optional)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 focus:outline-none"
                />
              </div>
            </div>

            {/* 5. State & District Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {language === 'hi' ? 'राज्य (State) *' : 'State *'}
                </label>
                <select
                  value={formData.stateId}
                  onChange={(e) => setFormData({ ...formData, stateId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-none"
                  required
                >
                  <option value="state-rj">Rajasthan (राजस्थान)</option>
                  <option value="state-hr">Haryana (हरियाणा)</option>
                  <option value="state-pb">Punjab (पंजाब)</option>
                  <option value="state-up">Uttar Pradesh (उत्तर प्रदेश)</option>
                  <option value="state-mp">Madhya Pradesh (मध्य प्रदेश)</option>
                  <option value="state-mh">Maharashtra (महाराष्ट्र)</option>
                  <option value="state-gj">Gujarat (गुजरात)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {language === 'hi' ? 'ज़िला (District) *' : 'District *'}
                </label>
                <select
                  value={formData.districtId}
                  onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-none"
                  required
                >
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.hindiName || d.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3 text-xs sm:text-sm font-bold shadow-md bg-emerald-700 hover:bg-emerald-800 flex items-center justify-center gap-2"
              >
                <span>
                  {isSubmitting
                    ? 'Creating Account...'
                    : language === 'hi'
                    ? 'खाता बनाएं एवं स्लॉट बुक करें'
                    : 'Create Farmer Account & Sign In'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Already registered login link */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              {language === 'hi' ? 'पहले से खाता है?' : 'Already registered?'}{' '}
              <Link
                to="/login"
                className="font-bold text-emerald-700 hover:text-emerald-800 underline inline-flex items-center gap-1"
              >
                <span>{language === 'hi' ? 'मोबाइल नंबर और ओटीपी से लॉगिन करें' : 'Sign in with Phone + OTP'}</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
