import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import {
  Building,
  Search,
  MapPin,
  Clock,
  Users,
  Calendar,
  Filter,
  CheckCircle2,
  Phone,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export const CentersPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [centers, setCenters] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string>(searchParams.get('stateId') || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.getStates();
        if (res.success && res.states) {
          setStates(res.states);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStates();
  }, []);

  const loadCenters = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCenters({
        stateId: selectedStateId || undefined,
        search: searchQuery || undefined,
      });
      if (res.success && res.centers) {
        setCenters(res.centers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCenters();
  }, [selectedStateId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCenters();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-bold">
          <Building className="w-3.5 h-3.5" />
          <span>{t.navCenters}</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'अनाज मंडी एवं खरीद केंद्र' : 'Agricultural Procurement Centers'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {language === 'hi'
            ? 'अपने निकटतम खरीद केंद्र खोजें, लाइव कतार का अनुमान लगाएं और तत्काल ई-टोकन स्लॉट बुक करें।'
            : 'Locate certified mandis across India with real-time queue lengths, gate wait times, and direct slot booking.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-5 bg-white border border-slate-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'मंडी का नाम या शहर खोजें...' : 'Search center name or location...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedStateId}
              onChange={(e) => setSelectedStateId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-600 focus:outline-none"
            >
              <option value="">{language === 'hi' ? 'सभी राज्य (All States)' : 'All States'}</option>
              {states.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.hindiName})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary text-xs py-2.5 font-bold flex items-center justify-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'फ़िल्टर लागू करें' : 'Apply Filters'}</span>
          </button>
        </form>
      </div>

      {/* Centers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {centers.map((center) => (
          <div
            key={center.id}
            className="card p-6 bg-white border border-slate-200 hover:border-agri-600 hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{center.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{center.hindiName}</p>
                </div>
                <span className="badge-success text-[10px] font-bold">
                  {center.queueStatus || 'LOW QUEUE'}
                </span>
              </div>

              <p className="text-xs text-slate-600 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-agri-600 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{center.address}</span>
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" /> {t.estimatedWait}
                  </span>
                  <strong className="text-sm text-slate-800 font-bold">{center.currentWaitMinutes || 35} min</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                    <Users className="w-3 h-3 text-agri-600" /> {t.currentQueue}
                  </span>
                  <strong className="text-sm text-slate-800 font-bold">{center.currentQueue || 24} {t.farmers}</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-agri-600" /> Available Slots
                  </span>
                  <strong className="text-sm text-emerald-700 font-bold">{center.availableSlotsCount || 27}</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                    <Shield className="w-3 h-3 text-agri-600" /> Gates
                  </span>
                  <strong className="text-sm text-slate-800 font-bold">{center.activeGates || 3} Active</strong>
                </div>
              </div>

              {/* Officer & Timing */}
              <div className="text-[11px] text-slate-500 space-y-1">
                <p>Officer: <strong className="text-slate-700">{center.officerInCharge}</strong></p>
                <p>Hours: <span className="font-mono text-slate-700">{center.openTime} - {center.closeTime}</span></p>
              </div>
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-slate-100">
              <Link
                to={`/farmer/book-slot?centerId=${center.id}`}
                className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span>{t.btnViewSlots}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
