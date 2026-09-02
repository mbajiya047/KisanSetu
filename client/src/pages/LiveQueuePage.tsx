import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { LiveQueueBoard } from '../components/LiveQueueBoard';
import { Activity, ShieldCheck, RefreshCw } from 'lucide-react';

export const LiveQueuePage: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('tokenNumber') || '#207';

  const [queueData, setQueueData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLiveQueue = async () => {
    try {
      const res = await api.getLiveQueue('center-sonipat-main', tokenFromUrl);
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
    // Simulate live queue refresh every 10 seconds
    const interval = setInterval(fetchLiveQueue, 10000);
    return () => clearInterval(interval);
  }, [tokenFromUrl]);

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
        centerName={queueData?.center?.name || 'Sonipat Central Grain Mandi'}
        servingToken={queueData?.currentlyServing?.tokenNumber || '#184'}
        servingStage={queueData?.currentlyServing?.stage || 'WEIGHING'}
        userToken={tokenFromUrl}
        farmersAhead={queueData?.farmerQueueInfo?.farmersAhead ?? 23}
        estimatedWaitMinutes={queueData?.farmerQueueInfo?.estimatedWaitMinutes ?? 38}
        queueEntries={queueData?.queueEntries || []}
        onRefresh={fetchLiveQueue}
      />
    </div>
  );
};
