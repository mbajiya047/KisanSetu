import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import {
  Activity,
  ArrowUpDown,
  Clock,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LiveOpenDataTicker } from '../components/LiveOpenDataTicker';

export const MandiStatusPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [centers, setCenters] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'wait' | 'queue' | 'slots' | 'distance'>('wait');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadStatus = async () => {
    try {
      const res = await api.getCenters();
      if (res.success && res.centers) {
        setCenters(res.centers);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Filter & Sort
  const filtered = centers
    .filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.address.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || c.queueStatus === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'wait') return a.currentWaitMinutes - b.currentWaitMinutes;
      if (sortBy === 'queue') return a.currentQueue - b.currentQueue;
      if (sortBy === 'slots') return b.availableSlotsCount - a.availableSlotsCount;
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
            <Activity className="w-3.5 h-3.5 text-sky-700" />
            <span>National Live Mandi Congestion Radar</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'अखिल भारतीय मंडी स्थिति' : 'All-India Mandi Live Queue Status'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {language === 'hi'
              ? 'देशभर की मंडियों में लाइव कतार लोड, प्रतीक्षारत किसान और उपलब्ध क्षमता का वास्तविक समय विश्लेषण।'
              : 'Real-time queue congestion levels across agricultural procurement hubs to prevent mandi bottlenecks.'}
          </p>
        </div>

        <button
          onClick={loadStatus}
          className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 bg-white"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Real-time Open Data Market Prices & Weather Radar */}
      <LiveOpenDataTicker />

      {/* Sorting and Filters */}
      <div className="card p-5 bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {['ALL', 'LOW QUEUE', 'MEDIUM QUEUE', 'HIGH QUEUE'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-agri-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
            >
              <option value="wait">Lowest Waiting Time</option>
              <option value="queue">Smallest Queue</option>
              <option value="slots">Maximum Slots Available</option>
              <option value="distance">Nearest Distance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mandi Cards Table / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((mandi) => {
          let statusBadgeClass = 'badge-success';
          if (mandi.queueStatus === 'MEDIUM QUEUE') statusBadgeClass = 'badge-warning';
          if (mandi.queueStatus === 'HIGH QUEUE') statusBadgeClass = 'badge-danger';

          return (
            <div
              key={mandi.id}
              className="card p-6 bg-white border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{mandi.name}</h3>
                    <p className="text-xs text-slate-500">{mandi.address.split(',')[0]} • {mandi.state?.name || 'Haryana'}</p>
                  </div>
                  <span className={`${statusBadgeClass} text-[10px] font-black uppercase whitespace-nowrap`}>
                    {mandi.queueStatus || 'LOW QUEUE'}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-slate-100">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 uppercase block">Queue</span>
                    <strong className="text-sm text-slate-800 font-black">{mandi.currentQueue || 38}</strong>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 uppercase block">Waiting</span>
                    <strong className="text-sm text-amber-600 font-black">{mandi.currentWaitMinutes || 42} min</strong>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 uppercase block">Slots</span>
                    <strong className="text-sm text-emerald-700 font-black">{mandi.availableSlotsCount || 27}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Capacity Utilization:</span>
                  <strong className="text-slate-800">{mandi.capacityUtilizationPercent || 65}%</strong>
                </div>
              </div>

              <Link
                to={`/farmer/book-slot?centerId=${mandi.id}`}
                className="btn-primary w-full py-2.5 text-xs font-bold text-center"
              >
                {t.actionBookSlot}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
