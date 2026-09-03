import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import {
  Layers,
  MapPin,
  Building2,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  FileText,
  Bell,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StatesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [states, setStates] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getStates();
        if (res.success && res.states) {
          setStates(res.states);
          setSelectedState(res.states[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>India State System</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'अखिल भारतीय राज्य खरीद प्रणाली' : 'India-Wide State Procurement Directory'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {language === 'hi'
            ? 'प्रत्येक राज्य अपनी कृषि नीतियों और मंडी क्षमता के अनुसार स्लॉट अवधि (30/60 मिनट), आवश्यक दस्तावेज़ एवं अधिसूचना चैनल तय करता है।'
            : 'Explore state-specific procurement policies, active grain markets, dynamic slot rules, and live capacity utilization powered by our State Configuration Engine.'}
        </p>
      </div>

      {/* Grid of States */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {states.map((st) => {
          const isSelected = selectedState?.id === st.id;
          const supportedCrops: string[] = Array.isArray(st.supportedCrops)
            ? st.supportedCrops
            : typeof st.supportedCrops === 'string'
            ? (() => {
                try {
                  const p = JSON.parse(st.supportedCrops);
                  return Array.isArray(p) ? p : ['Wheat', 'Paddy', 'Mustard'];
                } catch {
                  return ['Wheat', 'Paddy', 'Mustard'];
                }
              })()
            : ['Wheat', 'Paddy', 'Mustard', 'Bajra'];

          const activeFarmers = typeof st.activeFarmersCount === 'number'
            ? st.activeFarmersCount
            : 12450;

          const centersCount = typeof st.procurementCentersCount === 'number'
            ? st.procurementCentersCount
            : (st.districts?.length ? st.districts.length * 3 : 18);

          const availableSlots = st.todayAvailableSlots ?? 1650;
          const avgWait = st.averageWaitMinutes ?? 25;
          const status = st.procurementStatus || 'ACTIVE';

          return (
            <div
              key={st.id}
              onClick={() => setSelectedState(st)}
              className={`card p-6 bg-white border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-agri-600 shadow-lg ring-2 ring-agri-200'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="space-y-4">
                {/* State Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{st.name}</h3>
                    <p className="text-xs text-slate-500">{st.hindiName} • Code: {st.code}</p>
                  </div>
                  <span className="badge-success text-[10px] uppercase font-bold">
                    {status}
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2.5 text-xs pt-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                      <Building2 className="w-2.5 h-2.5 text-agri-600" /> Centers
                    </span>
                    <strong className="text-sm text-slate-800">{centersCount} Mandis</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 text-agri-600" /> Today's Slots
                    </span>
                    <strong className="text-sm text-emerald-700">{availableSlots}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                      <Users className="w-2.5 h-2.5 text-agri-600" /> Active Farmers
                    </span>
                    <strong className="text-sm text-slate-800">{activeFarmers.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-amber-500" /> Avg Wait
                    </span>
                    <strong className="text-sm text-amber-700">{avgWait} min</strong>
                  </div>
                </div>

                {/* Supported Crops Badges */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Supported Crops:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {supportedCrops.slice(0, 3).map((c: string) => (
                      <span key={c} className="px-2 py-0.5 rounded-md bg-agri-50 text-agri-800 text-[10px] font-semibold border border-agri-200">
                        {c}
                      </span>
                    ))}
                    {supportedCrops.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-400">
                        +{supportedCrops.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-agri-700">
                  {language === 'hi' ? 'नियम व स्लॉट देखें' : 'View State Rules'}
                </span>
                <ArrowRight className="w-4 h-4 text-agri-700" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected State Detailed Configuration Drawer / Modal Preview */}
      {/* Selected State Detailed Configuration Drawer / Modal Preview */}
      {selectedState && (
        <div className="card p-6 sm:p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700 rounded-3xl shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Cpu className="w-4 h-4" /> State Configuration Engine Parameters
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {selectedState.name} ({selectedState.hindiName})
              </h2>
            </div>

            <Link
              to={`/centers?stateId=${selectedState.id}`}
              className="btn-accent py-2.5 px-5 text-xs font-bold flex items-center gap-2"
            >
              <span>View {selectedState.name} Procurement Centers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-[10px] text-emerald-300 font-bold uppercase">Procurement Mode</span>
              <p className="text-base font-bold text-white">{selectedState.config?.procurementMode || 'Decentralized MSP (DCP)'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-[10px] text-emerald-300 font-bold uppercase">Slot Duration</span>
              <p className="text-base font-bold text-white">{selectedState.config?.slotDurationMinutes || 60} Minutes</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-[10px] text-emerald-300 font-bold uppercase">Daily Mandi Capacity</span>
              <p className="text-base font-bold text-white">{Math.round((selectedState.config?.dailyCapacityLimitQuintals || 50000) / 10).toLocaleString('en-IN')} MT / Day</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-[10px] text-emerald-300 font-bold uppercase">Emergency Quota</span>
              <p className="text-base font-bold text-white">{selectedState.config?.emergencySlotQuotaPercent || 10}% Quota</p>
            </div>
          </div>

          {/* Mandatory Documents Checklist */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-700/80 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Mandatory Farmer Documents Required:
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {(() => {
                const reqDocs = selectedState.config?.requiredDocuments;
                let docs: string[] = ['Aadhaar Card', 'Land Record / Farad', 'Bank Passbook'];
                if (Array.isArray(reqDocs)) {
                  docs = reqDocs;
                } else if (typeof reqDocs === 'string') {
                  try {
                    const parsed = JSON.parse(reqDocs);
                    if (Array.isArray(parsed)) docs = parsed;
                  } catch {
                    // ignore
                  }
                }
                return docs.map((doc: string) => (
                  <span key={doc} className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {doc}
                  </span>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
