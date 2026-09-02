import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, MapPin, Users, Clock, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SmartRecommendationCardProps {
  centerName?: string;
  distanceKm?: number;
  currentQueue?: number;
  expectedWaitMinutes?: number;
  availableSlots?: number;
  reason?: string;
  centerId?: string;
}

export const SmartRecommendationCard: React.FC<SmartRecommendationCardProps> = ({
  centerName = 'Sonipat Central Grain Mandi',
  distanceKm = 4.2,
  currentQueue = 38,
  expectedWaitMinutes = 42,
  availableSlots = 27,
  reason = 'Shortest estimated waiting time with available capacity.',
  centerId = 'center-sonipat-main',
}) => {
  const { language, t } = useLanguage();

  return (
    <div className="rounded-3xl bg-gradient-to-br from-agri-900 via-agri-800 to-emerald-950 text-white p-6 sm:p-7 shadow-xl shadow-agri-950/20 border border-emerald-500/20 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Top Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.recommendedCenter}</span>
          </div>

          <span className="text-[11px] text-emerald-200/80 font-medium">
            AI Load-Balanced Allocation Engine
          </span>
        </div>

        {/* Center Title */}
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {centerName}
          </h3>
          <p className="text-xs text-emerald-100/80 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Near GT Road, Sonipat • Active Gate Verification</span>
          </p>
        </div>

        {/* 4 Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-emerald-200 font-semibold uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {t.distance}
            </span>
            <div className="text-lg font-black text-white mt-0.5">{distanceKm} km</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-emerald-200 font-semibold uppercase flex items-center gap-1">
              <Users className="w-3 h-3" /> {t.currentQueue}
            </span>
            <div className="text-lg font-black text-white mt-0.5">{currentQueue} {t.farmers}</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-emerald-200 font-semibold uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" /> {t.estimatedWait}
            </span>
            <div className="text-lg font-black text-amber-300 mt-0.5">~{expectedWaitMinutes} {t.min}</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-emerald-200 font-semibold uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {t.availableSlots}
            </span>
            <div className="text-lg font-black text-emerald-300 mt-0.5">{availableSlots} slots</div>
          </div>
        </div>

        {/* Recommendation Reason */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/20 text-xs text-emerald-100/90 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-300">{t.recommendationReason}: </span>
            <span>"{reason}"</span>
          </div>
        </div>

        {/* Book Button */}
        <Link
          to={`/farmer/book-slot?centerId=${centerId}`}
          className="btn-accent w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-harvest-600/30"
        >
          <span>{t.bookRecommended}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
