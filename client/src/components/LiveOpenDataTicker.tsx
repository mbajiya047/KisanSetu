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
} from 'lucide-react';

export const LiveOpenDataTicker: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'PRICES' | 'WEATHER'>('WEATHER');
  const [searchQuery, setSearchQuery] = useState('');
  const [prices, setPrices] = useState<any[]>([]);
  const [weatherList, setWeatherList] = useState<any[]>([]);
  const [customSearchResult, setCustomSearchResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingWeather, setIsSearchingWeather] = useState(false);

  const fetchIntelligenceData = async () => {
    setIsLoading(true);
    try {
      const pRes = await api.getLiveMarketPrices();
      if (pRes.success && pRes.prices) {
        setPrices(pRes.prices);
      }

      // Key agricultural hubs across India (including Rajasthan, Haryana, Punjab, MP, Maharashtra)
      const keyCenters = [
        'center-sonipat-main',
        'center-nagaur-main',
        'center-jaipur-surajpole',
        'center-kota-main',
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
  }, []);

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

  // Quick place tags
  const popularPlaces = [
    'Nagaur',
    'Jaipur',
    'Sikar',
    'Bikaner',
    'Jodhpur',
    'Alwar',
    'Sonipat',
    'Khanna',
    'Kota',
    'Sehore',
  ];

  // Filtered prices for Prices tab
  const filteredPrices = prices.filter(
    (p) =>
      !searchQuery.trim() ||
      p.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered weather cards
  const filteredWeatherList = weatherList.filter(
    (w) =>
      !searchQuery.trim() ||
      w.centerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white border border-slate-800 shadow-xl rounded-3xl overflow-hidden space-y-6">
      {/* Header with Title & Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>
              {language === 'hi'
                ? 'राष्ट्रीय मंडी मूल्य एवं मौसम रडार'
                : 'National Agriculture Market & Weather Radar'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {language === 'hi'
              ? 'लाइव ई-नाम मंडी भाव एवं मौसम स्थिति'
              : 'Live e-NAM Mandi Prices & Weather Intelligence'}
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'hi'
              ? 'किसी भी स्थान या मंडी का नाम खोजें और तुरंत वास्तविक समय मौसम एवं भाव देखें।'
              : 'Search any city, district, or APMC mandi to view real-time weather conditions & price benchmarks.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-1 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab('WEATHER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'WEATHER'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'मंडी मौसम रडार' : 'Weather Radar'}</span>
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
            <span>{language === 'hi' ? 'दैनिक मंडी भाव' : 'Live Market Prices'}</span>
          </button>

          <button
            onClick={() => {
              fetchIntelligenceData();
              if (searchQuery.trim()) handlePlaceSearch();
            }}
            title="Refresh Data"
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* SEARCH BAR SECTION */}
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
              activeTab === 'WEATHER'
                ? language === 'hi'
                  ? 'किसी भी शहर, ज़िला या मंडी का नाम खोजें (जैसे: Nagaur, Jaipur, Sikar, Bikaner, Jodhpur, Alwar, Sonipat...)'
                  : 'Search any city, district, or mandi weather (e.g. Nagaur, Jaipur, Sikar, Bikaner, Jodhpur, Alwar, Sonipat...)'
                : language === 'hi'
                ? 'फसल या मंडी खोजें (जैसे: Wheat, Mustard, Moong, Bajra, Soybean, Sonipat, Kota...)'
                : 'Search crop or market prices (e.g. Wheat, Mustard, Moong, Bajra, Soybean, Sonipat, Kota...)'
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

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex-shrink-0">
            {language === 'hi' ? 'त्वरित स्थान:' : 'Quick Hubs:'}
          </span>
          {popularPlaces.map((place) => (
            <button
              key={place}
              onClick={() => {
                setSearchQuery(place);
                handlePlaceSearch(place);
              }}
              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 text-[11px] font-semibold transition-all whitespace-nowrap"
            >
              {place}
            </button>
          ))}
        </div>
      </div>

      {/* CUSTOM PLACE SEARCH RESULT BANNER (If user searched any place) */}
      {customSearchResult && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-850 to-slate-900 border-2 border-emerald-500/40 shadow-xl space-y-4 animate-fade-in">
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
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {customSearchResult.centerName}
                  </h3>
                  <span className="badge-success text-[10px] py-0.5 px-2 font-mono">
                    Live Verified
                  </span>
                </div>
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
              <strong>Agricultural Advisory:</strong> {customSearchResult.weather.recommendedAction}
            </span>
          </div>
        </div>
      )}

      {/* Tab 1: Live Market Prices */}
      {activeTab === 'PRICES' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrices.length === 0 ? (
            <div className="col-span-full p-8 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-800">
              <Wheat className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <p className="text-xs">No mandi prices found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredPrices.map((p, idx) => {
              const diff = p.modalPrice - p.mspRate;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-emerald-500/50 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                        🌾
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {language === 'hi' ? p.hindiName || p.commodity : p.commodity}
                        </h4>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {p.market.split(' ')[0]}, {p.state}
                        </span>
                      </div>
                    </div>

                    <span className="badge-success text-[10px] font-bold py-0.5 px-2">
                      +{diff >= 0 ? `₹${diff}` : `-₹${Math.abs(diff)}`} vs MSP
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        {language === 'hi' ? 'मंडी मॉडल भाव' : 'Today Modal Rate'}
                      </span>
                      <span className="text-base font-black text-emerald-400 font-mono">
                        ₹{p.modalPrice.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-slate-400">/ Qtl</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Govt MSP Rate
                      </span>
                      <span className="text-xs font-bold text-slate-300 font-mono">
                        ₹{p.mspRate.toLocaleString('en-IN')} / Qtl
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>
                      Arrivals: <strong className="text-slate-200">{p.dailyArrivalsMT} MT</strong>
                    </span>
                    <span className="text-emerald-400 font-semibold">● High Demand</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Live Weather Radar & Rain Alert System */}
      {activeTab === 'WEATHER' && !customSearchResult && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWeatherList.length === 0 ? (
            <div className="col-span-full p-8 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-800">
              <CloudSun className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <p className="text-xs">
                No local mandi center matching "{searchQuery}". Click 'Search' above to fetch live weather for any place across India!
              </p>
            </div>
          ) : (
            filteredWeatherList.map((w, idx) => {
              const isRain = w.weather?.isRainAlert;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isRain
                      ? 'bg-amber-950/30 border-amber-500/40'
                      : 'bg-slate-800/60 border-slate-700/80 hover:border-emerald-500/50'
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
            })
          )}
        </div>
      )}
    </div>
  );
};
