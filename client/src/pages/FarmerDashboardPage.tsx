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

  const activeBooking = summary?.activeBooking || null;

  const farmerName = user?.farmerProfile?.fullName || summary?.farmer?.fullName || user?.name || 'Farmer';
  const farmerId = user?.farmerProfile?.farmerId || summary?.farmer?.farmerId || 'FARM-2026-REG';
  const villageName = user?.farmerProfile?.village || summary?.farmer?.village || 'Village';
  const districtName = user?.farmerProfile?.district?.name || summary?.farmer?.district?.name || '';
  const stateName = user?.farmerProfile?.state?.name || summary?.farmer?.state?.name || 'India';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP GREETING & PROFILE HEADER */}
      <div className="card p-6 bg-gradient-to-r from-agri-900 via-agri-800 to-emerald-900 text-white shadow-xl rounded-3xl flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Farmer Profile • KisanSetu National Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t.goodMorning}, {farmerName}
          </h1>
          <p className="text-xs text-emerald-100/90 flex flex-wrap items-center gap-3">
            <span>Farmer ID: <strong className="font-mono text-white">{farmerId}</strong></span>
            <span>•</span>
            <span>Location: <strong>{villageName}{districtName ? `, ${districtName}` : ''} ({stateName})</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <Link
            to="/farmer/book-slot"
            className="btn-accent py-2.5 px-5 text-xs font-bold flex items-center gap-1.5 shadow-md bg-amber-400 hover:bg-amber-300 text-slate-950"
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>{t.heroBtnBook}</span>
          </Link>
        </div>
      </div>

      {/* 2. MAIN SECTION: UPCOMING ACTIVE SLOT & TOKEN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Booking Card or Fresh Account State (2 cols) */}
        {activeBooking ? (
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
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 bg-slate-50 hover:bg-emerald-50 text-emerald-800 border-emerald-200"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-700" />
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
                  {activeBooking.crop?.name || activeBooking.cropName || 'Wheat'} ({activeBooking.crop?.hindiName || 'गेहूं'})
                </div>
                <p className="text-xs font-semibold text-agri-800">
                  {activeBooking.bookedQuantityQuintals || activeBooking.allocatedQuantityQuintals || 40} Quintal • MSP ₹{activeBooking.crop?.mspRatePerQuintal || activeBooking.crop?.msp || 2425}/Qtl
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-agri-600" /> Procurement Center
                </span>
                <div className="text-base font-bold text-slate-900 line-clamp-1">
                  {activeBooking.center?.name || 'Grain Mandi Procurement Center'}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>{activeBooking.scheduledDate || activeBooking.date} ({activeBooking.scheduledTime || activeBooking.timeSlot || '10:00 AM'})</span>
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
                  Queue Token: <strong className="text-emerald-800">#{activeBooking.tokenNumber || activeBooking.queueEntry?.tokenNumber || '1'}</strong> • Status: {activeBooking.status}
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
        ) : (
          /* Fresh Account State: No active booking yet */
          <div className="lg:col-span-2 card p-8 sm:p-10 bg-gradient-to-br from-white via-emerald-50/30 to-emerald-50/50 border border-emerald-200/80 shadow-md flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
              <CalendarCheck2 className="w-8 h-8 text-emerald-700" />
            </div>

            <div className="space-y-2 max-w-lg">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100/90 text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {language === 'hi' ? 'ताज़ा खाता • कोई सक्रिय स्लॉट नहीं' : 'New Account • No Active Booking Yet'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'hi' ? 'सरकारी MSP पर फसल बिक्री हेतु स्लॉट बुक करें' : 'Ready to Sell Your Crop at MSP?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'आपके खाते में अभी कोई सक्रिय टोकन नहीं है। नीचे दिए गए बटन पर क्लिक करके अपनी नजदीकी मंडी चुनें, फसल व तारीख तय करें और तुरंत डिजिटल क्यूआर ई-गेट पास प्राप्त करें।'
                  : 'You have not booked any procurement slot yet. Click the button below to choose your nearest Mandi, select your crop & date, and generate your instant digital QR e-Gate Pass token.'}
              </p>
            </div>

            <Link
              to="/farmer/book-slot"
              className="btn-primary py-3.5 px-8 text-sm font-black shadow-lg bg-emerald-700 hover:bg-emerald-800 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all text-white"
            >
              <CalendarCheck2 className="w-5 h-5" />
              <span>{language === 'hi' ? 'पहला स्लॉट बुक करें (Book Slot)' : 'Book Procurement Slot Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1">✓ {language === 'hi' ? 'तुरंत डिजिटल क्यूआर पास' : 'Instant Digital QR Pass'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">✓ {language === 'hi' ? 'कतार रहित तुलाई' : 'Zero Wait Weighbridge'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">✓ {language === 'hi' ? '48 घंटे में सीधा डीबीटी भुगतान' : '48hr Direct DBT Payout'}</span>
            </div>
          </div>
        )}

        {/* Registered Crop & Financial Summary (1 col) */}
        <div className="card p-6 bg-white border border-slate-200 shadow-md space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{t.myCrop}</h3>
              <span className="badge-info text-xs font-bold">{activeBooking ? 'Slot Confirmed' : 'Ready to Book'}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Registered Crop:</span>
                <strong className="text-slate-900 font-bold">{activeBooking?.crop?.name || activeBooking?.cropName || 'Not Booked Yet'}</strong>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Cultivated Land:</span>
                <strong className="text-slate-900 font-bold">{user?.farmerProfile?.totalLandAcres || 5.0} Acres</strong>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Allocated Quantity:</span>
                <strong className="text-slate-900 font-bold">{activeBooking ? `${activeBooking.bookedQuantityQuintals || activeBooking.allocatedQuantityQuintals} Qtl` : '0.0 Qtl'}</strong>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Govt. MSP Rate:</span>
                <strong className="text-agri-700 font-bold">{activeBooking ? `₹${activeBooking.crop?.mspRatePerQuintal || activeBooking.crop?.msp || 2425} / Qtl` : 'CACP 2026-27'}</strong>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Gross Payout</span>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {activeBooking ? `₹${((activeBooking.bookedQuantityQuintals || activeBooking.allocatedQuantityQuintals || 40) * (activeBooking.crop?.mspRatePerQuintal || activeBooking.crop?.msp || 2425)).toLocaleString('en-IN')}` : '₹0'}
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">Direct DBT to Verified Bank Account</span>
              </div>
            </div>
          </div>

          <Link
            to={activeBooking ? "/farmer/procurement" : "/farmer/book-slot"}
            className="btn-secondary w-full py-2.5 text-xs font-bold text-center flex items-center justify-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-agri-700" />
            <span>{activeBooking ? t.actionMyProcurement : 'Book Slot Now'}</span>
          </Link>
        </div>
      </div>

      {/* 3. PROCUREMENT PROGRESS TIMELINE */}
      <div className="card p-6 sm:p-7 bg-white border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${activeBooking ? 'bg-agri-600 animate-ping' : 'bg-emerald-500'}`} />
            <h3 className="font-bold text-base text-slate-900">{t.procurementProgress}</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {activeBooking ? `Live Stage: ${activeBooking.status || 'Scheduled'}` : 'Stage: Profile Registered'}
          </span>
        </div>

        <ProcurementTimeline currentStage={activeBooking?.status || 'REGISTERED'} />
      </div>

      {/* 4. SMART RECOMMENDATION SECTION */}
      <SmartRecommendationCard
        centerName={districtName ? `${districtName} APMC Mandi Hub` : "Krishi Upaj Mandi Samiti"}
        distanceKm={4.2}
        currentQueue={12}
        expectedWaitMinutes={15}
        availableSlots={27}
        reason="Shortest estimated waiting time with available capacity."
        centerId="center-rj-nagaur-1"
      />

      {/* QR Token Modal */}
      {activeBooking && (
        <QRTokenModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          booking={activeBooking}
        />
      )}
    </div>
  );
};
