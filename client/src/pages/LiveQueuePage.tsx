import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { LiveQueueBoard } from '../components/LiveQueueBoard';
import { Activity, ShieldCheck, RefreshCw, AlertCircle, Clock, CalendarCheck2, ArrowRight, Home } from 'lucide-react';

export const LiveQueuePage: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();

  // Determine token: from URL param, or from saved booking, or fallback for demo
  const tokenFromUrl = searchParams.get('tokenNumber');
  const savedBookingStr = typeof window !== 'undefined' ? localStorage.getItem('kisansetu_active_booking') : null;
  const token = typeof window !== 'undefined' ? localStorage.getItem('kisansetu_token') : null;
  const isDemoFarmer = token === 'kisansetu_demo_farmer_jwt_token';

  let resolvedToken = tokenFromUrl;
  let activeCenterName = 'Procurement Mandi Yard';

  if (!resolvedToken && savedBookingStr) {
    try {
      const b = JSON.parse(savedBookingStr);
      resolvedToken = b.bookingToken || (b.tokenNumber ? `#${b.tokenNumber}` : null);
      if (b.center?.name) activeCenterName = b.center.name;
    } catch (e) {}
  }

  if (!resolvedToken && isDemoFarmer) {
    resolvedToken = '#207';
  }

  const [queueData, setQueueData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLiveQueue = async () => {
    if (!resolvedToken) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.getLiveQueue('center-sonipat-main', resolvedToken);
      if (res.success) {
        setQueueData(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveQueue();
    if (resolvedToken) {
      const interval = setInterval(fetchLiveQueue, 10000);
      return () => clearInterval(interval);
    }
  }, [resolvedToken]);

  // If farmer has no booking and no token
  if (!isLoading && !resolvedToken) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        <div className="card p-8 sm:p-12 bg-white border border-slate-200/90 shadow-md text-center max-w-2xl mx-auto space-y-6 rounded-3xl">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
              <AlertCircle className="w-3.5 h-3.5" />
              {language === 'hi' ? 'कोई सक्रिय कतार नहीं' : 'No Queue Entry'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {language === 'hi' ? 'कोई बुकिंग प्रक्रिया में नहीं है' : 'There is No Booking in Process'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              {language === 'hi'
                ? 'वर्तमान में आपके पास मंडी कतार में कोई सक्रिय टोकन नहीं है। कतार की वास्तविक स्थिति देखने और गेट बुलावा प्राप्त करने के लिए कृपया पहले एक खरीद स्लॉट बुक करें।'
                : 'You do not have any active token or booking in the Mandi queue right now. Please book a procurement slot first to join the live queue and view your token status.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/farmer/book-slot"
              className="btn-primary w-full sm:w-auto py-3.5 px-8 text-sm font-bold flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg shadow-emerald-700/20 rounded-xl"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'खरीद स्लॉट अभी बुक करें' : 'Book Procurement Slot Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/home"
              className="btn-secondary w-full sm:w-auto py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl shadow-sm"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>{language === 'hi' ? 'होम पेज पर जाएं' : 'Return to Home'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Activity className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'hi' ? 'वास्तविक समय कतार प्रबंधन' : 'Real-Time Mandi Queue Management'}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {t.liveQueueTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi'
              ? 'मंडी में अपनी बारी की स्थिति वास्तविक समय में देखें और सटीक समय पर गेट पर पहुंचे।'
              : 'Track your exact token position, gate call time, and avoid unnecessary waiting in the mandi yard.'}
          </p>
        </div>
      </div>

      {/* Live Queue Board */}
      <LiveQueueBoard
        centerName={queueData?.center?.name || activeCenterName}
        servingToken={queueData?.currentlyServing?.tokenNumber || '#184'}
        servingStage={queueData?.currentlyServing?.stage || 'WEIGHING'}
        userToken={resolvedToken || '#101'}
        farmersAhead={queueData?.farmerQueueInfo?.farmersAhead ?? 3}
        estimatedWaitMinutes={queueData?.farmerQueueInfo?.estimatedWaitMinutes ?? 12}
        queueEntries={queueData?.queueEntries || []}
        onRefresh={fetchLiveQueue}
      />
    </div>
  );
};
