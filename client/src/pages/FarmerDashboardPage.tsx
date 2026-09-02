import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { ProcurementTimeline } from '../components/ProcurementTimeline';
import { SmartRecommendationCard } from '../components/SmartRecommendationCard';
import { QRTokenModal } from '../components/QRTokenModal';
import {
  CalendarCheck2,
  Ticket,
  MapPin,
  Clock,
  Wheat,
  QrCode,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Bell,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FarmerDashboardPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [summary, setSummary] = useState<any | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getFarmerDashboardSummary();
        if (res.success) {
          setSummary(res);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  const activeBooking = summary?.activeBooking || {
    bookingToken: 'WHT-4921',
    status: 'WEIGHING',
    crop: { name: 'Wheat', hindiName: 'गेहूं', mspRatePerQuintal: 2275 },
    bookedQuantityQuintals: 42,
    center: { name: 'Sonipat Central Grain Mandi', address: 'GT Road, Sonipat' },
    scheduledDate: '15 September 2026',
    scheduledTime: '10:00 AM - 11:00 AM',
    queueEntry: { tokenNumber: '#207', stage: 'WEIGHING' },
    vehicleNumber: 'HR-10-AT-7821',
  };

  const farmerName = summary?.farmer?.fullName || user?.name || 'Ramesh Kumar';
  const farmerId = summary?.farmer?.farmerId || 'FARM-HR-2026-8819';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP GREETING & PROFILE HEADER */}
      <div className="card p-6 bg-gradient-to-r from-agri-900 via-agri-800 to-emerald-900 text-white shadow-xl rounded-3xl flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Farmer Profile • Meri Fasal Mera Byora</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t.goodMorning}, {farmerName}
          </h1>
          <p className="text-xs text-emerald-100/90 flex flex-wrap items-center gap-3">
            <span>Farmer ID: <strong className="font-mono text-white">{farmerId}</strong></span>
            <span>•</span>
            <span>Village: <strong>Murthal, Sonipat (Haryana)</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <Link
            to="/farmer/book-slot"
            className="btn-accent py-2.5 px-5 text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>{t.heroBtnBook}</span>
          </Link>
        </div>
      </div>

      {/* 2. MAIN SECTION: UPCOMING ACTIVE SLOT & TOKEN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Booking Card (2 cols) */}
        <div className="lg:col-span-2 card p-6 sm:p-7 bg-white border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-agri-700 text-white flex items-center justify-center shadow-sm">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">{t.upcomingSlot}</h3>
                <p className="text-xs text-slate-500">Mandi Gate Entry Pass & Token</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="badge-warning text-xs font-bold uppercase px-3 py-1 animate-pulse">
                {activeBooking.status || 'Active'}
              </span>
              <button
                onClick={() => setIsQRModalOpen(true)}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 bg-slate-50"
              >
                <QrCode className="w-3.5 h-3.5 text-agri-700" />
                <span>View QR Pass</span>
              </button>
            </div>
          </div>

          {/* Active Slot Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Wheat className="w-3 h-3 text-agri-600" /> Crop & Quantity
              </span>
              <div className="text-lg font-black text-slate-900">
                {activeBooking.crop?.name || 'Wheat'} ({activeBooking.crop?.hindiName || 'गेहूं'})
              </div>
              <p className="text-xs font-semibold text-agri-800">
                {activeBooking.bookedQuantityQuintals || 42} Quintal • MSP ₹{activeBooking.crop?.mspRatePerQuintal || 2275}/Qtl
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-agri-600" /> Procurement Center
              </span>
              <div className="text-base font-bold text-slate-900 line-clamp-1">
                {activeBooking.center?.name || 'Sonipat Central Grain Mandi'}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>{activeBooking.scheduledDate} ({activeBooking.scheduledTime})</span>
              </p>
            </div>
          </div>

          {/* Big Token Number Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-agri-50 to-emerald-50/50 border border-agri-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-agri-800 uppercase tracking-wider">
                Digital Booking Token:
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-agri-950 mt-0.5">
                {activeBooking.bookingToken}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Queue Number: <strong className="text-harvest-700">#{activeBooking.queueEntry?.tokenNumber || '207'}</strong> (Currently at Gate 2 Weighbridge)
              </p>
            </div>

            <Link
              to={`/farmer/queue?tokenNumber=${activeBooking.bookingToken}`}
              className="btn-primary py-2.5 px-5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <span>{t.viewLiveQueue}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Registered Crop & Financial Summary (1 col) */}
        <div className="card p-6 bg-white border border-slate-200 shadow-md space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{t.myCrop}</h3>
              <span className="badge-info text-xs font-bold">Rabi 2026</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Registered Crop:</span>
                <strong className="text-slate-900 font-bold">Wheat (गेहूं)</strong>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Cultivated Land:</span>
                <strong className="text-slate-900 font-bold">5.0 Acres</strong>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Estimated Yield:</span>
                <strong className="text-slate-900 font-bold">42.0 Quintal</strong>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Govt. MSP Rate:</span>
                <strong className="text-agri-700 font-bold">₹2,275 / Qtl</strong>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Gross Payout</span>
                <div className="text-2xl font-black text-slate-900 mt-0.5">₹95,550</div>
                <span className="text-[10px] text-emerald-700 font-medium">Direct DBT to SBI (XXXX-4819)</span>
              </div>
            </div>
          </div>

          <Link
            to="/farmer/procurement"
            className="btn-secondary w-full py-2.5 text-xs font-bold text-center flex items-center justify-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-agri-700" />
            <span>{t.actionMyProcurement}</span>
          </Link>
        </div>
      </div>

      {/* 3. PROCUREMENT PROGRESS TIMELINE */}
      <div className="card p-6 sm:p-7 bg-white border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-agri-600 animate-ping" />
            <h3 className="font-bold text-base text-slate-900">{t.procurementProgress}</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">Live Stage: Weighbridge Gross Scan</span>
        </div>

        <ProcurementTimeline currentStage={activeBooking.status || 'WEIGHING'} />
      </div>

      {/* 4. SMART RECOMMENDATION SECTION */}
      <SmartRecommendationCard
        centerName="Sonipat Central Grain Mandi"
        distanceKm={4.2}
        currentQueue={38}
        expectedWaitMinutes={42}
        availableSlots={27}
        reason="Shortest estimated waiting time with available capacity."
        centerId="center-sonipat-main"
      />

      {/* QR Token Modal */}
      <QRTokenModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        booking={activeBooking}
      />
    </div>
  );
};
