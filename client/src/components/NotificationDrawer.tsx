import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import type { NotificationItem } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  X,
  Bell,
  MessageSquare,
  Smartphone,
  CheckCheck,
  Send,
  Sparkles,
  Info,
  Clock,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { notifications, unreadCount, isDrawerOpen, setIsDrawerOpen, markAsRead, triggerMockNotification } = useNotifications();
  const { language } = useLanguage();
  const [filterChannel, setFilterChannel] = useState<string>('ALL');
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isDrawerOpen) return null;

  const filtered = notifications.filter(
    (n) => filterChannel === 'ALL' || n.channel === filterChannel
  );

  const handleSimulate = async (channel: 'SMS' | 'WHATSAPP' | 'PUSH' | 'APP', msg: string, msgHi: string) => {
    setIsSimulating(true);
    await triggerMockNotification(channel, language === 'hi' ? msgHi : msg);
    setIsSimulating(false);
  };

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case 'WHATSAPP':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <MessageSquare className="w-2.5 h-2.5" /> WhatsApp
          </span>
        );
      case 'SMS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Smartphone className="w-2.5 h-2.5" /> SMS
          </span>
        );
      case 'PUSH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Bell className="w-2.5 h-2.5" /> Push Alert
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <Info className="w-2.5 h-2.5" /> In-App
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-agri-700 text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {language === 'hi' ? 'सूचना केंद्र' : 'Notification Hub'}
              </h3>
              <p className="text-xs text-slate-500">
                {unreadCount} {language === 'hi' ? 'अपठित सूचनाएं' : 'unread notifications'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Filter Pills */}
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto bg-white">
          {['ALL', 'WHATSAPP', 'SMS', 'PUSH', 'APP'].map((ch) => (
            <button
              key={ch}
              onClick={() => setFilterChannel(ch)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterChannel === ch
                  ? 'bg-agri-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-medium">No notifications for this channel</p>
            </div>
          ) : (
            filtered.map((n: NotificationItem) => (
              <div
                key={n.id}
                onClick={() => !n.isRead && markAsRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  n.isRead
                    ? 'bg-white border-slate-200 text-slate-700'
                    : 'bg-emerald-50/50 border-emerald-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  {getChannelBadge(n.channel)}
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 mb-1">
                  {language === 'hi' ? n.titleHi || n.title : n.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi' ? n.messageHi || n.message : n.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Mock Simulator Controls for Presentation */}
        <div className="p-4 bg-slate-900 text-white border-t border-slate-800 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'लाइव सिमुलेटर (परीक्षण हेतु)' : 'Live Notification Simulator'}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              disabled={isSimulating}
              onClick={() =>
                handleSimulate(
                  'WHATSAPP',
                  'Turn approaching! 3 farmers ahead. Please move tractor to Gate 2.',
                  'आपकी बारी आने वाली है! आगे 3 किसान हैं। ट्रैक्टर को गेट 2 पर लाएं।'
                )
              }
              className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-medium text-left truncate flex items-center gap-1"
            >
              <Send className="w-3 h-3 flex-shrink-0" />
              <span>Simulate WhatsApp Alert</span>
            </button>

            <button
              disabled={isSimulating}
              onClick={() =>
                handleSimulate(
                  'SMS',
                  'Quality passed: Grade A (11.2% moisture). MSP ₹2,275 approved.',
                  'गुणवत्ता पास: ग्रेड ए (11.2% नमी)। ₹2,275 एमएसपी स्वीकृत।'
                )
              }
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-left truncate flex items-center gap-1"
            >
              <Send className="w-3 h-3 flex-shrink-0" />
              <span>Simulate SMS Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
