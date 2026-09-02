import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import {
  MapPin,
  Building,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const DistrictAdminPage: React.FC = () => {
  const { language } = useLanguage();
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    api.getDistrictAdminAnalytics('dist-hr-sonipat').then((res) => {
      if (res.success) {
        setData(res);
      }
    });
  }, []);

  const district = data?.district || {
    name: 'Sonipat',
    hindiName: 'सोनीपत',
    stateName: 'Haryana',
    totalCenters: 3,
    totalActiveFarmers: 12840,
    todayBookings: 842,
    averageWaitMinutes: 38,
  };

  const centerPerformances = data?.centerPerformances || [
    { name: 'Sonipat Central Grain Mandi', officer: 'Dr. Harish Chander', todayFarmers: 184, completedFarmers: 121, waitingFarmers: 63, averageWaitMinutes: 38, capacityUtilizationPercent: 82, status: 'OPERATIONAL' },
    { name: 'Gohana Sub-Yard Center', officer: 'Shri Vikram Malik', todayFarmers: 95, completedFarmers: 70, waitingFarmers: 25, averageWaitMinutes: 24, capacityUtilizationPercent: 65, status: 'OPERATIONAL' },
    { name: 'Ganaur Agro Procurement Yard', officer: 'Smt. Sunita Dahiya', todayFarmers: 78, completedFarmers: 52, waitingFarmers: 26, averageWaitMinutes: 52, capacityUtilizationPercent: 74, status: 'OPERATIONAL' },
  ];

  const hourlyChart = data?.hourlyBookingsChart || [
    { time: '08:00 AM', bookings: 42, completed: 38, waitTime: 25 },
    { time: '10:00 AM', bookings: 68, completed: 54, waitTime: 38 },
    { time: '12:00 PM', bookings: 55, completed: 48, waitTime: 35 },
    { time: '02:00 PM', bookings: 72, completed: 60, waitTime: 42 },
    { time: '04:00 PM', bookings: 48, completed: 44, waitTime: 28 },
    { time: '06:00 PM', bookings: 25, completed: 25, waitTime: 15 },
  ];

  const cropDistribution = data?.cropDistribution || [
    { name: 'Wheat (गेहूं)', value: 58, fill: '#15803d' },
    { name: 'Mustard (सरसों)', value: 24, fill: '#eab308' },
    { name: 'Gram (चना)', value: 12, fill: '#f97316' },
    { name: 'Paddy (धान)', value: 6, fill: '#0284c7' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>District Collectorate / Deputy Commissioner Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            District: {district.name} ({district.stateName})
          </h1>
          <p className="text-xs text-slate-300">
            Real-time multi-mandi queue oversight, procurement throughput & wait analytics.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Mandis</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{district.totalCenters} Centers</div>
          <span className="text-[10px] text-emerald-600 font-medium">100% Operational</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Registered Farmers</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{district.totalActiveFarmers.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500 font-medium">Verified by Land Records</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Today's Total Bookings</span>
          <div className="text-2xl font-black text-agri-700 mt-1">{district.todayBookings}</div>
          <span className="text-[10px] text-agri-600 font-medium">Scheduled Across Mandis</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">District Avg. Wait Time</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{district.averageWaitMinutes} min</div>
          <span className="text-[10px] text-emerald-600 font-medium">85% reduction vs manual</span>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Throughput Chart (2 cols) */}
        <div className="lg:col-span-2 card p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-agri-700" />
              <h3 className="font-bold text-sm text-slate-900">
                Today's Hourly Procurement Bookings & Completed Flow
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Intervals (08:00 - 18:00)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" textAnchor="middle" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="bookings" name="Scheduled Bookings" fill="#15803d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Procured & Weighed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Procurement Distribution (1 col) */}
        <div className="card p-6 bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-agri-700" />
              <h3 className="font-bold text-sm text-slate-900">Crop Volume Share</h3>
            </div>
            <span className="badge-info text-[10px] font-bold">Rabi 2026</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {cropDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {cropDistribution.map((crop: any) => (
              <div key={crop.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: crop.fill }} />
                  <span>{crop.name}</span>
                </span>
                <strong className="text-slate-900">{crop.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Performance Comparison Table */}
      <div className="card p-0 bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-agri-700" />
            <h3 className="font-bold text-slate-900 text-sm">
              Mandi Procurement Centers Performance Matrix
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Center Name</th>
                <th className="py-3.5 px-4">Secretary In-Charge</th>
                <th className="py-3.5 px-4">Today Farmers</th>
                <th className="py-3.5 px-4">Completed</th>
                <th className="py-3.5 px-4">In Yard Waiting</th>
                <th className="py-3.5 px-4">Avg Wait</th>
                <th className="py-3.5 px-4">Capacity Utilization</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {centerPerformances.map((cp: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{cp.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{cp.officer}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{cp.todayFarmers}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">{cp.completedFarmers}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">{cp.waitingFarmers}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{cp.averageWaitMinutes} min</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-agri-600" style={{ width: `${cp.capacityUtilizationPercent}%` }} />
                      </div>
                      <span className="font-bold text-slate-700">{cp.capacityUtilizationPercent}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="badge-success text-[10px] font-bold">{cp.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
