import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import {
  Building2,
  Cpu,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Bell,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const StateAdminPage: React.FC = () => {
  const { language } = useLanguage();
  const [stateConfig, setStateConfig] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [procurementMode, setProcurementMode] = useState('CENTRALIZED');
  const [slotDuration, setSlotDuration] = useState<number>(60);
  const [dailyCapacity, setDailyCapacity] = useState<number>(85000);
  const [emergencyQuota, setEmergencyQuota] = useState<number>(15);
  const [channels, setChannels] = useState<string[]>(['SMS', 'WhatsApp', 'Push', 'App']);
  const [crops, setCrops] = useState<string[]>(['Wheat', 'Paddy / Rice', 'Mustard', 'Bajra (Pearl Millet)']);
  const [documents, setDocuments] = useState<string[]>([
    'Meri Fasal Mera Byora ID',
    'Aadhaar Card',
    'Bank Passbook',
    'Land Farad / Jamabandi',
  ]);

  const loadConfig = async () => {
    try {
      const res = await api.getStateConfig('state-hr');
      if (res.success && res.config) {
        setStateConfig(res.config);
        setProcurementMode(res.config.procurementMode || 'CENTRALIZED');
        setSlotDuration(res.config.slotDurationMinutes || 60);
        setDailyCapacity(res.config.dailyCapacityLimitQuintals || 85000);
        setEmergencyQuota(res.config.emergencySlotQuotaPercent || 15);
        if (Array.isArray(res.config.notificationChannels)) setChannels(res.config.notificationChannels);
        if (Array.isArray(res.config.supportedCrops)) setCrops(res.config.supportedCrops);
        if (Array.isArray(res.config.requiredDocuments)) setDocuments(res.config.requiredDocuments);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleToggleChannel = (ch: string) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleToggleCrop = (crop: string) => {
    setCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await api.updateStateConfig('state-hr', {
        procurementMode,
        slotDurationMinutes: slotDuration,
        dailyCapacityLimitQuintals: dailyCapacity,
        emergencySlotQuotaPercent: emergencyQuota,
        notificationChannels: channels,
        supportedCrops: crops,
        requiredDocuments: documents,
      });

      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (e: any) {
      alert(e.message || 'Failed to update configuration');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>State Configuration Engine • Dynamic Policy Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            State Administration: Haryana (HR)
          </h1>
          <p className="text-xs text-slate-300">
            Configure state procurement rules, slot durations, documents, and notifications without rebuilding frontend.
          </p>
        </div>

        <button
          onClick={loadConfig}
          className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Config</span>
        </button>
      </div>

      {/* State Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">State Districts</span>
          <div className="text-2xl font-black text-slate-900 mt-1">22 Districts</div>
          <span className="text-[10px] text-slate-500 font-medium">Fully Mapped</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Procurement Centers</span>
          <div className="text-2xl font-black text-slate-900 mt-1">418 Mandis</div>
          <span className="text-[10px] text-emerald-600 font-medium">98.4% Active</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Farmers</span>
          <div className="text-2xl font-black text-agri-700 mt-1">12,842</div>
          <span className="text-[10px] text-agri-600 font-medium">Registered in Portal</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Today's Bookings</span>
          <div className="text-2xl font-black text-harvest-600 mt-1">8,421</div>
          <span className="text-[10px] text-slate-500 font-medium">Statewide Scheduled</span>
        </div>
      </div>

      {/* Interactive State Rules Engine Form */}
      <div className="card p-6 sm:p-8 bg-white border border-slate-200 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-agri-700 text-white flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Dynamic State Configuration Engine
              </h2>
              <p className="text-xs text-slate-500">
                Changes apply in real-time to all farmers booking slots in this state.
              </p>
            </div>
          </div>

          {saveSuccess && (
            <span className="badge-success text-xs font-bold gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> Changes Applied Live!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-6 text-xs">
          {/* Row 1: Procurement Mode & Slot Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Procurement Mode (खरीद का प्रकार)
              </label>
              <select
                value={procurementMode}
                onChange={(e) => setProcurementMode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-agri-600 focus:outline-none"
              >
                <option value="CENTRALIZED">Centralized (State Agency Direct)</option>
                <option value="HYBRID">Hybrid (APMC Mandi + PACS)</option>
                <option value="DECENTRALIZED">Decentralized (DPC District Hubs)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Slot Duration Window (स्लॉट की अवधि)
              </label>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-agri-600 focus:outline-none"
              >
                <option value={30}>30 Minutes (Fast Queue / High Throughput)</option>
                <option value={45}>45 Minutes (Medium Queue)</option>
                <option value={60}>60 Minutes (Standard 1-Hour Windows)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Daily Mandi Capacity Limit (Quintal)
              </label>
              <input
                type="number"
                value={dailyCapacity}
                onChange={(e) => setDailyCapacity(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-agri-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Notification Channels Matrix */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              Active Notification Channels (सूचना प्रसारण माध्यम)
            </label>
            <div className="flex flex-wrap gap-2.5">
              {['SMS', 'WhatsApp', 'Push', 'App'].map((ch) => {
                const isSelected = channels.includes(ch);
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => handleToggleChannel(ch)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-agri-700 text-white border-agri-700 shadow-sm'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {ch} {isSelected ? '✓ Enabled' : '+ Enable'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Supported Crops Checklist */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              Supported Crops for State Procurement (स्वीकृत फसलें)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Wheat',
                'Paddy / Rice',
                'Mustard',
                'Bajra (Pearl Millet)',
                'Maize',
                'Cotton',
                'Soybean',
                'Gram / Chana',
              ].map((crop) => {
                const isSelected = crops.includes(crop);
                return (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => handleToggleCrop(crop)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {crop} {isSelected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Required Documents Checklist */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              Required Documents Verification Checklist (अनिवार्य दस्तावेज़)
            </label>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary py-3 px-8 text-xs font-bold flex items-center gap-2 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Policy...' : 'Save & Publish State Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
