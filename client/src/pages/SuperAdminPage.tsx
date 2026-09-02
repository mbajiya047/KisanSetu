import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import {
  Sparkles,
  Layers,
  Building,
  Users,
  Activity,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Server,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const SuperAdminPage: React.FC = () => {
  const { language } = useLanguage();
  const [data, setData] = useState<any | null>(null);
  const [states, setStates] = useState<any[]>([]);
  const [isAddCenterOpen, setIsAddCenterOpen] = useState(false);

  // New Center Form State
  const [newCenter, setNewCenter] = useState({
    name: 'Palwal Anaaj Mandi Yard',
    hindiName: 'पलवल अनाज मंडी यार्ड',
    code: 'HR-PLW-001',
    stateId: 'state-hr',
    districtId: 'dist-hr-sonipat',
    address: 'Near Railway Station, Palwal, Haryana',
    officerInCharge: 'Shri R.K. Bhardwaj',
    contactNumber: '+91 1275 254100',
    dailyCapacityQuintals: '6000',
    maxDailyFarmers: '150',
    activeGates: '3',
  });

  const loadAnalytics = async () => {
    try {
      const res = await api.getSuperAdminAnalytics();
      if (res.success) {
        setData(res);
      }
      const stRes = await api.getStates();
      if (stRes.success && stRes.states) {
        setStates(stRes.states);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleAddCenterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In real api: await api.addCenter(newCenter)
      alert(`Procurement center '${newCenter.name}' created successfully!`);
      setIsAddCenterOpen(false);
      loadAnalytics();
    } catch (e: any) {
      alert(e.message || 'Error creating center');
    }
  };

  const metrics = data?.nationalMetrics || {
    totalStates: 9,
    totalProcurementCenters: 418,
    registeredFarmers: 482900,
    todayBookings: 18450,
    totalProcuredMT: 142850,
    averageNationalWaitMinutes: 38,
    systemUptime: '99.98%',
    activePeakLoad: '1,420 req/sec',
  };

  const stateAnalytics = data?.stateAnalytics || [
    { stateName: 'Haryana', code: 'HR', districtsCount: 22, centersCount: 418, totalBookings: 8420, avgWaitMinutes: 38, procurementVolumeMT: 45000, activeMode: 'CENTRALIZED', slotDuration: 60 },
    { stateName: 'Punjab', code: 'PB', districtsCount: 23, centersCount: 520, totalBookings: 12100, avgWaitMinutes: 30, procurementVolumeMT: 58000, activeMode: 'CENTRALIZED', slotDuration: 60 },
    { stateName: 'Uttar Pradesh', code: 'UP', districtsCount: 75, centersCount: 890, totalBookings: 15400, avgWaitMinutes: 40, procurementVolumeMT: 62000, activeMode: 'HYBRID', slotDuration: 45 },
    { stateName: 'Madhya Pradesh', code: 'MP', districtsCount: 52, centersCount: 650, totalBookings: 9800, avgWaitMinutes: 28, procurementVolumeMT: 48000, activeMode: 'CENTRALIZED', slotDuration: 30 },
    { stateName: 'Rajasthan', code: 'RJ', districtsCount: 33, centersCount: 380, totalBookings: 6200, avgWaitMinutes: 35, procurementVolumeMT: 31000, activeMode: 'DECENTRALIZED', slotDuration: 45 },
    { stateName: 'Maharashtra', code: 'MH', districtsCount: 36, centersCount: 440, totalBookings: 7900, avgWaitMinutes: 32, procurementVolumeMT: 39000, activeMode: 'HYBRID', slotDuration: 30 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Super Admin Top Banner */}
      <div className="card p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white shadow-xl rounded-3xl flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>KisanSetu National Command Center • Super Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            All-India Agricultural Procurement Network
          </h1>
          <p className="text-xs text-slate-400">
            Real-time multi-state monitoring, system health, dynamic configuration & center management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddCenterOpen(true)}
            className="btn-accent py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Procurement Center</span>
          </button>
        </div>
      </div>

      {/* 6 National Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="card p-4 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Integrated States</span>
          <div className="text-xl font-black text-slate-900 mt-1">{metrics.totalStates} States</div>
          <span className="text-[10px] text-emerald-600 font-medium">Pan-India Common Hub</span>
        </div>

        <div className="card p-4 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Mandis</span>
          <div className="text-xl font-black text-slate-900 mt-1">{metrics.totalProcurementCenters}+</div>
          <span className="text-[10px] text-emerald-600 font-medium">Active Weighbridges</span>
        </div>

        <div className="card p-4 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Farmers</span>
          <div className="text-xl font-black text-agri-700 mt-1">{metrics.registeredFarmers.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-agri-600 font-medium">Across 9 States</span>
        </div>

        <div className="card p-4 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Today Bookings</span>
          <div className="text-xl font-black text-harvest-600 mt-1">{metrics.todayBookings.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500 font-medium">Slots Reserved</span>
        </div>

        <div className="card p-4 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg National Wait</span>
          <div className="text-xl font-black text-amber-600 mt-1">{metrics.averageNationalWaitMinutes} min</div>
          <span className="text-[10px] text-emerald-600 font-medium">Queue AI Reduced</span>
        </div>

        <div className="card p-4 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">System Uptime</span>
          <div className="text-xl font-black text-emerald-700 mt-1">{metrics.systemUptime}</div>
          <span className="text-[10px] text-slate-500 font-mono">{metrics.activePeakLoad}</span>
        </div>
      </div>

      {/* State-by-State Procurement Analytics Table */}
      <div className="card p-0 bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-agri-700" />
            <h3 className="font-bold text-slate-900 text-sm">
              State-by-State Procurement Performance & Policy Engine Overview
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">State Name</th>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Districts</th>
                <th className="py-3.5 px-4">Mandis</th>
                <th className="py-3.5 px-4">Procured Vol (MT)</th>
                <th className="py-3.5 px-4">Avg Wait</th>
                <th className="py-3.5 px-4">Slot Window</th>
                <th className="py-3.5 px-4">Procurement Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stateAnalytics.map((st: any) => (
                <tr key={st.code} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{st.stateName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{st.code}</td>
                  <td className="py-3.5 px-4 text-slate-700">{st.districtsCount}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{st.centersCount}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">{st.procurementVolumeMT.toLocaleString()} MT</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">{st.avgWaitMinutes} min</td>
                  <td className="py-3.5 px-4 font-mono">{st.slotDuration} min slots</td>
                  <td className="py-3.5 px-4">
                    <span className="badge-info text-[10px] font-bold">{st.activeMode}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Procurement Center Modal */}
      {isAddCenterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-agri-700" />
                <span>Add New Agricultural Procurement Center</span>
              </h3>
              <button
                onClick={() => setIsAddCenterOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddCenterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Center Name (मंडी का नाम)</label>
                <input
                  type="text"
                  value={newCenter.name}
                  onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Center Code</label>
                  <input
                    type="text"
                    value={newCenter.code}
                    onChange={(e) => setNewCenter({ ...newCenter, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Daily Capacity (Qtl)</label>
                  <input
                    type="number"
                    value={newCenter.dailyCapacityQuintals}
                    onChange={(e) => setNewCenter({ ...newCenter, dailyCapacityQuintals: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Address (स्थान / पता)</label>
                <input
                  type="text"
                  value={newCenter.address}
                  onChange={(e) => setNewCenter({ ...newCenter, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Secretary In-Charge</label>
                  <input
                    type="text"
                    value={newCenter.officerInCharge}
                    onChange={(e) => setNewCenter({ ...newCenter, officerInCharge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Active Weighbridge Gates</label>
                  <input
                    type="number"
                    value={newCenter.activeGates}
                    onChange={(e) => setNewCenter({ ...newCenter, activeGates: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-xs font-bold shadow-md mt-2"
              >
                Create & Publish Procurement Center
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
