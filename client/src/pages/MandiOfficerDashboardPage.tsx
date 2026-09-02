import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import {
  Shield,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  Pause,
  PhoneCall,
  PlusCircle,
  Scale,
  FlaskConical,
  FileCheck2,
  Truck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const MandiOfficerDashboardPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [data, setData] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedEntryForWeighing, setSelectedEntryForWeighing] = useState<any | null>(null);

  // Weighing & Quality Entry Modal State
  const [grossWeight, setGrossWeight] = useState('58.2');
  const [tareWeight, setTareWeight] = useState('16.2');
  const [moisture, setMoisture] = useState('11.4');
  const [grade, setGrade] = useState('GRADE_A');
  const [isSubmittingJForm, setIsSubmittingJForm] = useState(false);

  const fetchOfficerData = async () => {
    try {
      const res = await api.getOfficerDashboardStats('center-sonipat-main');
      if (res.success) {
        setData(res);
        setIsPaused(!res.center.isOperational);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOfficerData();
    const interval = setInterval(fetchOfficerData, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleCallNext = async () => {
    try {
      const res = await api.callNextToken('center-sonipat-main');
      if (res.success) {
        alert(res.message);
        fetchOfficerData();
      }
    } catch (e: any) {
      alert(e.message || 'Error calling next token');
    }
  };

  const handleUpdateStage = async (entryId: string, stage: string) => {
    try {
      const res = await api.updateQueueStage(entryId, stage, 'Gate 2');
      if (res.success) {
        fetchOfficerData();
      }
    } catch (e: any) {
      alert(e.message || 'Error updating stage');
    }
  };

  const handleTogglePauseQueue = async () => {
    const nextState = !isPaused;
    const reason = nextState ? 'Weighbridge calibration & lunch break' : '';
    try {
      const res = await api.pauseQueue('center-sonipat-main', nextState, reason);
      if (res.success) {
        setIsPaused(nextState);
        fetchOfficerData();
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleRecordWeighingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntryForWeighing) return;

    setIsSubmittingJForm(true);
    try {
      const res = await api.recordProcurement({
        bookingId: selectedEntryForWeighing.bookingToken || selectedEntryForWeighing.id,
        grossWeightQuintals: grossWeight,
        tareWeightQuintals: tareWeight,
        moisturePercent: moisture,
        qualityGrade: grade,
      });

      if (res.success) {
        alert(`J-Form ${res.procurementRecord?.jFormNumber || 'Generated'} issued! Payout: ₹${res.procurementRecord?.netPayableAmount?.toLocaleString('en-IN')}`);
        setSelectedEntryForWeighing(null);
        fetchOfficerData();
      }
    } catch (err: any) {
      alert(err.message || 'Error saving weighing details');
    } finally {
      setIsSubmittingJForm(false);
    }
  };

  const stats = data?.stats || {
    todayFarmers: 184,
    completed: 121,
    waiting: 63,
    noShows: 7,
    capacityUtilizationPercent: 82,
    currentWaitMinutes: 38,
  };

  const queueList = data?.liveQueue || [
    { id: '1', tokenNumber: '#182', bookingToken: 'WHT-2001', farmerName: 'Sukhdev Singh', phone: '9870001001', crop: 'Wheat', quantity: 38, stage: 'COMPLETED', gateNumber: 'Gate 1' },
    { id: '2', tokenNumber: '#183', bookingToken: 'WHT-2002', farmerName: 'Baljit Rao', phone: '9870001002', crop: 'Wheat', quantity: 45, stage: 'QUALITY_CHECK', gateNumber: 'Gate 1' },
    { id: '3', tokenNumber: '#184', bookingToken: 'WHT-2003', farmerName: 'Om Prakash', phone: '9870001003', crop: 'Wheat', quantity: 40, stage: 'WEIGHING', gateNumber: 'Gate 2' },
    { id: '4', tokenNumber: '#185', bookingToken: 'WHT-2004', farmerName: 'Harpreet Singh', phone: '9870001004', crop: 'Wheat', quantity: 30, stage: 'GATE_ENTRY', gateNumber: 'Gate 2' },
    { id: '5', tokenNumber: '#186', bookingToken: 'WHT-2005', farmerName: 'Kuldeep Kumar', phone: '9870001005', crop: 'Wheat', quantity: 50, stage: 'WAITING', gateNumber: 'Gate 1' },
    { id: '6', tokenNumber: '#207', bookingToken: 'WHT-4921', farmerName: 'Ramesh Kumar', phone: '9876543210', crop: 'Wheat', quantity: 42, stage: 'WAITING', gateNumber: 'Gate 2' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Header */}
      <div className="card p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Mandi Secretary / Officer Control Cockpit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {data?.center?.name || 'Sonipat Central Grain Mandi'}
          </h1>
          <p className="text-xs text-slate-300">
            Officer-in-Charge: <strong>Dr. Harish Chander</strong> • Active Weighbridges: 3 Active
          </p>
        </div>

        {/* Global Officer Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleCallNext}
            className="btn-accent py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t.callNextFarmer}</span>
          </button>

          <button
            onClick={handleTogglePauseQueue}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isPaused
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? t.resumeQueue : t.pauseQueue}</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">{t.todayFarmers}</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.todayFarmers}</div>
          <span className="text-[10px] text-slate-500 font-medium">Scheduled Today</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">{t.completed}</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats.completed}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Procured & J-Form</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">{t.waiting}</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{stats.waiting}</div>
          <span className="text-[10px] text-amber-600 font-medium">In Yard / Queue</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">{t.noShows}</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{stats.noShows}</div>
          <span className="text-[10px] text-rose-500 font-medium">Cancelled / Expired</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">{t.mandiCapacity}</span>
          <div className="text-2xl font-black text-agri-800 mt-1">{stats.capacityUtilizationPercent}%</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-agri-600 rounded-full" style={{ width: `${stats.capacityUtilizationPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Live Queue Controller Table */}
      <div className="card p-0 bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-agri-700" />
            <h3 className="font-bold text-slate-900 text-sm">
              Live Mandi Queue & Stage Progression Controller
            </h3>
          </div>

          <button
            onClick={fetchOfficerData}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 bg-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Roster</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Token</th>
                <th className="py-3.5 px-4">Farmer Details</th>
                <th className="py-3.5 px-4">Crop & Quantity</th>
                <th className="py-3.5 px-4">Current Stage</th>
                <th className="py-3.5 px-4">Gate</th>
                <th className="py-3.5 px-4 text-right">Advance Stage Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queueList.map((entry: any) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-sm bg-slate-100 text-slate-900 px-2.5 py-1 rounded-lg">
                      {entry.tokenNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{entry.bookingToken}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <strong className="text-slate-900 font-bold block">{entry.farmerName}</strong>
                    <span className="text-[10px] text-slate-500 font-mono">+91 {entry.phone}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <strong className="text-slate-800 font-bold block">{entry.crop}</strong>
                    <span className="text-slate-500">{entry.quantity} Quintal</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        entry.stage === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : entry.stage === 'WEIGHING'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : entry.stage === 'QUALITY_CHECK'
                          ? 'bg-sky-100 text-sky-800'
                          : entry.stage === 'GATE_ENTRY'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {entry.stage}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {entry.gateNumber || 'Gate 1'}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {entry.stage === 'WAITING' && (
                        <button
                          onClick={() => handleUpdateStage(entry.id, 'GATE_ENTRY')}
                          className="btn-secondary text-[11px] py-1 px-2.5 bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
                        >
                          Allow Gate Entry
                        </button>
                      )}

                      {entry.stage === 'GATE_ENTRY' && (
                        <button
                          onClick={() => handleUpdateStage(entry.id, 'WEIGHING')}
                          className="btn-secondary text-[11px] py-1 px-2.5 bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                        >
                          Start Weighing
                        </button>
                      )}

                      {entry.stage === 'WEIGHING' && (
                        <button
                          onClick={() => handleUpdateStage(entry.id, 'QUALITY_CHECK')}
                          className="btn-secondary text-[11px] py-1 px-2.5 bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100"
                        >
                          Send to Quality Lab
                        </button>
                      )}

                      {entry.stage === 'QUALITY_CHECK' && (
                        <button
                          onClick={() => {
                            setSelectedEntryForWeighing(entry);
                          }}
                          className="btn-primary text-[11px] py-1 px-2.5"
                        >
                          Issue J-Form
                        </button>
                      )}

                      {entry.stage === 'COMPLETED' && (
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5" /> J-Form Issued
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weighing & Quality Entry Modal for J-Form Generation */}
      {selectedEntryForWeighing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-agri-700" />
                <span>Issue Digital J-Form & Finalize Weighing</span>
              </h3>
              <button
                onClick={() => setSelectedEntryForWeighing(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleRecordWeighingSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 text-slate-700">
                Farmer: <strong className="text-slate-900">{selectedEntryForWeighing.farmerName}</strong> • Crop: <strong>{selectedEntryForWeighing.crop}</strong>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gross Weight (Qtl)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tare Weight (Qtl)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tareWeight}
                    onChange={(e) => setTareWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Moisture % (Max 12%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={moisture}
                    onChange={(e) => setMoisture(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quality Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                  >
                    <option value="GRADE_A">Grade A (Standard)</option>
                    <option value="FAQ_STANDARD">FAQ Standard</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 font-medium">
                Net Crop: <strong>{(parseFloat(grossWeight) - parseFloat(tareWeight)).toFixed(1)} Qtl</strong> • Payout: <strong>₹{((parseFloat(grossWeight) - parseFloat(tareWeight)) * 2275).toLocaleString('en-IN')}</strong>
              </div>

              <button
                type="submit"
                disabled={isSubmittingJForm}
                className="btn-primary w-full py-3 text-xs font-bold shadow-md"
              >
                {isSubmittingJForm ? 'Generating...' : 'Confirm & Dispatch DBT Payment Transfer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
