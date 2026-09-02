import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Calendar, Download, Printer, MapPin, Truck, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QRTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export const QRTokenModal: React.FC<QRTokenModalProps> = ({ isOpen, onClose, booking }) => {
  const { language, t } = useLanguage();

  if (!isOpen || !booking) return null;

  const qrData = typeof booking.qrCodeData === 'string'
    ? booking.qrCodeData
    : JSON.stringify({
        token: booking.bookingToken,
        farmer: booking.farmer?.fullName || 'Farmer',
        center: booking.center?.name || 'Mandi Center',
        date: booking.scheduledDate,
        time: booking.scheduledTime,
      });

  const handlePrint = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`KisanSetu Procurement: ${booking.crop?.name || 'Crop'} at ${booking.center?.name || 'Mandi'}`);
    const details = encodeURIComponent(`Token: ${booking.bookingToken}\nCenter: ${booking.center?.name}\nGate: Gate 2\nVehicle: ${booking.vehicleNumber || 'Tractor-Trolley'}`);
    const location = encodeURIComponent(booking.center?.address || 'Procurement Mandi');
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-agri-800 to-agri-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">
                {language === 'hi' ? 'डिजिटल खरीद ई-गेट पास' : 'Digital Procurement E-Gate Pass'}
              </h3>
              <p className="text-[11px] text-emerald-200">
                {language === 'hi' ? 'टोकन जारी हुआ • आधिकारिक पास' : 'Official Verified Mandi Token'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Main Token Badge Card */}
          <div className="bg-gradient-to-b from-agri-50 to-white rounded-2xl border border-agri-200/80 p-5 text-center relative overflow-hidden shadow-inner">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-agri-700 text-white mb-2 tracking-wide uppercase">
              {booking.crop?.name || 'Crop'} ({booking.bookedQuantityQuintals || 42} Quintal)
            </div>

            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-wider font-mono">
              {booking.bookingToken || 'WHT-4921'}
            </div>

            <p className="text-xs font-semibold text-agri-800 mt-1">
              Queue Position / कतार टोकन: <span className="text-sm font-bold text-harvest-600">#{booking.queueEntry?.tokenNumber || '207'}</span>
            </p>

            {/* QR Code Centerpiece */}
            <div className="mt-4 inline-block bg-white p-3.5 rounded-2xl border-2 border-dashed border-agri-300 shadow-sm">
              <QRCodeSVG
                value={qrData}
                size={160}
                level="H"
                includeMargin={false}
                fgColor="#14532d"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-mono">Scan at Mandi Gate 1 / 2 for automatic barrier entry</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
              <span className="text-slate-400 text-[10px] font-medium uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3 text-agri-600" /> Center
              </span>
              <p className="font-semibold text-slate-800 line-clamp-1">{booking.center?.name || 'Sonipat Mandi'}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
              <span className="text-slate-400 text-[10px] font-medium uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-agri-600" /> Slot Time
              </span>
              <p className="font-semibold text-slate-800">{booking.scheduledDate || '15 Sep 2026'}</p>
              <p className="text-[10px] text-slate-500 font-medium">{booking.scheduledTime || '10:00 AM - 11:00 AM'}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
              <span className="text-slate-400 text-[10px] font-medium uppercase">Farmer Name</span>
              <p className="font-semibold text-slate-800">{booking.farmer?.fullName || 'Ramesh Kumar'}</p>
              <p className="text-[10px] text-slate-500 font-mono">{booking.farmer?.farmerId || 'FARM-HR-2026-8819'}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
              <span className="text-slate-400 text-[10px] font-medium uppercase flex items-center gap-1">
                <Truck className="w-3 h-3 text-agri-600" /> Vehicle
              </span>
              <p className="font-semibold text-slate-800 font-mono">{booking.vehicleNumber || 'HR-10-AT-7821'}</p>
              <p className="text-[10px] text-slate-500">{booking.vehicleType || 'Tractor-Trolley'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleAddToCalendar}
                className="btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add to Calendar</span>
              </button>

              <button
                onClick={handlePrint}
                className="btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save Slip</span>
              </button>
            </div>

            <Link
              to="/farmer/queue"
              onClick={onClose}
              className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
            >
              <span>{t.viewLiveQueue}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
