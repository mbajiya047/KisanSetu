import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { ProcurementTimeline } from '../components/ProcurementTimeline';
import {
  FileSpreadsheet,
  FileCheck2,
  Download,
  Printer,
  Scale,
  FlaskConical,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  Wheat,
  ShieldCheck,
} from 'lucide-react';

export const ProcurementTrackingPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [activeRecord, setActiveRecord] = useState<any | null>(null);

  useEffect(() => {
    api.getProcurementRecords().then((res) => {
      if (res.success && res.records && res.records.length > 0) {
        setRecords(res.records);
        setActiveRecord(res.records[0]);
      } else {
        // Fallback demo record for presentation
        const mockRec = {
          id: 'proc-demo-1',
          jFormNumber: 'J-HR-2026-90412',
          verifiedByOfficer: 'Dr. Harish Chander (Mandi Secretary)',
          grossWeightQuintals: 58.2,
          tareWeightQuintals: 16.2,
          netWeightQuintals: 42.0,
          moisturePercent: 11.4,
          foreignMatterPercent: 0.4,
          qualityGrade: 'GRADE_A',
          agreedRatePerQuintal: 2275.0,
          grossAmount: 95550,
          deductionAmount: 0,
          netPayableAmount: 95550,
          createdAt: new Date().toISOString(),
          booking: {
            bookingToken: 'WHT-4921',
            crop: { name: 'Wheat', hindiName: 'गेहूं', mspRatePerQuintal: 2275 },
            center: { name: 'Sonipat Central Grain Mandi', address: 'GT Road, Sonipat' },
            farmer: { fullName: 'Ramesh Kumar', farmerId: 'FARM-HR-2026-8819', accountNumberMasked: 'XXXX-XXXX-4819', bankName: 'SBI Murthal' },
          },
          paymentRecord: {
            paymentRefNumber: 'DBT-PFMS-HR-2026-89412',
            amount: 95550,
            status: 'PENDING',
            mode: 'DBT_PFMS',
            bankAccountMasked: 'XXXX-XXXX-4819',
          },
        };
        setActiveRecord(mockRec);
        setRecords([mockRec]);
      }
    });
  }, [user]);

  const handlePrintJForm = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-bold">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Digital J-Form & Payout Tracking</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'मेरी फसल खरीद एवं भुगतान स्थिति' : 'My Procurement & Payment Tracking'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi'
              ? 'डिजिटल जे-फॉर्म, वजन पर्ची, गुणवत्ता जांच रिपोर्ट और डीबीटी बैंक भुगतान की पारदर्शी स्थिति।'
              : 'Official digital J-Form, tare/gross weight slips, quality moisture report and direct PFMS transfer tracker.'}
          </p>
        </div>

        <button
          onClick={handlePrintJForm}
          className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 bg-white shadow-sm"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>{language === 'hi' ? 'जे-फॉर्म रसीद प्रिंट करें' : 'Print J-Form Slip'}</span>
        </button>
      </div>

      {/* Procurement 6-Stage Progress */}
      <div className="card p-6 sm:p-7 bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-slate-900">{t.procurementProgress}</h3>
          <span className="badge-warning text-xs font-bold uppercase">
            Payment Pending Transfer
          </span>
        </div>
        <ProcurementTimeline currentStage="PROCURED" paymentStatus="PENDING" />
      </div>

      {activeRecord && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Digital J-Form Receipt (2 cols) */}
          <div className="lg:col-span-2 card p-6 sm:p-8 bg-white border-2 border-agri-200 shadow-md space-y-6">
            {/* J-Form Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-dashed border-slate-200 pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-agri-700 bg-agri-100 px-2 py-0.5 rounded">
                  Government Certified J-Form
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  Receipt No: {activeRecord.jFormNumber}
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Mandi: {activeRecord.booking?.center?.name || 'Sonipat Central Grain Mandi'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Issued On</span>
                <strong className="text-xs text-slate-800">15 September 2026</strong>
              </div>
            </div>

            {/* Weight & Quality Measurements */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                  <Scale className="w-3 h-3 text-agri-600" /> Gross Weight
                </span>
                <div className="text-base font-black text-slate-900">{activeRecord.grossWeightQuintals} Qtl</div>
                <span className="text-[10px] text-slate-500">Tractor + Crop</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                  <Scale className="w-3 h-3 text-slate-500" /> Tare Weight
                </span>
                <div className="text-base font-black text-slate-900">{activeRecord.tareWeightQuintals} Qtl</div>
                <span className="text-[10px] text-slate-500">Empty Tractor</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 sm:col-span-1 col-span-2">
                <span className="text-[10px] text-emerald-800 font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Net Procured Crop
                </span>
                <div className="text-lg font-black text-emerald-900">{activeRecord.netWeightQuintals} Quintal</div>
                <span className="text-[10px] text-emerald-700 font-semibold">Wheat (गेहूं)</span>
              </div>
            </div>

            {/* Quality & Laboratory Report */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-sky-600" /> Mandi Grain Quality Lab Analysis
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400 text-[10px]">Moisture Level:</span>
                  <strong className="block text-slate-800 font-bold">{activeRecord.moisturePercent}% (Standard: 12.0%)</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Foreign Matter:</span>
                  <strong className="block text-slate-800 font-bold">{activeRecord.foreignMatterPercent}% (Passed)</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Assigned Grade:</span>
                  <strong className="block text-emerald-700 font-bold">{activeRecord.qualityGrade}</strong>
                </div>
              </div>
            </div>

            {/* Financial MSP Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Procured Quantity:</span>
                <strong className="text-slate-900">{activeRecord.netWeightQuintals} Quintal</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Government MSP Rate:</span>
                <strong className="text-slate-900">₹{activeRecord.agreedRatePerQuintal} / Quintal</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Moisture / Quality Deduction:</span>
                <strong className="text-emerald-700">₹0.00 (Zero deduction)</strong>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Net Payable Payout:</span>
                <span className="text-xl text-agri-700 font-mono">
                  ₹{activeRecord.netPayableAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Verified by Mandi Secretary: {activeRecord.verifiedByOfficer}
            </div>
          </div>

          {/* Direct Bank Transfer (DBT) Tracker (1 col) */}
          <div className="card p-6 bg-slate-900 text-white border border-slate-800 shadow-xl rounded-3xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CreditCard className="w-4 h-4" />
                <span>DBT PFMS Transfer Hub</span>
              </div>

              <h3 className="text-xl font-bold text-white">Payment Status</h3>

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Payment Pending (PFMS Queue)</span>
                </div>
                <p className="text-[11px] text-amber-200/80">
                  Government fund release scheduled within 24-48 hours directly into bank account.
                </p>
              </div>

              {/* Bank Details */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Beneficiary Name:</span>
                  <strong className="text-white">Ramesh Kumar</strong>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Bank Name:</span>
                  <strong className="text-white">State Bank of India</strong>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Account Number:</span>
                  <strong className="text-white font-mono">XXXX-XXXX-4819</strong>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>PFMS Ref ID:</span>
                  <strong className="text-emerald-400 font-mono text-[11px]">
                    {activeRecord.paymentRecord?.paymentRefNumber || 'DBT-PFMS-HR-2026-89412'}
                  </strong>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Net Amount:</span>
                  <strong className="text-lg font-black text-white font-mono">
                    ₹{activeRecord.netPayableAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Direct Benefit Transfer directly linked to Aadhaar without intermediary cuts.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
