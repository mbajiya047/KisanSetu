import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { QRTokenModal } from '../components/QRTokenModal';
import confetti from 'canvas-confetti';
import {
  CalendarCheck2,
  Wheat,
  Building,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

export const SlotBookingPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [centers, setCenters] = useState<any[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('crop-wheat');
  const [quantity, setQuantity] = useState<string>('42');
  const [selectedCenterId, setSelectedCenterId] = useState<string>(searchParams.get('centerId') || 'center-sonipat-main');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-15');
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [vehicleNumber, setVehicleNumber] = useState('HR-10-AT-7821');
  const [vehicleType, setVehicleType] = useState('Tractor-Trolley');
  const [isBooking, setIsBooking] = useState(false);
  const [generatedBooking, setGeneratedBooking] = useState<any | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [enamSyncInfo, setEnamSyncInfo] = useState<any | null>(null);

  // Load Centers
  useEffect(() => {
    api.getCenters().then((res) => {
      if (res.success && res.centers) {
        setCenters(res.centers);
        if (!selectedCenterId && res.centers.length > 0) {
          setSelectedCenterId(res.centers[0].id);
        }
      }
    });
  }, []);

  // Load Available Slots and e-NAM Sync when Center or Date changes
  useEffect(() => {
    if (selectedCenterId) {
      api.getAvailableSlots(selectedCenterId, selectedCrop, selectedDate).then((res) => {
        if (res.success && res.slots) {
          setSlots(res.slots);
          const availableFirst = res.slots.find((s) => s.status !== 'FULL');
          if (availableFirst) {
            setSelectedSlotId(availableFirst.id);
          }
        }
      });

      api.getEnamMandiSlots(selectedCenterId).then((res) => {
        if (res.success) {
          setEnamSyncInfo(res);
        }
      }).catch(() => null);
    }
  }, [selectedCenterId, selectedDate, selectedCrop]);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) return;

    setIsBooking(true);
    try {
      const res = await api.bookSlot({
        slotId: selectedSlotId,
        centerId: selectedCenterId,
        cropId: selectedCrop,
        quantityQuintals: parseFloat(quantity),
        vehicleNumber,
        vehicleType,
      });

      if (res.success && res.booking) {
        setGeneratedBooking(res.booking);
        setBookingSuccess(true);
        setIsQRModalOpen(true);

        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (err) {
          // ignore
        }
      }
    } catch (error: any) {
      alert(error.message || 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  const getSlotBadge = (status: string, booked?: number, max?: number) => {
    const safeMax = typeof max === 'number' && !isNaN(max) && max > 0 ? max : 25;
    const safeBooked = typeof booked === 'number' && !isNaN(booked) && booked >= 0 ? booked : 0;
    const available = Math.max(0, safeMax - safeBooked);

    switch (status) {
      case 'FULL':
        return (
          <span className="badge-danger text-[10px] uppercase font-bold">
            {t.slotFull} (0 left)
          </span>
        );
      case 'FEW_SLOTS':
      case 'FAST_FILLING':
        return (
          <span className="badge-warning text-[10px] uppercase font-bold">
            {t.slotFew} ({available} left)
          </span>
        );
      default:
        return (
          <span className="badge-success text-[10px] uppercase font-bold">
            {t.slotAvailable} ({available} slots)
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-bold">
          <CalendarCheck2 className="w-3.5 h-3.5" />
          <span>Procurement Slot Booking Engine</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'खरीद स्लॉट बुक करें' : 'Book Your Mandi Procurement Slot'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          {language === 'hi'
            ? 'अपनी सुविधा अनुसार तारीख और समय चुनें। तुरंत ई-टोकन एवं गेट पास प्राप्त करें।'
            : 'Select your harvested crop, prefered procurement hub, date and time slot to generate instant digital token.'}
        </p>
      </div>

      {/* Stepper Progress (Click only to go BACK to previous steps, NOT forward) */}
      <div className="card p-4 bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        {[
          { num: 1, label: t.bookingStep1, icon: Wheat },
          { num: 2, label: t.bookingStep2, icon: Building },
          { num: 3, label: t.bookingStep3, icon: Clock },
          { num: 4, label: t.bookingStep4, icon: QrCode },
        ].map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num;
          const canGoBack = s.num < step;

          return (
            <button
              key={s.num}
              type="button"
              disabled={!canGoBack}
              onClick={() => {
                if (canGoBack) setStep(s.num);
              }}
              title={canGoBack ? `Go back to Step ${s.num}: ${s.label}` : `Step ${s.num}: ${s.label}`}
              className={`flex items-center gap-2 transition-all focus:outline-none ${
                canGoBack ? 'cursor-pointer group' : 'cursor-default'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-agri-700 text-white shadow-md ring-2 ring-agri-400'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200 group-hover:scale-105'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone ? '✓' : s.num}
              </div>
              <span
                className={`text-xs font-semibold hidden md:inline transition-colors ${
                  isActive
                    ? 'text-agri-900 font-bold'
                    : isDone
                    ? 'text-slate-700 group-hover:text-emerald-800 font-medium'
                    : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Wizard Form */}
      <div className="card p-6 sm:p-8 bg-white border border-slate-200 shadow-md">
        {/* STEP 1: Select Crop & Quantity */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-bold uppercase tracking-wider text-agri-700 flex items-center gap-1.5">
              <Wheat className="w-4 h-4" /> 1. Select Crop & Enter Harvest Quantity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.selectCrop}</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-agri-600 focus:outline-none"
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Quantity in Quintal (मात्रा - क्विंटल में)
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Estimated MSP value: <strong className="text-emerald-700">₹{(parseFloat(quantity || '0') * 2275).toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-primary py-3 px-8 text-xs font-bold flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 shadow-md"
              >
                <span>Select Procurement Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Center */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-bold uppercase tracking-wider text-agri-700 flex items-center gap-1.5">
              <Building className="w-4 h-4" /> 2. Choose Procurement Center
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {centers.map((c) => {
                const isSelected = selectedCenterId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCenterId(c.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-agri-600 bg-emerald-50/50 shadow-md ring-2 ring-agri-200'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{c.address.split(',')[0]} • Distance: ~4.2 km</p>
                    <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-slate-100 font-medium">
                      <span className="text-amber-600 font-bold">Wait: ~{c.currentWaitMinutes || 35} min</span>
                      <span className="text-emerald-700 font-bold">{c.availableSlotsCount || 27} slots</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 text-slate-700 hover:bg-slate-100"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? '← वापस (1. फसल व मात्रा)' : '← Back (1. Crop & Qty)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary py-3 px-8 text-xs font-bold flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 shadow-md"
              >
                <span>Select Date & Time Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Select Date & Time Slot */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-bold uppercase tracking-wider text-agri-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> 3. Select Date and Time Window
            </h3>

            {/* Date Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Date (तारीख चुनें)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { date: '2026-09-15', label: '15 Sep (Today)', sub: 'Tuesday' },
                  { date: '2026-09-16', label: '16 Sep (Tomorrow)', sub: 'Wednesday' },
                  { date: '2026-09-17', label: '17 Sep', sub: 'Thursday' },
                  { date: '2026-09-18', label: '18 Sep', sub: 'Friday' },
                ].map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDate(d.date)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      selectedDate === d.date
                        ? 'bg-agri-700 text-white font-bold border-agri-700 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{d.label}</div>
                    <div className={`text-[10px] ${selectedDate === d.date ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {d.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Central e-NAM Gateway Live Quota Meter */}
            {enamSyncInfo && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-850 text-white border border-slate-700 shadow-md space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <strong className="text-emerald-400 font-bold">
                      Central e-NAM Gateway Synchronized (enam.gov.in)
                    </strong>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Mandi ID: {enamSyncInfo.mandi.enamMandiId} • Gate Quota Reconciled
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-xl bg-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Total Quota</span>
                    <strong className="text-sm font-bold text-white font-mono">
                      {enamSyncInfo.reconciliationMetrics.dailyQuotaFarmers} Farmers
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/80">
                    <span className="text-[10px] text-sky-400 block">Booked (e-NAM + App)</span>
                    <strong className="text-sm font-bold text-sky-300 font-mono">
                      {enamSyncInfo.reconciliationMetrics.totalBookedFarmers} Booked
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-400 block">Available Now</span>
                    <strong className="text-sm font-bold text-emerald-400 font-mono">
                      {enamSyncInfo.reconciliationMetrics.availableRemainingSlots} Free
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Time Slot Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Available Time Slots (उपलब्ध समय स्लॉट)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {slots.map((slot) => {
                  const isFull = slot.status === 'FULL';
                  const isSelected = selectedSlotId === slot.id;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isFull}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                        isFull
                          ? 'bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-emerald-50/70 border-agri-600 ring-2 ring-agri-300 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <strong className="text-xs font-black text-slate-900">
                          {slot.startTime} - {slot.endTime}
                        </strong>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>

                      <div className="mt-2">
                        {getSlotBadge(
                          slot.status,
                          slot.bookedFarmers ?? (slot.bookedQuantityQuintals ? Math.round(slot.bookedQuantityQuintals / 20) : undefined),
                          slot.maxFarmers ?? (slot.maxCapacityQuintals ? Math.round(slot.maxCapacityQuintals / 20) : undefined)
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-secondary py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 text-slate-700 hover:bg-slate-100"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? '← वापस (2. खरीद केंद्र)' : '← Back (2. Mandi Center)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn-primary py-3 px-8 text-xs font-bold flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 shadow-md"
              >
                <span>Review & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review, Vehicle Details & Confirm */}
        {step === 4 && (
          <form onSubmit={handleConfirmBooking} className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-bold uppercase tracking-wider text-agri-700 flex items-center gap-1.5">
              <QrCode className="w-4 h-4" /> 4. Review Booking & Enter Transport Details
            </h3>

            {/* Review Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Crop</span>
                <strong className="text-slate-900 font-bold">
                  {selectedCrop === 'crop-wheat' ? 'Wheat' : selectedCrop.replace('crop-', '').toUpperCase()} ({quantity} Qtl)
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Center</span>
                <strong className="text-slate-900 font-bold">
                  {centers.find((c) => c.id === selectedCenterId)?.name || 'Sonipat Mandi'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Date</span>
                <strong className="text-slate-900 font-bold">{selectedDate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Time</span>
                <strong className="text-slate-900 font-bold">
                  {slots.find((s) => s.id === selectedSlotId)
                    ? `${slots.find((s) => s.id === selectedSlotId)?.startTime} - ${slots.find((s) => s.id === selectedSlotId)?.endTime}`
                    : '09:00 AM - 10:00 AM'}
                </strong>
              </div>
            </div>

            {/* Vehicle Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Type (वाहन का प्रकार)</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
                >
                  <option value="Tractor-Trolley">Tractor-Trolley (ट्रैक्टर-ट्रॉली)</option>
                  <option value="Truck">Truck (ट्रक / कैंटर)</option>
                  <option value="Mini-Truck">Mini-Truck / Pickup (पिकअप)</option>
                  <option value="Bullock-Cart">Bullock-Cart (बैलगाड़ी)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Registration Number (गाड़ी नंबर)</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="HR-10-AT-7821"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-agri-600 focus:outline-none uppercase"
                  required
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                By confirming, a digital QR token will be generated. An SMS & WhatsApp confirmation will be dispatched automatically.
              </span>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-secondary py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 text-slate-700 hover:bg-slate-100"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? '← वापस (3. समय स्लॉट)' : '← Back (3. Time Slot)'}</span>
              </button>

              <button
                type="submit"
                disabled={isBooking}
                className="btn-accent py-3.5 px-8 text-xs font-bold flex items-center gap-2 shadow-lg shadow-harvest-600/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isBooking ? 'Generating Token...' : t.btnConfirmBooking}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* QR Token Modal after booking */}
      <QRTokenModal
        isOpen={isQRModalOpen}
        onClose={() => {
          setIsQRModalOpen(false);
          navigate('/farmer/dashboard');
        }}
        booking={generatedBooking}
      />
    </div>
  );
};
