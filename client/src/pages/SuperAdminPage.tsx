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
  Search,
  Trash2,
  Power,
  MapPin,
  Phone,
  AlertTriangle,
  RefreshCw,
  X,
  IndianRupee,
  Lock,
} from 'lucide-react';

export const SuperAdminPage: React.FC = () => {
  const { language } = useLanguage();
  const [data, setData] = useState<any | null>(null);
  const [states, setStates] = useState<any[]>([]);
  const [mandis, setMandis] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchMandi, setSearchMandi] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Modals
  const [isAddCenterOpen, setIsAddCenterOpen] = useState(false);
  const [mandiToDelete, setMandiToDelete] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // New Center Form State
  const [newCenter, setNewCenter] = useState({
    name: '',
    hindiName: '',
    code: '',
    stateId: 'state-rj',
    districtId: 'dist-rj-nagaur',
    address: '',
    latitude: '27.2023',
    longitude: '73.7438',
    officerInCharge: '',
    contactNumber: '+91 ',
    dailyCapacityQuintals: '8500',
    maxDailyFarmers: '200',
    activeGates: '3',
    openTime: '08:00 AM',
    closeTime: '06:30 PM',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, statesRes, rosterRes] = await Promise.all([
        api.getSuperAdminAnalytics(),
        api.getStates(),
        api.getGovernmentMandiRoster(),
      ]);

      if (analyticsRes.success) setData(analyticsRes);
      if (statesRes.success && statesRes.states) setStates(statesRes.states);
      if (rosterRes.success && rosterRes.mandis) setMandis(rosterRes.mandis);
    } catch (e) {
      console.error('Error loading super admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered districts for Add Center Modal based on selected state
  const currentStateObj = states.find((s) => s.id === newCenter.stateId);
  const availableDistricts = currentStateObj?.districts || [
    { id: 'dist-rj-nagaur', name: 'Nagaur', hindiName: 'नागौर' },
    { id: 'dist-rj-didwana-kuchaman', name: 'Didwana-Kuchaman', hindiName: 'डीडवाना-कुचामन' },
    { id: 'dist-rj-jaipur', name: 'Jaipur', hindiName: 'जयपुर' },
    { id: 'dist-rj-sikar', name: 'Sikar', hindiName: 'सीकर' },
    { id: 'dist-rj-bikaner', name: 'Bikaner', hindiName: 'बीकानेर' },
    { id: 'dist-rj-jaisalmer', name: 'Jaisalmer', hindiName: 'जैसलमेर' },
    { id: 'dist-rj-jodhpur', name: 'Jodhpur', hindiName: 'जोधपुर' },
    { id: 'dist-rj-udaipur', name: 'Udaipur', hindiName: 'उदयपुर' },
    { id: 'dist-rj-alwar', name: 'Alwar', hindiName: 'अलवर' },
    { id: 'dist-rj-kota', name: 'Kota', hindiName: 'कोटा' },
    { id: 'dist-rj-ganganagar', name: 'Sri Ganganagar', hindiName: 'श्री गंगानगर' },
  ];

  // Handle Add Mandi Submit
  const handleAddCenterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.addProcurementCenter(newCenter);
      if (res.success) {
        setActionSuccessMsg(`Mandi '${newCenter.name}' created and added to market!`);
        setIsAddCenterOpen(false);
        setNewCenter({
          name: '',
          hindiName: '',
          code: '',
          stateId: 'state-rj',
          districtId: 'dist-rj-nagaur',
          address: '',
          latitude: '27.2023',
          longitude: '73.7438',
          officerInCharge: '',
          contactNumber: '+91 ',
          dailyCapacityQuintals: '8500',
          maxDailyFarmers: '200',
          activeGates: '3',
          openTime: '08:00 AM',
          closeTime: '06:30 PM',
        });
        loadData();
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create procurement center');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Mandi
  const handleDeleteMandi = async () => {
    if (!mandiToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await api.deleteProcurementCenter(mandiToDelete.id);
      if (res.success) {
        setActionSuccessMsg(`Mandi '${mandiToDelete.name}' removed from market.`);
        setMandiToDelete(null);
        loadData();
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete procurement center');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Toggle Mandi Status
  const handleToggleStatus = async (centerId: string, currentName: string) => {
    try {
      const res = await api.toggleMandiStatus(centerId);
      if (res.success) {
        setActionSuccessMsg(`Status updated for '${currentName}'.`);
        loadData();
        setTimeout(() => setActionSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  // Filtered Mandis Roster
  const filteredMandis = mandis.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchMandi.toLowerCase()) ||
      m.hindiName.toLowerCase().includes(searchMandi.toLowerCase()) ||
      m.code.toLowerCase().includes(searchMandi.toLowerCase()) ||
      m.officerInCharge.toLowerCase().includes(searchMandi.toLowerCase()) ||
      m.districtName.toLowerCase().includes(searchMandi.toLowerCase()) ||
      m.stateName.toLowerCase().includes(searchMandi.toLowerCase());

    const matchesState =
      selectedStateFilter === 'ALL' || m.stateId === selectedStateFilter;

    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'OPERATIONAL' && m.isOperational) ||
      (selectedStatusFilter === 'SUSPENDED' && !m.isOperational);

    return matchesSearch && matchesState && matchesStatus;
  });

  const metrics = data?.nationalMetrics || {
    totalStates: 9,
    totalProcurementCenters: mandis.length || 28,
    registeredFarmers: 482900,
    todayBookings: 18450,
    totalProcuredMT: 142850,
    averageNationalWaitMinutes: 38,
    systemUptime: '99.98%',
    activePeakLoad: '1,420 req/sec',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="card p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white shadow-xl rounded-3xl flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Government Confidential National Command Center • Super Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            All-India Agricultural Procurement & Mandi Market Manager
          </h1>
          <p className="text-xs text-slate-400">
            Confidential government mandi intelligence, full market roster access, add/remove procurement centers, and real-time operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddCenterOpen(true)}
            className="btn-accent py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add New APMC Mandi to Market</span>
          </button>

          <button
            onClick={loadData}
            title="Refresh All Records"
            className="btn-secondary py-2.5 px-3 text-xs font-bold flex items-center gap-1.5 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)}>
            <X className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
        </div>
      )}

      {/* 6 National Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="card p-4 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Integrated States</span>
          <div className="text-xl font-black text-slate-900 mt-1">{metrics.totalStates} States</div>
          <span className="text-[10px] text-emerald-600 font-medium">Pan-India Unified Hub</span>
        </div>

        <div className="card p-4 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Mandis</span>
          <div className="text-xl font-black text-emerald-700 mt-1">{mandis.length || metrics.totalProcurementCenters} Mandis</div>
          <span className="text-[10px] text-emerald-600 font-medium">Live Connected Yards</span>
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

      {/* GOVERNMENT CONFIDENTIAL MANDI ROSTER & MARKET MANAGER */}
      <div className="card p-0 bg-white border border-slate-200 overflow-hidden shadow-md space-y-0">
        {/* Roster Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white">
                  Government Confidential All-Mandi Intelligence & Management Roster
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {filteredMandis.length} Active Centers
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official records of Mandi Secretaries, phone contacts, capacities, financial MSP volumes, and live controls.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddCenterOpen(true)}
            className="btn-primary py-2 px-3 text-xs font-bold flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New APMC Mandi</span>
          </button>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search Mandi */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchMandi}
              onChange={(e) => setSearchMandi(e.target.value)}
              placeholder="Search by Mandi name, code (e.g. RJ-NAG-001), district, or officer in-charge..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-300 font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-agri-600 text-xs"
            />
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold uppercase text-[10px]">State:</span>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-300 font-semibold text-slate-700 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-none"
            >
              <option value="ALL">All States ({mandis.length} Mandis)</option>
              <option value="state-rj">Rajasthan (13 Mandis)</option>
              <option value="state-hr">Haryana (7 Mandis)</option>
              <option value="state-pb">Punjab (2 Mandis)</option>
              <option value="state-up">Uttar Pradesh (2 Mandis)</option>
              <option value="state-mp">Madhya Pradesh (2 Mandis)</option>
              <option value="state-mh">Maharashtra (1 Mandi)</option>
              <option value="state-gj">Gujarat (1 Mandi)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-300 font-semibold text-slate-700 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="OPERATIONAL">Operational Only</option>
              <option value="SUSPENDED">Suspended Only</option>
            </select>
          </div>
        </div>

        {/* Mandis Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold border-b border-slate-200 text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Mandi Center & Code</th>
                <th className="py-3.5 px-4">State & District</th>
                <th className="py-3.5 px-4">Secretary In-Charge & Contact</th>
                <th className="py-3.5 px-4">Daily Cap. (Qtl)</th>
                <th className="py-3.5 px-4">Reg. Farmers</th>
                <th className="py-3.5 px-4">Disbursed (₹ Cr)</th>
                <th className="py-3.5 px-4">Gates / Wait</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Government Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredMandis.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Building className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs">No procurement centers found matching criteria</p>
                  </td>
                </tr>
              ) : (
                filteredMandis.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    {/* Mandi Name & Code */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs">{m.name}</div>
                      <div className="text-[11px] text-slate-500">{m.hindiName}</div>
                      <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                        {m.code}
                      </span>
                    </td>

                    {/* State & District */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{m.stateName}</div>
                      <div className="text-xs text-slate-500">{m.districtName}</div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {m.latitude.toFixed(2)}°N, {m.longitude.toFixed(2)}°E
                      </span>
                    </td>

                    {/* Officer & Phone */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{m.officerInCharge}</div>
                      <div className="text-xs text-emerald-700 font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{m.contactNumber}</span>
                      </div>
                    </td>

                    {/* Capacity */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {m.dailyCapacityQuintals.toLocaleString()} Qtl
                      <span className="block text-[10px] font-normal text-slate-500">
                        Max {m.maxDailyFarmers} Farmers/Day
                      </span>
                    </td>

                    {/* Registered Farmers */}
                    <td className="py-3.5 px-4 font-mono font-bold text-agri-800">
                      {m.totalRegisteredFarmers.toLocaleString()}
                      <span className="block text-[10px] font-normal text-emerald-600 font-sans">
                        {m.activeBookingsToday} Today
                      </span>
                    </td>

                    {/* Disbursed Payout */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      ₹{m.disbursedPayoutCrores} Cr
                      <span className="block text-[10px] font-normal text-slate-500 font-sans">
                        {m.totalProcuredVolumeMT.toLocaleString()} MT Procured
                      </span>
                    </td>

                    {/* Gates & Wait */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{m.activeGates} Gates</div>
                      <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> {m.currentWaitMinutes} min wait
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(m.id, m.name)}
                        title="Click to toggle operational status"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          m.isOperational
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{m.isOperational ? 'OPERATIONAL' : 'SUSPENDED'}</span>
                      </button>
                    </td>

                    {/* Actions: Delete Mandi */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setMandiToDelete(m)}
                        title="Remove Mandi from Market"
                        className="p-2 rounded-xl text-rose-600 hover:text-white hover:bg-rose-600 transition-all border border-rose-200 hover:border-rose-600 shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD NEW APMC MANDI TO MARKET */}
      {isAddCenterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    Add New APMC Procurement Center (मंडी जोड़ें)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Register a new mandi to the national network with immediate slot allocation.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddCenterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCenterSubmit} className="space-y-4 text-xs">
              {/* Row 1: State & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">State (राज्य)</label>
                  <select
                    value={newCenter.stateId}
                    onChange={(e) => {
                      const stId = e.target.value;
                      setNewCenter({
                        ...newCenter,
                        stateId: stId,
                        districtId: stId === 'state-rj' ? 'dist-rj-nagaur' : 'dist-hr-sonipat',
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-none"
                    required
                  >
                    <option value="state-rj">Rajasthan (राजस्थान)</option>
                    <option value="state-hr">Haryana (हरियाणा)</option>
                    <option value="state-pb">Punjab (पंजाब)</option>
                    <option value="state-up">Uttar Pradesh (उत्तर प्रदेश)</option>
                    <option value="state-mp">Madhya Pradesh (मध्य प्रदेश)</option>
                    <option value="state-mh">Maharashtra (महाराष्ट्र)</option>
                    <option value="state-gj">Gujarat (गुजरात)</option>
                    <option value="state-ka">Karnataka (कर्नाटक)</option>
                    <option value="state-tn">Tamil Nadu (तमिलनाडु)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">District (ज़िला)</label>
                  <select
                    value={newCenter.districtId}
                    onChange={(e) => setNewCenter({ ...newCenter, districtId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-none"
                    required
                  >
                    {availableDistricts.map((d: any) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.hindiName || d.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Name in English & Hindi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Mandi Name in English (e.g. Merta City Anaaj Mandi)
                  </label>
                  <input
                    type="text"
                    value={newCenter.name}
                    onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
                    placeholder="Merta City Anaaj Mandi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Mandi Name in Hindi (e.g. मेड़ता सिटी अनाज मंडी)
                  </label>
                  <input
                    type="text"
                    value={newCenter.hindiName}
                    onChange={(e) => setNewCenter({ ...newCenter, hindiName: e.target.value })}
                    placeholder="मेड़ता सिटी अनाज मंडी"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 text-xs"
                  />
                </div>
              </div>

              {/* Row 3: Mandi Code & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Mandi Code (e.g. RJ-MRT-001)</label>
                  <input
                    type="text"
                    value={newCenter.code}
                    onChange={(e) => setNewCenter({ ...newCenter, code: e.target.value.toUpperCase() })}
                    placeholder="RJ-MRT-001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold uppercase text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Daily Capacity (Quintal)</label>
                  <input
                    type="number"
                    value={newCenter.dailyCapacityQuintals}
                    onChange={(e) => setNewCenter({ ...newCenter, dailyCapacityQuintals: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Max Daily Farmers</label>
                  <input
                    type="number"
                    value={newCenter.maxDailyFarmers}
                    onChange={(e) => setNewCenter({ ...newCenter, maxDailyFarmers: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                    required
                  />
                </div>
              </div>

              {/* Row 4: Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Physical Mandi Yard Address</label>
                <input
                  type="text"
                  value={newCenter.address}
                  onChange={(e) => setNewCenter({ ...newCenter, address: e.target.value })}
                  placeholder="Near Railway Crossing, Nagaur Road, Merta City, Rajasthan 341510"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                  required
                />
              </div>

              {/* Row 5: Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Latitude (अक्षांश)</label>
                  <input
                    type="text"
                    value={newCenter.latitude}
                    onChange={(e) => setNewCenter({ ...newCenter, latitude: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Longitude (देशांतर)</label>
                  <input
                    type="text"
                    value={newCenter.longitude}
                    onChange={(e) => setNewCenter({ ...newCenter, longitude: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Row 6: Officer & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Mandi Secretary / Officer Name</label>
                  <input
                    type="text"
                    value={newCenter.officerInCharge}
                    onChange={(e) => setNewCenter({ ...newCenter, officerInCharge: e.target.value })}
                    placeholder="Shri Ram Niwas Choudhary"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Official Contact Phone</label>
                  <input
                    type="text"
                    value={newCenter.contactNumber}
                    onChange={(e) => setNewCenter({ ...newCenter, contactNumber: e.target.value })}
                    placeholder="+91 1582 240150"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCenterOpen(false)}
                  className="btn-secondary py-2.5 px-5 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-2.5 px-6 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 shadow-md"
                >
                  {isSubmitting ? 'Registering Mandi...' : 'Register & Publish Mandi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM DELETE MANDI FROM MARKET */}
      {mandiToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Remove Mandi from Market?
                </h3>
                <span className="text-xs text-slate-500 block font-mono">
                  Code: {mandiToDelete.code}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              Are you sure you want to remove <strong>{mandiToDelete.name}</strong> ({mandiToDelete.stateName}) from the national procurement registry? All upcoming slots and queues for this center will be decommissioned.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMandiToDelete(null)}
                disabled={isSubmitting}
                className="btn-secondary py-2.5 px-5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteMandi}
                disabled={isSubmitting}
                className="btn-primary py-2.5 px-5 text-xs font-bold bg-rose-600 hover:bg-rose-700 shadow-md"
              >
                {isSubmitting ? 'Removing...' : 'Yes, Remove Mandi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
