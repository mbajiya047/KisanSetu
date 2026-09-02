import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Users,
  Clock,
  Radio,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Truck,
  Scale,
  FlaskConical,
  Layers,
} from 'lucide-react';

interface LiveQueueBoardProps {
  centerName?: string;
  servingToken?: string;
  servingStage?: string;
  userToken?: string;
  farmersAhead?: number;
  estimatedWaitMinutes?: number;
  queueEntries?: any[];
  onRefresh?: () => void;
}

export const LiveQueueBoard: React.FC<LiveQueueBoardProps> = ({
  centerName = 'Sonipat Central Grain Mandi',
  servingToken = '#184',
  servingStage = 'WEIGHING',
  userToken = '#207',
  farmersAhead = 23,
  estimatedWaitMinutes = 38,
  queueEntries = [],
  onRefresh,
}) => {
  const { language, t } = useLanguage();
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Live simulation ticker every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsUpdating(true);
    setSecondsAgo(0);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsUpdating(false), 500);
  };

  // Mock queue entries fallback if empty
  const defaultEntries = [
    { token: '#182', stage: 'COMPLETED', farmer: 'Sukhdev Singh', crop: 'Wheat', time: '09:40 AM' },
    { token: '#183', stage: 'QUALITY_CHECK', farmer: 'Baljit Rao', crop: 'Wheat', time: '09:55 AM' },
    { token: '#184', stage: 'WEIGHING', farmer: 'Om Prakash', crop: 'Wheat', time: '10:00 AM' },
    { token: '#185', stage: 'WAITING', farmer: 'Harpreet Singh', crop: 'Wheat', time: '10:05 AM' },
    { token: '#186', stage: 'WAITING', farmer: 'Kuldeep Kumar', crop: 'Wheat', time: '10:10 AM' },
    { token: '#190', stage: 'WAITING', farmer: 'Dharampal', crop: 'Wheat', time: '10:20 AM' },
    { token: '#195', stage: 'WAITING', farmer: 'Jaibir Malik', crop: 'Wheat', time: '10:28 AM' },
    { token: userToken, stage: 'WAITING', farmer: 'Ramesh Kumar (You)', crop: 'Wheat', time: '10:42 AM' },
  ];

  const listToRender = queueEntries.length > 0
    ? queueEntries.map((q) => ({
        token: q.tokenNumber,
        stage: q.stage,
        farmer: q.farmerName || 'Farmer',
        crop: q.cropName || 'Wheat',
        time: q.estimatedCallTime || '10:30 AM',
      }))
    : defaultEntries;

  const getStageBadge = (st: string) => {
    switch (st) {
      case 'COMPLETED':
        return (
          <span className="badge-success gap-1">
            <CheckCircle2 className="w-3 h-3" /> {t.stageCompleted}
          </span>
        );
      case 'WEIGHING':
        return (
          <span className="badge-warning gap-1 bg-amber-500 text-white animate-pulse">
            <Scale className="w-3 h-3" /> {t.stageWeighing}
          </span>
        );
      case 'QUALITY_CHECK':
        return (
          <span className="badge-info gap-1">
            <FlaskConical className="w-3 h-3" /> {t.stageQualityCheck}
          </span>
        );
      case 'GATE_ENTRY':
        return (
          <span className="badge-warning gap-1">
            <Truck className="w-3 h-3" /> {t.stageGateEntry}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {t.stageWaiting}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Center Name & Real-time Live Beacon */}
      <div className="card bg-white border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {language === 'hi' ? 'लाइव मंडी कतार प्रसारण' : 'Live Mandi Queue Stream'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{centerName}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs text-slate-500 hidden sm:block">
            <span>{t.lastUpdated}: </span>
            <span className="font-semibold text-slate-700">{secondsAgo}s ago</span>
          </div>
          <button
            onClick={handleManualRefresh}
            className={`btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 ${
              isUpdating ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main 2 Hero Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Currently Serving Hero Card */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-7 shadow-xl border border-slate-700 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> {t.currentlyServing}
            </span>
            <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[11px] border border-emerald-400/30 text-emerald-300">
              Gate 2 Weighbridge
            </span>
          </div>

          <div className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tight my-2">
            {servingToken}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/80 text-xs text-slate-300">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Stage: <strong className="text-amber-300 uppercase">{servingStage}</strong> (Wheat • 40 Quintal)</span>
          </div>
        </div>

        {/* User's Token Hero Card */}
        <div className="rounded-3xl bg-gradient-to-br from-agri-800 via-agri-700 to-emerald-900 text-white p-6 sm:p-7 shadow-xl shadow-agri-900/20 border border-emerald-400/30 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-emerald-200 font-bold uppercase tracking-wider mb-2">
            <span>{t.yourToken}</span>
            <span className="bg-white/20 px-2.5 py-0.5 rounded text-[11px] font-mono text-white">
              WHT-4921
            </span>
          </div>

          <div className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tight my-2">
            {userToken}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-emerald-600/50 text-xs">
            <div>
              <span className="text-emerald-200 text-[11px] block">{t.farmersAhead}</span>
              <strong className="text-lg font-black text-white">{farmersAhead} {t.farmers}</strong>
            </div>
            <div>
              <span className="text-emerald-200 text-[11px] block">{t.estimatedWaitTime}</span>
              <strong className="text-lg font-black text-amber-300">~{estimatedWaitMinutes} {t.min}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Queue Progress Bar */}
      <div className="card p-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>{t.queueProgressBar}</span>
          <span className="text-agri-700 font-bold">24 / 45 Tokens Processed Today</span>
        </div>

        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-agri-600 rounded-full transition-all duration-500 relative"
            style={{ width: '55%' }}
          >
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-sm" />
          </div>
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>#101 (08:00 AM)</span>
          <span className="font-bold text-slate-800">#184 (Active Now)</span>
          <span>#220 (05:00 PM)</span>
        </div>
      </div>

      {/* Live Queue Sequence List */}
      <div className="card p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-agri-700" />
            <h3 className="font-bold text-slate-900 text-sm">
              {language === 'hi' ? 'वर्तमान कतार क्रम सूची' : 'Current Queue Roster'}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">{listToRender.length} tokens active</span>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {listToRender.map((entry, idx) => {
            const isUser = entry.token === userToken;
            const isServing = entry.token === servingToken;

            return (
              <div
                key={idx}
                className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                  isUser
                    ? 'bg-amber-50/80 font-semibold border-l-4 border-l-harvest-500'
                    : isServing
                    ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-sm shadow-sm ${
                      isServing
                        ? 'bg-emerald-700 text-white'
                        : isUser
                        ? 'bg-harvest-500 text-white'
                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                  >
                    {entry.token}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{entry.farmer}</span>
                      {isUser && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-harvest-200 text-harvest-800 uppercase">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {entry.crop} • Estimated: {entry.time}
                    </span>
                  </div>
                </div>

                <div>{getStageBadge(entry.stage)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
