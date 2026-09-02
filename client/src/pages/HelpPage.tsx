import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  HelpCircle,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      qEn: 'How does KisanSetu eliminate long waiting queues at procurement centers?',
      qHi: 'किसानसेतु खरीद केंद्रों पर लंबी प्रतीक्षा कतारों को कैसे समाप्त करता है?',
      aEn: 'KisanSetu dynamically calculates mandi processing capacities and allocates scheduled 30 or 60-minute time slots. Farmers receive a Digital QR E-Gate Pass and live queue alerts, ensuring they arrive only when their turn approaches rather than spending 8-12 hours in lines.',
      aHi: 'किसानसेतु मंडी प्रसंस्करण क्षमता के अनुसार 30 या 60 मिनट के स्लॉट आवंटित करता है। किसानों को डिजिटल क्यूआर ई-गेट पास और लाइव कतार अलर्ट मिलते हैं, जिससे वे अपनी बारी आने पर ही मंडी पहुंचते हैं।',
    },
    {
      qEn: 'Why do different states have different slot durations or document requirements?',
      qHi: 'विभिन्न राज्यों में अलग-अलग स्लॉट अवधि या दस्तावेज़ की आवश्यकता क्यों होती है?',
      aEn: 'India\'s states operate under distinct agricultural procurement regimes (e.g. Haryana centralized Meri Fasal Mera Byora vs MP e-Uparjan vs Maharashtra APMC). KisanSetu features a dynamic State Configuration Engine that configures state-specific rules on the backend without changing the farmer\'s simple unified UI.',
      aHi: 'भारत के विभिन्न राज्यों में अलग-अलग खरीद व्यवस्थाएं हैं। किसानसेतु में एक डायनामिक स्टेट कॉन्फ़िगरेशन इंजन है जो राज्य-विशिष्ट नियमों को बैकएंड पर प्रबंधित करता है, जबकि किसान को एक सरल और एकसमान मंच मिलता है।',
    },
    {
      qEn: 'How does the Smart Slot Recommendation Algorithm work?',
      qHi: 'स्मार्ट स्लॉट अनुशंसा (Recommendation) कैसे काम करती है?',
      aEn: 'The recommendation engine calculates a deterministic score based on distance from the farmer, active queue congestion, predicted gate waiting time, and remaining slot quota to direct farmers to the optimal nearby mandi.',
      aHi: 'सिस्टम किसान की दूरी, वर्तमान मंडी भीड़, अनुमानित प्रतीक्षा समय और उपलब्ध स्लॉट के आधार पर न्यूनतम समय वाले सर्वोत्तम खरीद केंद्र का सुझाव देता है।',
    },
    {
      qEn: 'How is payment processed after crop procurement?',
      qHi: 'फसल खरीद के बाद भुगतान कैसे किया जाता है?',
      aEn: 'Upon electronic weighbridge recording and quality moisture lab clearance, a Digital J-Form receipt is automatically issued, and payment is credited directly into the farmer\'s verified bank account via DBT (PFMS / Aadhaar Payment Bridge).',
      aHi: 'सटीक वजन और प्रयोगशाला में नमी जांच पास होने पर डिजिटल जे-फॉर्म जारी होता है और डीबीटी (PFMS) द्वारा सीधे किसान के बैंक खाते में न्यूनतम समर्थन मूल्य (MSP) भेजा जाता है।',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Support & System Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'सहायता केंद्र एवं अक्सर पूछे जाने वाले सवाल' : 'Farmer Support & SIH 2026 Reference'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {language === 'hi'
            ? 'किसानसेतु प्लेटफॉर्म, स्लॉट शेड्यूलिंग, लाइव कतार ट्रैकिंग और भुगतान प्रणाली के बारे में पूरी जानकारी।'
            : 'Comprehensive guidance on slot scheduling, live queue tracking, multi-channel notifications, and DBT payouts.'}
        </p>
      </div>

      {/* 24x7 Multi-lingual Helpline Card */}
      <div className="card p-6 sm:p-8 bg-gradient-to-br from-agri-900 via-agri-800 to-emerald-950 text-white border border-emerald-500/20 shadow-xl rounded-3xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <PhoneCall className="w-4 h-4" />
            <span>Kisan Call Center • Toll-Free National Support</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">1800-180-1551</h2>
          <p className="text-xs text-emerald-100/80">
            Available 24x7 in 11 Indian Languages (Hindi, English, Punjabi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Odia).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:18001801551"
            className="btn-accent py-3 px-6 text-xs font-bold flex items-center gap-2 shadow-lg shadow-harvest-600/30"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Helpline Simulator</span>
          </a>
        </div>
      </div>

      {/* SIH 2026 Core Product Idea Architecture Callout */}
      <div className="card p-6 sm:p-8 bg-white border-2 border-agri-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-agri-800 font-bold text-xs uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-agri-700" />
          <span>SIH 2026 Problem Statement ID: 26032 Architecture</span>
        </div>
        <h3 className="text-lg font-black text-slate-900">
          Why KisanSetu Uses a Single Unified Platform with State Configuration Engine
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Instead of creating 28+ disconnected state portals that confuse migrating farmers and duplicate infrastructure costs, KisanSetu provides a <strong>common, clean frontend</strong> connected to a <strong>dynamic State Configuration Engine</strong>. Each state controls its procurement rules, slot windows, crops, and notifications while the farmer enjoys one simple, accessible platform.
        </p>

        {/* Architecture flow badge */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-700 text-center font-bold">
          COMMON FRONTEND &nbsp; → &nbsp; STATE CONFIGURATION ENGINE &nbsp; → &nbsp; STATE / DISTRICT / MANDI DATA
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          {language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल (FAQ)' : 'Frequently Asked Questions (FAQ)'}
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="card p-0 bg-white border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{language === 'hi' ? faq.qHi : faq.qEn}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-agri-700 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {language === 'hi' ? faq.aHi : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
