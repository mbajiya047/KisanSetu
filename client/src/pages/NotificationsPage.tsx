import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Bell,
  MessageSquare,
  Smartphone,
  Info,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, triggerMockNotification } = useNotifications();
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState('ALL');

  const filtered = notifications.filter(
    (n) => filter === 'ALL' || n.channel === filter
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-bold">
            <Bell className="w-3.5 h-3.5" />
            <span>Multi-Channel Communication Engine</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'किसान सूचना केंद्र' : 'Farmer Notification Center'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi'
              ? 'स्लॉट पुष्टि, कतार आगमन चेतावनी, नमी जांच परिणाम और बैंक भुगतान सूचनाएं।'
              : 'Real-time multi-channel alerts delivered via SMS, WhatsApp, Push Notifications & App.'}
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="card p-4 bg-white border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto">
        {['ALL', 'WHATSAPP', 'SMS', 'PUSH', 'APP'].map((ch) => (
          <button
            key={ch}
            onClick={() => setFilter(ch)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filter === ch
                ? 'bg-agri-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center bg-white border border-slate-200 text-slate-400">
            <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-medium">No notifications in this channel</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && markAsRead(n.id)}
              className={`card p-5 border transition-all cursor-pointer ${
                n.isRead
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-emerald-50/50 border-emerald-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    n.channel === 'WHATSAPP'
                      ? 'bg-emerald-100 text-emerald-800'
                      : n.channel === 'SMS'
                      ? 'bg-blue-100 text-blue-800'
                      : n.channel === 'PUSH'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {n.channel}
                </span>

                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-2.5 h-2.5" />
                  {new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 mb-1">
                {language === 'hi' ? n.titleHi || n.title : n.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? n.messageHi || n.message : n.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
