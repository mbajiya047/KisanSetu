import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  CheckCircle2,
  Clock,
  Truck,
  Scale,
  FlaskConical,
  FileCheck2,
  CreditCard,
} from 'lucide-react';

interface ProcurementTimelineProps {
  currentStage: 'REGISTERED' | 'BOOKED' | 'ARRIVED' | 'WEIGHING' | 'QUALITY_CHECK' | 'PROCURED' | 'COMPLETED' | 'PAYMENT_PENDING' | 'PAYMENT_PROCESSED';
  paymentStatus?: 'PENDING' | 'INITIATED' | 'PROCESSED';
}

export const ProcurementTimeline: React.FC<ProcurementTimelineProps> = ({
  currentStage = 'WEIGHING',
  paymentStatus = 'PENDING',
}) => {
  const { language } = useLanguage();

  const stages = [
    { key: 'REGISTERED', titleEn: 'Registration', titleHi: 'पंजीकरण', icon: CheckCircle2 },
    { key: 'BOOKED', titleEn: 'Slot Booked', titleHi: 'स्लॉट बुक', icon: Clock },
    { key: 'ARRIVED', titleEn: 'Gate Arrival', titleHi: 'मंडी आगमन', icon: Truck },
    { key: 'WEIGHING', titleEn: 'Weighing', titleHi: 'सकल वजन', icon: Scale },
    { key: 'QUALITY_CHECK', titleEn: 'Quality Check', titleHi: 'गुणवत्ता जांच', icon: FlaskConical },
    { key: 'PROCURED', titleEn: 'J-Form Issued', titleHi: 'जे-फॉर्म जारी', icon: FileCheck2 },
    { key: 'PAYMENT', titleEn: 'DBT Payment', titleHi: 'डीबीटी भुगतान', icon: CreditCard },
  ];

  const getStageIndex = (stage: string) => {
    switch (stage) {
      case 'REGISTERED':
        return 0;
      case 'BOOKED':
        return 1;
      case 'ARRIVED':
      case 'GATE_ENTRY':
        return 2;
      case 'WEIGHING':
        return 3;
      case 'QUALITY_CHECK':
        return 4;
      case 'PROCURED':
      case 'COMPLETED':
        return 5;
      case 'PAYMENT_PENDING':
      case 'PAYMENT_PROCESSED':
        return 6;
      default:
        return 3;
    }
  };

  const activeIndex = getStageIndex(currentStage);

  return (
    <div className="w-full py-4">
      {/* Step Tracker for Large Screens */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 z-0" />
        <div
          className="absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-agri-600 transition-all duration-700 z-0"
          style={{ width: `${(activeIndex / (stages.length - 1)) * 90}%` }}
        />

        {stages.map((st, idx) => {
          const Icon = st.icon;
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={st.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-agri-700 text-white shadow-md shadow-agri-700/20'
                    : isCurrent
                    ? 'bg-harvest-500 text-white shadow-lg ring-4 ring-harvest-200 animate-pulse'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`text-xs mt-2 font-semibold text-center whitespace-nowrap ${
                  isCurrent ? 'text-harvest-700 font-bold' : isDone ? 'text-agri-900' : 'text-slate-400'
                }`}
              >
                {language === 'hi' ? st.titleHi : st.titleEn}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {isDone ? '✓' : isCurrent ? (language === 'hi' ? 'जारी है' : 'In Progress') : ''}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Step List */}
      <div className="md:hidden space-y-3">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={st.key}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-harvest-50 border-harvest-400 font-bold'
                  : isDone
                  ? 'bg-agri-50 border-agri-200 text-agri-900'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isDone
                      ? 'bg-agri-700 text-white'
                      : isCurrent
                      ? 'bg-harvest-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">
                  {language === 'hi' ? st.titleHi : st.titleEn}
                </span>
              </div>

              <span className="text-xs font-bold">
                {isDone ? (
                  <span className="text-emerald-700">✓ Done</span>
                ) : isCurrent ? (
                  <span className="text-harvest-700">In Progress</span>
                ) : (
                  <span className="text-slate-300">Pending</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
