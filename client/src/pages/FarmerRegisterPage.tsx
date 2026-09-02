import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import {
  User,
  MapPin,
  Landmark,
  Wheat,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const FarmerRegisterPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Ramesh Kumar',
    fatherName: 'Shri Ram Swaroop',
    stateId: 'state-hr',
    districtId: 'dist-hr-sonipat',
    village: 'Murthal',
    totalLandAcres: '6.5',
    khasraNumber: '142//18/2',
    bankName: 'State Bank of India',
    accountNumber: 'XXXX-XXXX-4819',
    ifscCode: 'SBIN0001482',
    cropId: 'crop-wheat',
    cultivatedAreaAcres: '5.0',
    estimatedYieldQuintals: '42.0',
    season: 'Rabi 2026',
  });

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const res = await api.getStates();
        if (res.success && res.states) {
          setStates(res.states);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadMetadata();
  }, []);

  useEffect(() => {
    if (formData.stateId) {
      api.getStateDetails(formData.stateId).then((res) => {
        if (res.success && res.state?.districts) {
          setDistricts(res.state.districts);
        }
      });
    }
  }, [formData.stateId]);

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.registerFarmer(formData);
      if (res.success) {
        await refreshUser();
        navigate('/farmer/dashboard');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="badge-info text-xs font-bold">
          {language === 'hi' ? 'किसान पंजीकरण फॉर्म' : 'Farmer Registration'}
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'अपनी कृषि भूमि एवं फसल पंजीकृत करें' : 'Register Your Farm & Crop'}
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {language === 'hi'
            ? 'केवल 3 सरल चरणों में अपना किसान प्रोफ़ाइल पूरा करें और खरीद स्लॉट बुक करना शुरू करें।'
            : 'Complete your profile in 3 simple steps to start booking mandi procurement slots.'}
        </p>
      </div>

      {/* 3-Step Stepper Bar */}
      <div className="card p-4 bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        {[
          { step: 1, label: language === 'hi' ? '1. व्यक्तिगत व पता' : '1. Personal & Location', icon: User },
          { step: 2, label: language === 'hi' ? '2. भूमि व बैंक' : '2. Land & Bank', icon: Landmark },
          { step: 3, label: language === 'hi' ? '3. फसल विवरण' : '3. Crop Details', icon: Wheat },
        ].map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.step;
          const isDone = currentStep > s.step;
          return (
            <div key={s.step} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-agri-700 text-white shadow-md'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone ? '✓' : s.step}
              </div>
              <span
                className={`text-xs font-semibold hidden sm:inline ${
                  isActive ? 'text-agri-900 font-bold' : 'text-slate-500'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Steps Card */}
      <div className="card p-6 sm:p-8 bg-white border border-slate-200 shadow-md">
        <form onSubmit={handleSubmitRegistration} className="space-y-6">
          {/* STEP 1: Personal & Location */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold uppercase tracking-wider text-agri-700 flex items-center gap-1.5">
                <User className="w-4 h-4" /> Personal & Residential Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (पूरा नाम)</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Father's Name (पिता का नाम)</label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State (राज्य)</label>
                  <select
                    value={formData.stateId}
                    onChange={(e) => setFormData({ ...formData, stateId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                  >
                    {states.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.hindiName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District (जिला)</label>
                  <select
                    value={formData.districtId}
                    onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                  >
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.hindiName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Village / Gram Panchayat (गाँव / ग्राम पंचायत)</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Continue to Land Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Land & Bank */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold uppercase tracking-wider text-agri-700 flex items-center gap-1.5">
                <Landmark className="w-4 h-4" /> Agricultural Land & Bank Account Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Land (कुल भूमि - एकड़)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.totalLandAcres}
                    onChange={(e) => setFormData({ ...formData, totalLandAcres: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khasra / Murabba Number (खसरा संख्या)</label>
                  <input
                    type="text"
                    value={formData.khasraNumber}
                    onChange={(e) => setFormData({ ...formData, khasraNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name (बैंक का नाम)</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">IFSC Code (आईएफएससी कोड)</label>
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 uppercase focus:ring-2 focus:ring-agri-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn-secondary py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Continue to Crop Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Crop Details */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold uppercase tracking-wider text-agri-700 flex items-center gap-1.5">
                <Wheat className="w-4 h-4" /> Harvest Crop & Yield Estimates
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Crop (फसल का प्रकार)</label>
                  <select
                    value={formData.cropId}
                    onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                  >
                    <option value="crop-wheat">Wheat (गेहूं - MSP ₹2,275/Qtl)</option>
                    <option value="crop-paddy">Paddy / Rice (धान - MSP ₹2,300/Qtl)</option>
                    <option value="crop-mustard">Mustard (सरसों - MSP ₹5,650/Qtl)</option>
                    <option value="crop-bajra">Bajra (बाजरा - MSP ₹2,500/Qtl)</option>
                    <option value="crop-maize">Maize (मक्का - MSP ₹2,090/Qtl)</option>
                    <option value="crop-cotton">Cotton (कपास - MSP ₹7,020/Qtl)</option>
                    <option value="crop-soybean">Soybean (सोयाबीन - MSP ₹4,892/Qtl)</option>
                    <option value="crop-chana">Gram / Chana (चना - MSP ₹5,440/Qtl)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cultivated Area (बोया गया क्षेत्रफल - एकड़)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.cultivatedAreaAcres}
                    onChange={(e) => setFormData({ ...formData, cultivatedAreaAcres: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Yield (अनुमानित उपज - क्विंटल)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.estimatedYieldQuintals}
                    onChange={(e) => setFormData({ ...formData, estimatedYieldQuintals: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Season (सत्र)</label>
                  <input
                    type="text"
                    value={formData.season}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn-secondary py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-3 px-8 text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>{isSubmitting ? 'Registering...' : 'Complete Farmer Registration'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
