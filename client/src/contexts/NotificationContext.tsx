import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

export interface NotificationItem {
  id: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  channel: 'SMS' | 'WHATSAPP' | 'PUSH' | 'APP';
  type: string;
  isRead: boolean;
  sentAt: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  markAsRead: (id: string) => Promise<void>;
  triggerMockNotification: (channel?: 'SMS' | 'WHATSAPP' | 'PUSH' | 'APP', msg?: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const refreshNotifications = async () => {
    try {
      if (!user) return;
      const res = await api.getNotifications();
      if (res.success && res.notifications) {
        setNotifications(res.notifications as NotificationItem[]);
      }
    } catch (error) {
      console.warn('Could not fetch notifications:', error);
    }
  };

  useEffect(() => {
    if (user) {
      refreshNotifications();
      const interval = setInterval(refreshNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const triggerMockNotification = async (channel: 'SMS' | 'WHATSAPP' | 'PUSH' | 'APP' = 'WHATSAPP', msg?: string) => {
    try {
      const res = await api.triggerMockNotification({
        channel,
        title: `Live Update via ${channel}`,
        titleHi: `${channel} द्वारा लाइव अपडेट`,
        message: msg || `Your queue token #207 is progressing. 12 farmers remaining.`,
        messageHi: msg || `आपका कतार टोकन #207 आगे बढ़ रहा है। केवल 12 किसान शेष हैं।`,
      });
      if (res.success) {
        await refreshNotifications();
        setIsDrawerOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isDrawerOpen,
        setIsDrawerOpen,
        markAsRead,
        triggerMockNotification,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
