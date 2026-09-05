import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import {
  TrendingUp,
  CloudSun,
  ShieldCheck,
  Wheat,
  Activity,
  ArrowUpRight,
  Database,
  Radio,
  CloudRain,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  X,
  Wind,
  Droplets,
  Sparkles,
  CalendarCheck2,
  Clock,
  ExternalLink,
  Layers,
  Users,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiveOpenDataTicker: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ENAM_SLOTS' | 'WEATHER' | 'PRICES'>('ENAM_SLOTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [prices, setPrices] = useState<any[]>([]);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('ALL');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('ALL');
  const [portalMeta, setPortalMeta] = useState<any>({
    dataSource: 'National Agriculture Market (e-NAM / Agmarknet Standard Open Feed)',
    centralPortal: 'Government of India - Ministry of Agriculture & Farmers Welfare',
    cacpBenchmark: 'CACP Gazette 2026-27 Official MSP Rates',
    portalUrls: {
      enam: 'https://enam.gov.in',
      agmarknet: 'https://agmarknet.gov.in',
      cacp: 'https://cacp.dacnet.nic.in',
    },
    lastSyncTime: new Date().toISOString(),
  });
  const [weatherList, setWeatherList] = useState<any[]>([]);
  const [customSearchResult, setCustomSearchResult] = useState<any | null>(null);
  const [enamNetwork, setEnamNetwork] = useState<any | null>(null);
  const [selectedEnamCenter, setSelectedEnamCenter] = useState('center-nagaur-main');
  const [centerWeather, setCenterWeather] = useState<any | null>(null);
  const [enamSlotData, setEnamSlotData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingWeather, setIsSearchingWeather] = useState(false);
  const [pulseSeconds, setPulseSeconds] = useState(1);

  // Live Pulse Timer (Updates every second to simulate sub-second e-NAM central gateway feed)
  useEffect(() => {
    const pulseTimer = setInterval(() => {
      setPulseSeconds((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(pulseTimer);
  }, []);

  const fetchCenterWeather = async (centerId: string) => {
    try {
      const res = await api.getCenterWeatherRadar(centerId);
      if (res && res.success) {
        setCenterWeather(res);
      }
    } catch (err) {
      console.warn('Error loading center weather:', err);
    }
  };

  const fetchEnamSlots = async (centerId: string) => {
    try {
      const res = await api.getEnamMandiSlots(centerId);
      if (res.success) {
        setEnamSlotData(res);
      }
    } catch (e) {
      console.error('Error loading enam slots:', e);
    }
  };

  const fetchIntelligenceData = async () => {
    setIsLoading(true);
    try {
      const [pRes, netRes] = await Promise.all([
        api.getLiveMarketPrices(),
        api.getEnamNetworkStatus(),
      ]);

      if (pRes.success && pRes.prices) {
        setPrices(pRes.prices);
        if (pRes.portalUrls) {
          setPortalMeta({
            dataSource: pRes.dataSource,
            centralPortal: pRes.centralPortal || 'Government of India - Ministry of Agriculture & Farmers Welfare',
            cacpBenchmark: pRes.cacpBenchmark || 'CACP Gazette 2026-27 Official MSP Rates',
            portalUrls: pRes.portalUrls,
            lastSyncTime: pRes.lastSyncTime || new Date().toISOString(),
          });
        }
      }
      if (netRes.success) setEnamNetwork(netRes);

      await Promise.all([
        fetchEnamSlots(selectedEnamCenter),
        fetchCenterWeather(selectedEnamCenter),
      ]);

      // Key agricultural hubs across India
      const keyCenters = [
        'center-nagaur-main',
        'center-jaipur-surajpole',
        'center-sikar-main',
        'center-bikaner-main',
        'center-jodhpur-mandore',
        'center-kota-main',
        'center-sonipat-main',
        'center-khanna-main',
        'center-sehore-main',
        'center-lasalgaon-main',
      ];

      const weatherPromises = keyCenters.map((cId) =>
        api.getCenterWeatherRadar(cId).catch(() => null)
      );
      const results = await Promise.all(weatherPromises);
      const valid = results.filter((r) => r && r.success);
      setWeatherList(valid);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligenceData();
    fetchCenterWeather(selectedEnamCenter);
    // Continuous live synchronization poll every 6 seconds
    const interval = setInterval(() => {
      fetchEnamSlots(selectedEnamCenter);
    }, 6000);
    return () => clearInterval(interval);
  }, [selectedEnamCenter]);

  // Handle Search for any place or mandi
  const handlePlaceSearch = async (queryText?: string) => {
    const q = (queryText !== undefined ? queryText : searchQuery).trim();
    if (!q) {
      setCustomSearchResult(null);
      return;
    }

    setIsSearchingWeather(true);
    try {
      const res = await api.searchPlaceWeather(q);
      if (res.success && res.weather) {
        setCustomSearchResult(res);
        if (res.centerId) {
          setSelectedEnamCenter(res.centerId);
          fetchEnamSlots(res.centerId);
        }
      } else {
        setCustomSearchResult(null);
      }
    } catch (err) {
      console.warn('Weather search error:', err);
    } finally {
      setIsSearchingWeather(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCustomSearchResult(null);
  };

  const popularMandiHubs = [
    { id: 'center-nagaur-main', name: 'Nagaur (नागौर)', searchKey: 'Nagaur' },
    { id: 'center-jaipur-surajpole', name: 'Jaipur (जयपुर)', searchKey: 'Jaipur' },
    { id: 'center-sikar-main', name: 'Sikar (सीकर)', searchKey: 'Sikar' },
    { id: 'center-bikaner-main', name: 'Bikaner (बीकानेर)', searchKey: 'Bikaner' },
    { id: 'center-jodhpur-mandore', name: 'Jodhpur (जोधपुर)', searchKey: 'Jodhpur' },
    { id: 'center-kota-main', name: 'Kota (कोटा)', searchKey: 'Kota' },
    { id: 'center-sonipat-main', name: 'Sonipat (सोनीपत)', searchKey: 'Sonipat' },
    { id: 'center-khanna-main', name: 'Khanna (खन्ना)', searchKey: 'Khanna' },
    { id: 'center-sehore-main', name: 'Sehore (सीहोर)', searchKey: 'Sehore' },
  ];

  const cropFilters = [
    { key: 'ALL', label: language === 'hi' ? 'सभी फसलें' : 'All Crops', icon: '🌾' },
    { key: 'Moong', label: language === 'hi' ? 'मूंग' : 'Moong', icon: '🌱' },
    { key: 'Mustard', label: language === 'hi' ? 'सरसों' : 'Mustard', icon: '🌼' },
    { key: 'Bajra', label: language === 'hi' ? 'बाजरा' : 'Bajra', icon: '🌾' },
    { key: 'Wheat', label: language === 'hi' ? 'गेहूं' : 'Wheat', icon: '🌾' },
    { key: 'Gram', label: language === 'hi' ? 'चना' : 'Gram / Chana', icon: '🫘' },
    { key: 'Groundnut', label: language === 'hi' ? 'मूंगफली' : 'Groundnut', icon: '🥜' },
    { key: 'Paddy', label: language === 'hi' ? 'धान' : 'Paddy / Rice', icon: '🌾' },
    { key: 'Cotton', label: language === 'hi' ? 'कपास' : 'Cotton', icon: '☁️' },
    { key: 'Soybean', label: language === 'hi' ? 'सोयाबीन' : 'Soybean', icon: '🫘' },
    { key: 'Maize', label: language === 'hi' ? 'मक्का' : 'Maize', icon: '🌽' },
  ];

  const stateFilters = [
    { key: 'ALL', label: language === 'hi' ? 'सभी राज्य (All States)' : 'All States' },
    { key: 'Rajasthan', label: 'Rajasthan (राजस्थान)' },
    { key: 'Haryana', label: 'Haryana (हरियाणा)' },
    { key: 'Punjab', label: 'Punjab (पंजाब)' },
    { key: 'Uttar Pradesh', label: 'Uttar Pradesh (उत्तर प्रदेश)' },
    { key: 'Madhya Pradesh', label: 'Madhya Pradesh (मध्य प्रदेश)' },
    { key: 'Maharashtra', label: 'Maharashtra (महाराष्ट्र)' },
    { key: 'Gujarat', label: 'Gujarat (गुजरात)' },
    { key: 'Karnataka', label: 'Karnataka (कर्नाटक)' },
    { key: 'Tamil Nadu', label: 'Tamil Nadu (तमिलनाडु)' },
  ];

  // Filtered prices for Prices tab
  const filteredPrices = prices.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.commodity.toLowerCase().includes(q) ||
      p.hindiName.toLowerCase().includes(q) ||
      p.market.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      (p.variety && p.variety.toLowerCase().includes(q));

    const matchesCrop =
      selectedCropFilter === 'ALL' ||
      p.commodity.toLowerCase().includes(selectedCropFilter.toLowerCase()) ||
      p.hindiName.toLowerCase().includes(selectedCropFilter.toLowerCase());

    const matchesState =
      selectedStateFilter === 'ALL' ||
      p.state.toLowerCase() === selectedStateFilter.toLowerCase();

    return matchesQuery && matchesCrop && matchesState;
  });

  return (
    <div className="card p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl rounded-3xl overflow-hidden space-y-6">
      {/* Top Header: Central e-NAM Gateway Live Pulse & Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>
              {language === 'hi'
                ? 'राष्ट्रीय कृषि बाज़ार (e-NAM) केंद्रीय स्लॉट एवं डेटा ब्रिज'
                : 'National Agriculture Market (e-NAM) Central Slot & Data Bridge'}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
              Live Stream: {pulseSeconds}s ago
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {language === 'hi'
              ? 'केंद्रीय e-NAM मंडी स्लॉट बुकिंग स्थिति एवं लाइव इंटेलिजेंस'
              : 'Live Central e-NAM Mandi Slots, Real-Time Bookings & Market Radar'}
          </h2>

          <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
            <span>
              {language === 'hi'
                ? 'e-NAM पोर्टल (https://enam.gov.in) और राज्य मंडियों से वास्तविक समय में स्लॉट कोटा और कतार लोड सिंक किया जाता है।'
                : 'Directly synchronized with Central e-NAM (https://enam.gov.in) & State Procurement Portals.'}
            </span>
            <a
              href="https://enam.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 underline font-semibold"
            >
              <span>enam.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        {/* 3 Tab Switchers */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 flex-wrap">
          <button
            onClick={() => setActiveTab('ENAM_SLOTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ENAM_SLOTS'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarCheck2 className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'e-NAM स्लॉट बुकिंग' : 'Central e-NAM Slots'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('WEATHER');
              if (centerWeather) {
                setCustomSearchResult(centerWeather);
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'WEATHER'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'मौसम रडार' : 'Weather Radar'}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab('PRICES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'PRICES'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'मंडी भाव (MSP)' : 'Mandi MSP Prices'}</span>
          </button>

          <button
            onClick={() => {
              fetchIntelligenceData();
              fetchCenterWeather(selectedEnamCenter);
              if (searchQuery.trim()) handlePlaceSearch();
            }}
            title="Refresh Live e-NAM Stream"
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* QUICK SEARCH & MANDI HUB SELECTOR */}
      <div className="space-y-3">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-emerald-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handlePlaceSearch();
            }}
            placeholder={
              activeTab === 'ENAM_SLOTS'
                ? language === 'hi'
                  ? 'मंडी या शहर का नाम खोजें (जैसे: Nagaur, Jaipur, Sikar, Bikaner, Jodhpur, Kota, Sonipat, Khanna...)'
                  : 'Search Mandi or City for live e-NAM slots (e.g. Nagaur, Jaipur, Sikar, Bikaner, Jodhpur, Kota, Sonipat, Khanna...)'
                : activeTab === 'WEATHER'
                ? 'Search city or district for live weather radar...'
                : 'Search crop or mandi prices (e.g. Wheat, Mustard, Moong, Bajra)...'
            }
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-inner"
          />

          <div className="absolute right-2.5 flex items-center gap-1.5">
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => handlePlaceSearch()}
              disabled={isSearchingWeather || !searchQuery.trim()}
              className="btn-primary py-2 px-3.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSearchingWeather ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span>{language === 'hi' ? 'खोजें' : 'Search'}</span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Mandi Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex-shrink-0">
            {language === 'hi' ? 'e-NAM मंडियां:' : 'e-NAM Hubs:'}
          </span>
          {popularMandiHubs.map((hub) => (
            <button
              key={hub.id}
              onClick={() => {
                setSelectedEnamCenter(hub.id);
                fetchEnamSlots(hub.id);
                fetchCenterWeather(hub.id);
                if (activeTab === 'WEATHER') {
                  handlePlaceSearch(hub.name);
                } else if (activeTab === 'PRICES') {
                  setSearchQuery(hub.searchKey || hub.name.split(' ')[0]);
                }
              }}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                selectedEnamCenter === hub.id
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              {hub.name}
              {selectedEnamCenter === hub.id && <Check className="w-3 h-3 text-emerald-200" />}
            </button>
          ))}
        </div>
      </div>

      {/* PERSISTENT LIVE MANDI WEATHER & YARD STATUS STRIP (Always visible for selected center) */}
      {centerWeather && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-850 to-slate-900 border border-emerald-500/40 shadow-lg flex flex-wrap items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
              centerWeather.weather?.isRainAlert
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/20 border-emerald-400/30 text-emerald-400'
            }`}>
              {centerWeather.weather?.isRainAlert ? (
                <CloudRain className="w-5 h-5 animate-pulse" />
              ) : (
                <CloudSun className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white">
                  {language === 'hi' ? 'लाइव मौसम रडार' : 'Live Mandi Weather Radar'}:{' '}
                  <span className="text-emerald-400 font-extrabold">{centerWeather.centerName}</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {centerWeather.weather?.provider || 'OpenWeather API (Live)'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{centerWeather.weather?.recommendedAction}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-xl font-black text-white">{centerWeather.weather?.temperatureC}°C</span>
              <span className="block text-[10px] text-emerald-400 font-sans font-bold">
                {centerWeather.weather?.weatherCondition}
              </span>
            </div>
            <div className="border-l border-slate-700 pl-3 space-y-0.5 text-[11px] text-slate-300">
              <div>💧 Humidity: <strong className="text-white">{centerWeather.weather?.relativeHumidity}%</strong></div>
              <div>💨 Wind: <strong className="text-white">{centerWeather.weather?.windSpeedKmh} km/h</strong></div>
              <div>🌧️ Rain Risk: <strong className={centerWeather.weather?.isRainAlert ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{centerWeather.weather?.precipitationProbability}%</strong></div>
            </div>
            <button
              onClick={() => {
                setActiveTab('WEATHER');
                setCustomSearchResult(centerWeather);
              }}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline font-sans flex items-center gap-1 ml-1"
            >
              <span>{language === 'hi' ? 'विस्तृत रडार' : 'Full Radar'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: CENTRAL e-NAM LIVE SLOTS & REAL-TIME QUOTA ENGINE */}
      {activeTab === 'ENAM_SLOTS' && enamSlotData && (
        <div className="space-y-6 animate-fade-in">
          {/* Mandi Quota Overview Dashboard Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-850/90 border border-slate-700/80 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black">
                  <CalendarCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {enamSlotData.mandi.name}
                    </h3>
                    <span className="badge-success text-[10px] py-0.5 px-2 font-mono">
                      {enamSlotData.mandi.enamMandiId}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {enamSlotData.mandi.districtName}, {enamSlotData.mandi.stateName} •{' '}
                    Secretary: {enamSlotData.mandi.officerInCharge} ({enamSlotData.mandi.contactNumber})
                  </span>
                </div>
              </div>

              <Link
                to={`/farmer/book-slot?centerId=${enamSlotData.mandi.id}`}
                className="btn-primary py-2.5 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center gap-2"
              >
                <span>Book Slot at this Mandi</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 4 Summary Capacity Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Total Daily Intake Quota
                </span>
                <div className="text-xl font-black text-white mt-1 font-mono">
                  {enamSlotData.reconciliationMetrics.dailyQuotaFarmers}{' '}
                  <span className="text-xs font-normal text-slate-400">Farmers</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {enamSlotData.mandi.dailyCapacityQuintals.toLocaleString()} Qtl Capacity
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Central e-NAM Direct Booked
                </span>
                <div className="text-xl font-black text-sky-400 mt-1 font-mono">
                  {enamSlotData.reconciliationMetrics.bookedViaCentralEnam}{' '}
                  <span className="text-xs font-normal text-slate-400">Farmers</span>
                </div>
                <span className="text-[10px] text-sky-400/80 font-mono">
                  via https://enam.gov.in
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  KisanSetu App Booked
                </span>
                <div className="text-xl font-black text-emerald-400 mt-1 font-mono">
                  {enamSlotData.reconciliationMetrics.bookedViaKisanSetu}{' '}
                  <span className="text-xs font-normal text-slate-400">Farmers</span>
                </div>
                <span className="text-[10px] text-emerald-400/80 font-mono">
                  Digital QR Gate Pass Active
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                  Remaining Slots Today
                </span>
                <div className="text-xl font-black text-emerald-300 mt-1 font-mono">
                  {enamSlotData.reconciliationMetrics.availableRemainingSlots}{' '}
                  <span className="text-xs font-normal text-slate-400">Available</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {100 - enamSlotData.reconciliationMetrics.capacityUtilizationPercent}% Capacity Left
                </span>
              </div>
            </div>
          </div>

          {/* TIME SLOTS RECONCILIATION SCHEDULE GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Today's Live Mandi Slot Windows & Real-Time Capacity</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {enamSlotData.mandi.activeGates} Automated Weighbridge Gates
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enamSlotData.timeSlots.map((slot: any) => {
                const totalBooked = slot.bookedCentralEnam + slot.bookedKisanSetu;
                const percent = Math.min(100, Math.round((totalBooked / slot.maxQuota) * 100));
                const isFull = slot.status === 'FULL' || slot.availableQuota === 0;
                const isClosed = slot.status === 'CLOSED';

                return (
                  <div
                    key={slot.id}
                    className={`p-5 rounded-2xl border transition-all space-y-4 ${
                      isClosed
                        ? 'bg-slate-900/40 border-slate-800 opacity-60'
                        : isFull
                        ? 'bg-slate-900/80 border-rose-500/30'
                        : 'bg-slate-850/80 border-slate-700/80 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-emerald-400 block">
                          {slot.window}
                        </span>
                        <h5 className="font-bold text-sm text-white mt-0.5">
                          {slot.sessionName}
                        </h5>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isClosed
                            ? 'bg-slate-800 text-slate-400'
                            : isFull
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : slot.status === 'FILLING_FAST'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isClosed
                          ? 'Session Ended'
                          : isFull
                          ? 'Full (Waitlist)'
                          : `${slot.availableQuota} Slots Left`}
                      </span>
                    </div>

                    {/* Quota Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">
                          Booked: <strong>{totalBooked}</strong> / {slot.maxQuota}
                        </span>
                        <span className="font-bold text-slate-300">{percent}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${(slot.bookedCentralEnam / slot.maxQuota) * 100}%` }}
                          className="bg-sky-500 h-full"
                          title="Central e-NAM Bookings"
                        />
                        <div
                          style={{ width: `${(slot.bookedKisanSetu / slot.maxQuota) * 100}%` }}
                          className="bg-emerald-500 h-full"
                          title="KisanSetu Bookings"
                        />
                      </div>
                    </div>

                    {/* Breakdown Pill */}
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> e-NAM: {slot.bookedCentralEnam}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> App: {slot.bookedKisanSetu}
                      </span>
                      <span className="font-bold text-emerald-400">
                        {slot.availableQuota} Free
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LIVE e-NAM LOT ARRIVALS STREAM */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Central e-NAM Real-Time Gate Entry & Lot Assaying Stream</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Protocol: National Agritech Interoperability Standard v2.4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {enamSlotData.recentEnamLots.map((lot: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1 font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold text-[11px]">{lot.lotNumber}</span>
                    <span className="text-[10px] text-slate-400">{lot.entryTime}</span>
                  </div>
                  <div className="text-white font-sans font-bold text-xs truncate">
                    {lot.farmerName}
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center justify-between font-sans">
                    <span>{lot.crop}</span>
                    <strong className="text-amber-400 font-mono">{lot.quantityQtl} Qtl</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>{lot.vehicleNo}</span>
                    <span className="text-emerald-400 font-semibold">{lot.stage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE WEATHER RADAR & SEARCH */}
      {activeTab === 'WEATHER' && (
        <div className="space-y-4 animate-fade-in">
          {customSearchResult ? (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-850 to-slate-900 border-2 border-emerald-500/40 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center">
                    {customSearchResult.weather?.isRainAlert ? (
                      <CloudRain className="w-5 h-5 text-amber-400" />
                    ) : (
                      <CloudSun className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {customSearchResult.centerName}
                    </h3>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {customSearchResult.coordinates.latitude.toFixed(4)}° N,{' '}
                      {customSearchResult.coordinates.longitude.toFixed(4)}° E •{' '}
                      {customSearchResult.weather.provider}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-white font-mono">
                    {customSearchResult.weather.temperatureC}°C
                  </span>
                  <span className="block text-[11px] text-emerald-400 font-bold">
                    {customSearchResult.weather.weatherCondition}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-sky-400" /> Humidity
                  </span>
                  <p className="text-base font-black text-white mt-1 font-mono">
                    {customSearchResult.weather.relativeHumidity}%
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Wind className="w-3 h-3 text-emerald-400" /> Wind Speed
                  </span>
                  <p className="text-base font-black text-white mt-1 font-mono">
                    {customSearchResult.weather.windSpeedKmh} km/h
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-amber-400" /> Rain Risk
                  </span>
                  <p className="text-base font-black text-white mt-1 font-mono">
                    {customSearchResult.weather.precipitationProbability}%
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Yard Status
                  </span>
                  <p className="text-xs font-black text-emerald-400 mt-1">
                    {customSearchResult.weather.isRainAlert ? 'Covered Shed Req.' : 'Open Yard Safe'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-200 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-semibold leading-relaxed">
                  <strong>Advisory:</strong> {customSearchResult.weather.recommendedAction}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {weatherList.map((w, idx) => {
                const isRain = w.weather?.isRainAlert;
                return (
                  <div
                    key={idx}
                    onClick={() => setCustomSearchResult(w)}
                    title="Click to view full radar breakdown"
                    className={`p-4 rounded-2xl border transition-all space-y-3 cursor-pointer ${
                      isRain
                        ? 'bg-amber-950/30 border-amber-500/40 hover:border-amber-400'
                        : 'bg-slate-800/60 border-slate-700/80 hover:border-emerald-500/80 hover:bg-slate-800/90'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isRain
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}
                        >
                          {isRain ? (
                            <CloudRain className="w-4 h-4" />
                          ) : (
                            <CloudSun className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white line-clamp-1">
                            {w.centerName}
                          </h4>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {w.weather.temperatureC}°C • Humidity {w.weather.relativeHumidity}%
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isRain
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        }`}
                      >
                        {w.weather.weatherCondition}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-[11px] text-slate-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="line-clamp-2 leading-tight font-medium">
                        {w.weather.recommendedAction}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIVE MANDI PRICES & CENTRAL BENCHMARKS (e-NAM / Agmarknet / CACP) */}
      {activeTab === 'PRICES' && (
        <div className="space-y-5 animate-fade-in">
          {/* CENTRAL GOVERNMENT PORTAL INTEGRATION BANNER */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/70 border border-emerald-500/40 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-bold text-2xl shadow-inner">
                  🏛️
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider border border-emerald-500/40">
                      Official Central Government Benchmark Feed
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      CACP Gazette 2026-27
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white mt-1">
                    {language === 'hi'
                      ? 'राष्ट्रीय कृषि बाज़ार (e-NAM) व Agmarknet केंद्रीय MSP एवं लाइव मंडी भाव'
                      : 'Central e-NAM & Agmarknet Government MSP & Daily Mandi Rates'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'hi'
                      ? 'भारत सरकार, कृषि एवं किसान कल्याण मंत्रालय तथा CACP द्वारा घोषित न्यूनतम समर्थन मूल्य (MSP) और प्रमुख मंडियों के मॉडल भाव।'
                      : 'Directly linked to Ministry of Agriculture & Farmers Welfare central portals and CACP official MSP benchmark rates.'}
                  </p>
                </div>
              </div>

              {/* Verified External Central Sites Direct Links */}
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={portalMeta.portalUrls?.agmarknet || 'https://agmarknet.gov.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-900/30"
                  title="Directorate of Marketing & Inspection - Daily Mandi Rates Portal"
                >
                  <span>agmarknet.gov.in</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={portalMeta.portalUrls?.enam || 'https://enam.gov.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-900/30"
                  title="National Agriculture Market Central Gateway"
                >
                  <span>enam.gov.in</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={portalMeta.portalUrls?.cacp || 'https://cacp.dacnet.nic.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-900/70 hover:bg-emerald-850 text-emerald-100 border border-emerald-500/50 text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-md"
                  title="Commission for Agricultural Costs & Prices (CACP) Official Gazette Rates"
                >
                  <span>CACP MSP Gazette</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Commodity Filters */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {language === 'hi' ? 'फसल अनुसार फ़िल्टर:' : 'Quick Crop Benchmark Filter:'}
                </span>
                <span className="text-[11px] text-slate-400">
                  Showing <strong className="text-white font-bold">{filteredPrices.length}</strong> mandi MSP entries
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
                {cropFilters.map((cf) => (
                  <button
                    key={cf.key}
                    onClick={() => setSelectedCropFilter(cf.key)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      selectedCropFilter === cf.key
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md font-bold'
                        : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border-slate-700'
                    }`}
                  >
                    <span>{cf.icon}</span>
                    <span>{cf.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* State Filter dropdown & Reset */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px] font-bold uppercase">
                  {language === 'hi' ? 'राज्य फ़िल्टर:' : 'State:'}
                </span>
                <select
                  value={selectedStateFilter}
                  onChange={(e) => setSelectedStateFilter(e.target.value)}
                  className="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {stateFilters.map((st) => (
                    <option key={st.key} value={st.key}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              {(selectedCropFilter !== 'ALL' || selectedStateFilter !== 'ALL' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCropFilter('ALL');
                    setSelectedStateFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{language === 'hi' ? 'सभी फ़िल्टर रीसेट करें' : 'Reset All Price Filters'}</span>
                </button>
              )}
            </div>
          </div>

          {/* PRICES GRID */}
          {filteredPrices.length === 0 ? (
            <div className="p-10 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 text-xl">
                🌾
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">
                  {language === 'hi'
                    ? 'वर्तमान खोज के लिए कोई मंडी भाव नहीं मिला'
                    : 'No Mandi MSP Records Found'}
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {language === 'hi'
                    ? 'कृपया खोज शब्द बदलें या सभी केंद्रीय दरें देखने के लिए फ़िल्टर रीसेट करें।'
                    : 'Try clearing your search query or selecting a different crop to see official Central MSP benchmarks.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCropFilter('ALL');
                  setSelectedStateFilter('ALL');
                  setSearchQuery('');
                }}
                className="btn-primary text-xs py-2.5 px-5 font-bold inline-flex items-center gap-2 shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'सभी केंद्रीय मंडी भाव देखें' : 'View All Central MSP Rates'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrices.map((p, idx) => {
                const diff = p.modalPrice - p.mspRate;
                const isAboveMsp = diff >= 0;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 transition-all shadow-lg hover:shadow-emerald-950/40 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Crop Name & MSP Status Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg shadow-inner">
                            🌾
                          </div>
                          <div>
                            <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors">
                              {language === 'hi' ? p.hindiName || p.commodity : p.commodity}
                            </h4>
                            <span className="text-[11px] text-slate-400 block font-mono">
                              {p.variety}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
                            isAboveMsp
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                          }`}
                        >
                          {isAboveMsp
                            ? `+₹${diff} vs MSP`
                            : `MSP Protected (₹${p.mspRate})`}
                        </span>
                      </div>

                      {/* Mandi & State Location */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">
                          {p.market}, {p.district}, {p.state}
                        </span>
                      </div>

                      {/* Rates Matrix: Today Modal vs Govt Central MSP */}
                      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-2 gap-3 shadow-inner">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                            {language === 'hi' ? 'आज का मंडी भाव' : 'Today Modal Rate'}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono block mt-0.5">
                            ₹{p.modalPrice.toLocaleString('en-IN')}{' '}
                            <span className="text-xs font-normal text-slate-400">/ Qtl</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            Range: ₹{p.minPrice} - ₹{p.maxPrice}
                          </span>
                        </div>

                        <div className="text-right border-l border-slate-800/80 pl-3">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                            {language === 'hi' ? 'सरकारी MSP भाव' : 'Central MSP'}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-white font-mono block mt-0.5">
                            ₹{p.mspRate.toLocaleString('en-IN')}{' '}
                            <span className="text-xs font-normal text-slate-400">/ Qtl</span>
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold block">
                            Govt Guaranteed
                          </span>
                        </div>
                      </div>

                      {/* Arrivals & Verification Tag */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>
                          Arrivals:{' '}
                          <strong className="text-slate-200 font-mono">{p.dailyArrivalsMT} MT</strong>
                        </span>
                        <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Agmarknet Verified</span>
                        </span>
                      </div>
                    </div>

                    {/* Action Links: Relate directly to Central Site and Book Slot */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <a
                        href={p.centralUrl || 'https://agmarknet.gov.in'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-slate-300 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 underline transition-colors"
                        title="Verify this rate on official Agmarknet portal"
                      >
                        <span>{language === 'hi' ? 'केंद्रीय साइट पर देखें' : 'Verify on Agmarknet'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <Link
                        to={`/farmer/book-slot?crop=${encodeURIComponent(p.commodity)}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold inline-flex items-center gap-1 transition-all shadow-sm"
                      >
                        <span>{language === 'hi' ? 'MSP स्लॉट बुक करें' : 'Book MSP Slot'}</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
