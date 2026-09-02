import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

/**
 * Get Notifications for Current User
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { userId },
          { farmer: { userId } },
        ],
      },
      orderBy: { sentAt: 'desc' },
      take: 20,
    });

    return res.json({
      success: true,
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Mark Notification as Read
 */
router.put('/:id/read', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return res.json({ success: true, updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Mock Notification Trigger Engine (SMS, WhatsApp, Push, In-App)
 */
router.post('/mock-send', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { title, titleHi, message, messageHi, channel = 'WHATSAPP', type = 'QUEUE_ALERT' } = req.body;

    const notification = await prisma.notification.create({
      data: {
        userId,
        title: title || 'Mandi Arrival Alert',
        titleHi: titleHi || 'मंडी आगमन अलर्ट',
        message: message || 'Please reach the procurement center 15 minutes before your slot time.',
        messageHi: messageHi || 'कृपया अपने स्लॉट समय से 15 मिनट पहले खरीद केंद्र पर पहुंचें।',
        channel,
        type,
      },
    });

    return res.json({
      success: true,
      message: `Mock ${channel} notification dispatched successfully!`,
      notification,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
