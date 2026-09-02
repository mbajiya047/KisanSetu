import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

/**
 * Get Farmer Procurement Records & Status
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const farmer = await prisma.farmer.findFirst({ where: { userId } });

    if (!farmer) {
      return res.json({ success: true, records: [] });
    }

    const records = await prisma.procurementRecord.findMany({
      where: {
        booking: { farmerId: farmer.id },
      },
      include: {
        booking: {
          include: {
            crop: true,
            center: { include: { state: true, district: true } },
          },
        },
        paymentRecord: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, records });
  } catch (error) {
    console.error('Error fetching procurement records:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Get Specific Procurement Record Details / J-Form
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await prisma.procurementRecord.findFirst({
      where: {
        OR: [
          { id },
          { bookingId: id },
          { jFormNumber: id.toUpperCase() },
        ],
      },
      include: {
        booking: {
          include: {
            farmer: { include: { state: true, district: true } },
            crop: true,
            center: { include: { state: true, district: true } },
          },
        },
        paymentRecord: true,
      },
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Procurement record not found' });
    }

    return res.json({ success: true, record });
  } catch (error) {
    console.error('Error fetching procurement record:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Mandi Officer: Record Weighing & Quality Entry to Generate J-Form
 */
router.post('/record-entry', authenticateToken, authorizeRoles('MANDI_OFFICER', 'DISTRICT_ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const {
      bookingId,
      grossWeightQuintals,
      tareWeightQuintals,
      moisturePercent = 11.2,
      foreignMatterPercent = 0.4,
      qualityGrade = 'GRADE_A',
    } = req.body;

    if (!bookingId || !grossWeightQuintals || !tareWeightQuintals) {
      return res.status(400).json({ success: false, message: 'Gross weight and Tare weight are required' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { crop: true, farmer: true, center: { include: { state: true } } },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const netWeight = parseFloat(grossWeightQuintals) - parseFloat(tareWeightQuintals);
    const mspRate = booking.crop.mspRatePerQuintal;
    const grossAmount = netWeight * mspRate;

    // Moisture penalty if above standard
    let deduction = 0;
    const standardMoisture = booking.crop.moistureStandardPercent;
    if (parseFloat(moisturePercent) > standardMoisture) {
      const excessMoisture = parseFloat(moisturePercent) - standardMoisture;
      deduction = (excessMoisture * 0.01) * grossAmount;
    }
    const netPayable = grossAmount - deduction;

    const jFormNumber = `J-${booking.center.state.code}-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const procurementRecord = await prisma.procurementRecord.create({
      data: {
        bookingId: booking.id,
        grossWeightQuintals: parseFloat(grossWeightQuintals),
        tareWeightQuintals: parseFloat(tareWeightQuintals),
        netWeightQuintals: netWeight,
        moisturePercent: parseFloat(moisturePercent),
        foreignMatterPercent: parseFloat(foreignMatterPercent),
        qualityGrade,
        agreedRatePerQuintal: mspRate,
        grossAmount,
        deductionAmount: deduction,
        netPayableAmount: netPayable,
        jFormNumber,
        verifiedByOfficer: req.user?.name || 'Mandi Secretary',
      },
    });

    // Auto-create DBT payment record
    const paymentRecord = await prisma.paymentRecord.create({
      data: {
        procurementId: procurementRecord.id,
        paymentRefNumber: `DBT-PFMS-${booking.center.state.code}-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        amount: netPayable,
        status: 'INITIATED',
        mode: 'DBT_PFMS',
        bankAccountMasked: booking.farmer.accountNumberMasked || 'XXXX-XXXX-4819',
        ifscCode: booking.farmer.ifscCode || 'SBIN0001482',
        initiatedAt: new Date(),
      },
    });

    // Advance booking & queue to completed
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'COMPLETED' },
    });

    await prisma.queueEntry.updateMany({
      where: { bookingId: booking.id },
      data: { stage: 'COMPLETED', completedTime: new Date() },
    });

    // Send Notification
    await prisma.notification.create({
      data: {
        userId: booking.farmer.userId,
        farmerId: booking.farmer.id,
        title: `Procurement Done: J-Form ${jFormNumber}`,
        titleHi: `खरीद संपन्न: जे-फॉर्म ${jFormNumber}`,
        message: `Your ${netWeight} Qtl ${booking.crop.name} has been procured. Total Payout: ₹${netPayable.toLocaleString('en-IN')}. DBT Transfer initiated.`,
        messageHi: `आपका ${netWeight} क्विंटल ${booking.crop.hindiName} खरीद लिया गया है। कुल भुगतान: ₹${netPayable.toLocaleString('en-IN')}। डीबीटी ट्रांसफर शुरू हो गया है।`,
        channel: 'WHATSAPP',
        type: 'QUALITY_PASSED',
      },
    });

    return res.json({
      success: true,
      message: 'Procurement recorded and Digital J-Form generated!',
      procurementRecord,
      paymentRecord,
    });
  } catch (error) {
    console.error('Error recording procurement:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
