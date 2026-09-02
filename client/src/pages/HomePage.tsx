import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { LiveOpenDataTicker } from '../components/LiveOpenDataTicker';
import {
  CalendarCheck2,
  Ticket,
  Activity,
  FileSpreadsheet,
  Search,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  Smartphone,
  Cpu,
  TrendingDown,
  Building,
  Wheat,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Quick Search States
  const [states, setStates] = useState<any[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string>('state-hr');
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('dist-hr-sonipat');
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load States for search
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.getStates();
        if (res.success && res.states) {
          setStates(res.states);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStates();
  }, []);

  // When state changes, update districts
  useEffect(() => {
    if (selectedStateId && states.length > 0) {
      const stateObj = states.find((s) => s.id === selectedStateId);
      if (stateObj && stateObj.config) {
        // Fetch full state details to get its districts
        api.getStateDetails(selectedStateId).then((res) => {
          if (res.success && res.state?.districts) {
            setDistricts(res.state.districts);
            if (res.state.districts.length > 0) {
              setSelectedDistrictId(res.state.districts[0].id);
            }
          }
        });
      }
    }
  }, [selectedStateId, states]);

  // Handle Quick Search
  const handleQuickSearch = async () => {
    setIsSearching(true);
    try {
      const res = await api.getCenters({
        stateId: selectedStateId,
        districtId: selectedDistrictId,
      });
      if (res.success && res.centers) {
        setSearchResults(res.centers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    handleQuickSearch();
  }, [selectedDistrictId]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 space-y-16 pb-20">
      {/* Logged-in Farmer Quick Action Header Banner */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-agri-950 via-agri-900 to-emerald-950 text-white border-b border-emerald-500/20 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-200 font-bold">
                  {language === 'hi' ? 'नमस्ते' : 'Welcome'}, <strong className="text-white font-extrabold">{user?.name || user?.farmerProfile?.fullName || 'Farmer'}</strong>
                  {user?.farmerProfile?.district?.name ? ` (${user.farmerProfile.district.name})` : ''}
                </p>
                <p className="text-[11px] text-emerald-100/70 hidden sm:block">
                  {language === 'hi' ? 'त्वरित सुविधाएं: खरीद स्लॉट बुक करें या अपनी स्थिति ट्रैक करें' : 'Quick Actions: Book Procurement Slot or Track Live Status'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/farmer/book-slot"
                className="btn-accent py-2 px-4 text-xs font-black flex items-center gap-1.5 shadow-md bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl"
              >
                <CalendarCheck2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'स्लॉट बुक करें' : 'Book Slot'}</span>
              </Link>

              <Link
                to="/farmer/procurement"
                className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                <span>{language === 'hi' ? 'खरीद ट्रैक करें' : 'Track Procurement'}</span>
              </Link>

              <Link
                to="/farmer/dashboard"
                className="hidden md:flex py-2 px-3 text-xs font-semibold items-center gap-1 text-emerald-300 hover:text-white"
              >
                <span>{language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'} &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-agri-50 via-white to-[#f8fafc] pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200/70">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* National Initiative Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-100/80 border border-agri-300 text-agri-900 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-agri-600 animate-ping" />
              <span>{t.sihBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              {language === 'hi' ? (
                <>
                  लंबी कतारों में बिना रुके <span className="text-agri-700 underline decoration-harvest-400 decoration-wavy">अपनी फसल बेचें</span>
                </>
              ) : (
                <>
                  Sell Your Crop <span className="text-agri-700 underline decoration-harvest-400 decoration-wavy">Without Waiting</span> in Long Queues
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/farmer/book-slot"
                className="btn-accent w-full sm:w-auto text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-harvest-600/30 flex items-center justify-center gap-2 font-bold"
              >
                <CalendarCheck2 className="w-5 h-5" />
                <span>{language === 'hi' ? 'खरीद स्लॉट बुक करें (Book Slot)' : 'Book Procurement Slot'}</span>
              </Link>

              <Link
                to="/farmer/procurement"
                className="btn-secondary w-full sm:w-auto text-base px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-sm bg-white hover:bg-slate-50 border border-slate-300"
              >
                <FileSpreadsheet className="w-5 h-5 text-agri-700" />
                <span>{language === 'hi' ? 'खरीद स्थिति ट्रैक करें (Track)' : 'Track Procurement Status'}</span>
              </Link>
            </div>

            {/* Trust Pill */}
            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-agri-600" /> Zero Waiting Time
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-agri-600" /> Transparent MSP Rates
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-agri-600" /> Direct Bank (DBT)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 CORE FARMER UX ACTIONS (Rule: Do not overwhelm farmer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Action 1: Book Slot */}
          <Link
            to="/farmer/book-slot"
            className="group card p-6 bg-gradient-to-br from-white to-emerald-50/40 border-2 border-agri-200 hover:border-agri-600 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-agri-700 text-white flex items-center justify-center shadow-md shadow-agri-700/30 group-hover:scale-110 transition-transform mb-4">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-agri-800 transition-colors">
              {t.actionBookSlot}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t.actionBookSlotDesc}
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-agri-700 group-hover:translate-x-1 transition-transform">
              <span>{language === 'hi' ? 'स्लॉट चुनें' : 'Choose Slot'}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Action 2: Track Token */}
          <Link
            to="/farmer/queue"
            className="group card p-6 bg-gradient-to-br from-white to-amber-50/40 border-2 border-amber-200 hover:border-amber-500 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-harvest-500 text-white flex items-center justify-center shadow-md shadow-harvest-500/30 group-hover:scale-110 transition-transform mb-4">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-harvest-700 transition-colors">
              {t.actionTrackToken}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t.actionTrackTokenDesc}
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-harvest-700 group-hover:translate-x-1 transition-transform">
              <span>{language === 'hi' ? 'कतार देखें' : 'View Queue'}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Action 3: Mandi Status */}
          <Link
            to="/mandi-status"
            className="group card p-6 bg-gradient-to-br from-white to-sky-50/40 border-2 border-sky-200 hover:border-sky-500 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/30 group-hover:scale-110 transition-transform mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
              {t.actionMandiStatus}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t.actionMandiStatusDesc}
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-sky-700 group-hover:translate-x-1 transition-transform">
              <span>{language === 'hi' ? 'भीड़ जांचें' : 'Check Load'}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Action 4: My Procurement */}
          <Link
            to="/farmer/procurement"
            className="group card p-6 bg-gradient-to-br from-white to-purple-50/40 border-2 border-purple-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30 group-hover:scale-110 transition-transform mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
              {t.actionMyProcurement}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t.actionMyProcurementDesc}
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-purple-700 group-hover:translate-x-1 transition-transform">
              <span>{language === 'hi' ? 'रसीद देखें' : 'View J-Form'}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. QUICK SEARCH SECTION (Find Procurement Center) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-6 sm:p-8 bg-white border border-slate-200 shadow-md">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-agri-700 font-bold text-xs uppercase tracking-wider">
              <Search className="w-4 h-4" />
              <span>{language === 'hi' ? 'सटीक खोज' : 'Instant Center Search'}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">{t.quickSearchTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.quickSearchSubtitle}</p>
          </div>

          {/* Search Inputs Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
            {/* State Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.selectState}</label>
              <select
                value={selectedStateId}
                onChange={(e) => setSelectedStateId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
              >
                {states.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.hindiName})
                  </option>
                ))}
              </select>
            </div>

            {/* District Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.selectDistrict}</label>
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.hindiName})
                  </option>
                ))}
              </select>
            </div>

            {/* Crop Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.selectCrop}</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
              >
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Paddy">Paddy / Rice (धान)</option>
                <option value="Mustard">Mustard (सरसों)</option>
                <option value="Bajra">Bajra (बाजरा)</option>
                <option value="Maize">Maize (मक्का)</option>
                <option value="Cotton">Cotton (कपास)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
              </select>
            </div>

            {/* Find Button */}
            <div className="flex items-end">
              <button
                onClick={handleQuickSearch}
                disabled={isSearching}
                className="btn-primary w-full py-2 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t.btnFindCenters}</span>
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {language === 'hi' ? `उपलब्ध खरीद केंद्र (${searchResults.length})` : `Available Procurement Centers (${searchResults.length})`}
            </h3>

            {searchResults.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                No centers found for selected criteria. Please change state or district.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((center) => (
                  <div
                    key={center.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-agri-500 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{center.name}</h4>
                        <span className="badge-success text-[10px] whitespace-nowrap">
                          {center.queueStatus || 'MEDIUM QUEUE'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-agri-600 flex-shrink-0" />
                        <span className="line-clamp-1">{center.address}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                      <div className="p-2 rounded-xl bg-slate-50 space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-amber-500" /> {t.estimatedWait}
                        </span>
                        <p className="font-bold text-slate-800">{center.currentWaitMinutes || 42} {t.min}</p>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                          <Users className="w-2.5 h-2.5 text-agri-600" /> {t.currentQueue}
                        </span>
                        <p className="font-bold text-slate-800">{center.currentQueue || 38} {t.farmers}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-semibold text-emerald-700">
                        {center.availableSlotsCount || 27} {t.availableSlots}
                      </span>
                      <Link
                        to={`/farmer/book-slot?centerId=${center.id}`}
                        className="btn-primary text-xs py-1.5 px-3.5 font-bold"
                      >
                        {t.btnViewSlots}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3.5. LIVE OPEN DATA & WEATHER RADAR INTELLIGENCE HUB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LiveOpenDataTicker />
      </section>

      {/* 4. HOW KISANSETU WORKS (6-Step Architecture) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="badge-info text-xs">{language === 'hi' ? 'पारदर्शी प्रक्रिया' : 'Transparent Workflow'}</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{t.howItWorksTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-600">{t.howItWorksSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: t.step1Title, desc: t.step1Desc, icon: Smartphone, tag: 'Quick Sign-In' },
            { title: t.step2Title, desc: t.step2Desc, icon: Wheat, tag: 'Crop & MSP' },
            { title: t.step3Title, desc: t.step3Desc, icon: CalendarCheck2, tag: 'Smart Slot' },
            { title: t.step4Title, desc: t.step4Desc, icon: Ticket, tag: 'Digital Pass' },
            { title: t.step5Title, desc: t.step5Desc, icon: Activity, tag: 'Live Queue' },
            { title: t.step6Title, desc: t.step6Desc, icon: FileSpreadsheet, tag: 'Direct DBT' },
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="card p-6 bg-white border border-slate-200 hover:border-agri-500 hover:shadow-lg transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center font-bold group-hover:bg-agri-700 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {step.tag}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. ONE PLATFORM ACROSS INDIA (State Configuration Engine Visual) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-8 sm:p-12 border border-slate-700 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-400/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>Core Innovation • State Configuration Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {t.stateEngineTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.stateEngineSubtitle}
            </p>

            {/* 3 State Comparison Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-emerald-300">Haryana</strong>
                  <span className="text-[10px] bg-emerald-900/80 px-1.5 py-0.5 rounded text-emerald-200">60 Min Slots</span>
                </div>
                <p className="text-[11px] text-slate-300">Channels: SMS, WhatsApp, Push</p>
                <p className="text-[10px] text-slate-400 font-mono">Mode: Centralized</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-emerald-300">Madhya Pradesh</strong>
                  <span className="text-[10px] bg-emerald-900/80 px-1.5 py-0.5 rounded text-emerald-200">30 Min Slots</span>
                </div>
                <p className="text-[11px] text-slate-300">Channels: SMS, Push, App</p>
                <p className="text-[10px] text-slate-400 font-mono">Mode: Centralized (e-Uparjan)</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-emerald-300">Maharashtra</strong>
                  <span className="text-[10px] bg-emerald-900/80 px-1.5 py-0.5 rounded text-emerald-200">30 Min Slots</span>
                </div>
                <p className="text-[11px] text-slate-300">Channels: SMS, WhatsApp, App</p>
                <p className="text-[10px] text-slate-400 font-mono">Mode: Hybrid (APMC Model)</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                to="/states"
                className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-1.5"
              >
                <span>{language === 'hi' ? 'सभी राज्यों के नियम देखें' : 'Explore All State Rules'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INDIA-WIDE LIVE METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 bg-white border border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-x-0 sm:divide-x divide-slate-100">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-agri-700">9+</div>
              <p className="text-xs font-semibold text-slate-500 uppercase">{t.statStates}</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-agri-700">418+</div>
              <p className="text-xs font-semibold text-slate-500 uppercase">{t.statCenters}</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-agri-700">4,82,900+</div>
              <p className="text-xs font-semibold text-slate-500 uppercase">{t.statFarmers}</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-harvest-600 flex items-center justify-center gap-1">
                <span>38</span>
                <span className="text-base font-bold text-slate-600">min</span>
                <TrendingDown className="w-5 h-5 text-emerald-600 ml-1" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase">{t.statWaitTime}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
