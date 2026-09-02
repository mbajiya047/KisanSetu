import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Sprout, PhoneCall, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & SIH */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {language === 'hi' ? 'किसान' : 'Kisan'}<span className="text-harvest-400">{language === 'hi' ? 'सेतु' : 'Setu'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.brandTagline}. {language === 'hi' ? 'किसानों के समय की बचत और पारदर्शी खरीद व्यवस्था।' : 'Eliminating mandi congestion, long queues, and procurement delays.'}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SIH 2026 • Problem Statement ID 26032</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {language === 'hi' ? 'त्वरित लिंक' : 'Quick Actions'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/farmer/book-slot" className="hover:text-emerald-400 transition-colors">
                  {t.actionBookSlot}
                </Link>
              </li>
              <li>
                <Link to="/farmer/queue" className="hover:text-emerald-400 transition-colors">
                  {t.actionTrackToken}
                </Link>
              </li>
              <li>
                <Link to="/mandi-status" className="hover:text-emerald-400 transition-colors">
                  {t.actionMandiStatus}
                </Link>
              </li>
              <li>
                <Link to="/states" className="hover:text-emerald-400 transition-colors">
                  {language === 'hi' ? 'राज्यवार खरीद नियम' : 'India State Rules Engine'}
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-emerald-400 transition-colors">
                  {t.navHelp}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Supported States */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {language === 'hi' ? 'प्रमुख राज्य' : 'Integrated States'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <span className="hover:text-white transition-colors cursor-pointer">Haryana (हरियाणा)</span>
              <span className="hover:text-white transition-colors cursor-pointer">Punjab (पंजाब)</span>
              <span className="hover:text-white transition-colors cursor-pointer">Uttar Pradesh (यूपी)</span>
              <span className="hover:text-white transition-colors cursor-pointer">Madhya Pradesh (एमपी)</span>
              <span className="hover:text-white transition-colors cursor-pointer">Rajasthan (राजस्थान)</span>
              <span className="hover:text-white transition-colors cursor-pointer">Maharashtra (महाराष्ट्र)</span>
              <span className="hover:text-white transition-colors cursor-pointer">Gujarat (गुजरात)</span>
              <span className="hover:text-white transition-colors cursor-pointer">Karnataka (कर्नाटक)</span>
            </div>
          </div>

          {/* Col 4: Farmer Helpline */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">
              {language === 'hi' ? 'किसान सहायता केंद्र' : 'Kisan Support Desk'}
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Toll-Free National Helpline</span>
              </div>
              <div className="text-lg font-bold text-white tracking-wide">1800-180-1551</div>
              <p className="text-[10px] text-slate-400 mt-1">24x7 Multi-lingual Farmer Assistance</p>
            </div>
            <p className="text-[11px] text-slate-500">
              {language === 'hi' ? 'डिजिटल भारत एवं कृषि मंत्रालय के दिशा-निर्देशों के अनुरूप।' : 'Built for digital public infrastructure in agriculture.'}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 KisanSetu Platform. Smart India Hackathon 2026 Entry.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" /> for Indian Farmers
            </span>
            <span>•</span>
            <span className="text-slate-400">Strict Privacy & Zero Data Harvesting</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
