import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

/**
 * Get Available Slots for a Center & Date
 */
router.get('/available', async (req: Request, res: Response) => {
  try {
    const { centerId, cropId, date = '2026-09-15' } = req.query;

    if (!centerId) {
      return res.status(400).json({ success: false, message: 'Center ID is required' });
    }

    const center = await prisma.procurementCenter.findUnique({
      where: { id: String(centerId) },
      include: {
        state: { include: { config: true } },
      },
    });

    if (!center) {
      return res.status(404).json({ success: false, message: 'Center not found' });
    }

    let slots = await prisma.slot.findMany({
      where: {
        centerId: String(centerId),
        ...(cropId && { cropId: String(cropId) }),
        date: String(date),
      },
      include: { crop: true },
      orderBy: { startTime: 'asc' },
    });

    // If no slots exist for requested date, dynamically generate based on StateConfig slot duration
    if (slots.length === 0) {
      const slotDuration = center.state.config?.slotDurationMinutes || 60;
      const targetCropId = cropId ? String(cropId) : 'crop-wheat';

      const timeWindows =
        slotDuration === 30
          ? [
              { start: '08:00 AM', end: '08:30 AM', max: 15, booked: 15, status: 'FULL' },
              { start: '08:30 AM', end: '09:00 AM', max: 15, booked: 10, status: 'FEW_SLOTS' },
              { start: '09:00 AM', end: '09:30 AM', max: 15, booked: 4, status: 'AVAILABLE' },
              { start: '09:30 AM', end: '10:00 AM', max: 15, booked: 2, status: 'AVAILABLE' },
              { start: '10:00 AM', end: '10:30 AM', max: 15, booked: 1, status: 'AVAILABLE' },
              { start: '10:30 AM', end: '11:00 AM', max: 15, booked: 5, status: 'AVAILABLE' },
              { start: '11:00 AM', end: '11:30 AM', max: 15, booked: 8, status: 'AVAILABLE' },
              { start: '11:30 AM', end: '12:00 PM', max: 15, booked: 12, status: 'FEW_SLOTS' },
              { start: '02:00 PM', end: '02:30 PM', max: 15, booked: 3, status: 'AVAILABLE' },
              { start: '02:30 PM', end: '03:00 PM', max: 15, booked: 0, status: 'AVAILABLE' },
            ]
          : [
              { start: '08:00 AM', end: '09:00 AM', max: 25, booked: 25, status: 'FULL' },
              { start: '09:00 AM', end: '10:00 AM', max: 25, booked: 18, status: 'FEW_SLOTS' },
              { start: '10:00 AM', end: '11:00 AM', max: 30, booked: 7, status: 'AVAILABLE' },
              { start: '11:00 AM', end: '12:00 PM', max: 25, booked: 22, status: 'FEW_SLOTS' },
              { start: '12:00 PM', end: '01:00 PM', max: 25, booked: 9, status: 'AVAILABLE' },
              { start: '02:00 PM', end: '03:00 PM', max: 25, booked: 6, status: 'AVAILABLE' },
              { start: '03:00 PM', end: '04:00 PM', max: 25, booked: 4, status: 'AVAILABLE' },
              { start: '04:00 PM', end: '05:00 PM', max: 20, booked: 1, status: 'AVAILABLE' },
            ];

      for (const tw of timeWindows) {
        await prisma.slot.create({
          data: {
            centerId: String(centerId),
            cropId: targetCropId,
            date: String(date),
            startTime: tw.start,
            endTime: tw.end,
            maxFarmers: tw.max,
            bookedFarmers: tw.booked,
            status: tw.status,
            capacityQuintals: tw.max * 40,
          },
        });
      }

      slots = await prisma.slot.findMany({
        where: {
          centerId: String(centerId),
          cropId: targetCropId,
          date: String(date),
        },
        include: { crop: true },
        orderBy: { startTime: 'asc' },
      });
    }

    return res.json({
      success: true,
      center: {
        id: center.id,
        name: center.name,
        hindiName: center.hindiName,
        code: center.code,
        slotDurationMinutes: center.state.config?.slotDurationMinutes || 60,
      },
      slots,
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Book Procurement Slot & Generate Digital Token
 */
router.post('/book', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { slotId, centerId, cropId, quantityQuintals, vehicleNumber, vehicleType = 'Tractor-Trolley' } = req.body;

    if (!slotId || !centerId || !cropId || !quantityQuintals) {
      return res.status(400).json({ success: false, message: 'Missing booking parameters' });
    }

    // Find farmer profile
    let farmer = await prisma.farmer.findFirst({
      where: { userId },
      include: { state: true, district: true },
    });

    if (!farmer) {
      // Create lightweight farmer profile if registering on the fly
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const randomFId = `FARM-HR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      farmer = await prisma.farmer.create({
        data: {
          userId: userId!,
          farmerId: randomFId,
          fullName: user?.name || 'Farmer User',
          phone: user?.phone || '9876543210',
          stateId: user?.stateId || 'state-hr',
          districtId: user?.districtId || 'dist-hr-sonipat',
          village: 'Demo Village',
          totalLandAcres: 5.0,
          accountNumberMasked: 'XXXX-XXXX-4819',
          isVerified: true,
        },
        include: { state: true, district: true },
      });
    }

    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
      include: { crop: true, center: true },
    });

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Selected slot not found' });
    }

    if (slot.bookedFarmers >= slot.maxFarmers) {
      return res.status(400).json({ success: false, message: 'Selected slot is already full. Please choose another slot.' });
    }

    // Generate Token Code (e.g. WHT-4921)
    const cropPrefix = slot.crop.name.slice(0, 3).toUpperCase();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const tokenCode = `${cropPrefix}-${randomCode}`;

    // Generate queue token number (e.g. #218)
    const queueNumber = `#${Math.floor(200 + Math.random() * 80)}`;

    const qrPayload = JSON.stringify({
      token: tokenCode,
      queueNumber,
      farmerId: farmer.farmerId,
      farmerName: farmer.fullName,
      crop: slot.crop.name,
      quantity: quantityQuintals,
      center: slot.center.name,
      date: slot.date,
      time: `${slot.startTime} - ${slot.endTime}`,
      vehicle: vehicleNumber || 'HR-10-AT-7821',
    });

    // Create Booking
    const booking = await prisma.booking.create({
      data: {
        bookingToken: tokenCode,
        qrCodeData: qrPayload,
        farmerId: farmer.id,
        centerId: slot.centerId,
        slotId: slot.id,
        cropId: slot.cropId,
        bookedQuantityQuintals: parseFloat(quantityQuintals),
        vehicleNumber: vehicleNumber || 'HR-10-AT-7821',
        vehicleType,
        status: 'BOOKED',
        scheduledDate: slot.date,
        scheduledTime: `${slot.startTime} - ${slot.endTime}`,
      },
      include: {
        farmer: true,
        center: true,
        crop: true,
        slot: true,
      },
    });

    // Increment slot booked count
    const updatedBooked = slot.bookedFarmers + 1;
    let slotStatus = slot.status;
    if (updatedBooked >= slot.maxFarmers) slotStatus = 'FULL';
    else if (updatedBooked >= slot.maxFarmers * 0.7) slotStatus = 'FEW_SLOTS';

    await prisma.slot.update({
      where: { id: slot.id },
      data: { bookedFarmers: updatedBooked, status: slotStatus },
    });

    // Create Queue Entry
    const queueEntry = await prisma.queueEntry.create({
      data: {
        centerId: slot.centerId,
        bookingId: booking.id,
        tokenNumber: queueNumber,
        queuePosition: 18 + Math.floor(Math.random() * 10),
        stage: 'WAITING',
        gateNumber: 'Gate 1',
        estimatedCallTime: slot.startTime,
      },
    });

    // Multi-Channel Notifications
    await prisma.notification.create({
      data: {
        userId,
        farmerId: farmer.id,
        title: 'Procurement Slot Confirmed!',
        titleHi: 'खरीद स्लॉट सफलतापूर्वक बुक हुआ!',
        message: `Your booking ${tokenCode} for ${quantityQuintals} Qtl ${slot.crop.name} is confirmed at ${slot.center.name} on ${slot.date} (${slot.startTime} - ${slot.endTime}). Queue Token: ${queueNumber}.`,
        messageHi: `आपका बुकिंग टोकन ${tokenCode} (${quantityQuintals} क्विंटल ${slot.crop.hindiName}) ${slot.center.hindiName} पर ${slot.date} (${slot.startTime} - ${slot.endTime}) के लिए कन्फर्म है। कतार टोकन: ${queueNumber}।`,
        channel: 'WHATSAPP',
        type: 'SLOT_CONFIRMATION',
      },
    });

    await prisma.notification.create({
      data: {
        userId,
        farmerId: farmer.id,
        title: 'SMS Sent: Booking Token Generated',
        titleHi: 'एसएमएस भेजा गया: बुकिंग टोकन जनरेट हुआ',
        message: `[KisanSetu SMS] Slot confirmed for token ${tokenCode}. Please bring original Aadhaar & Bank Passbook.`,
        messageHi: `[किसानसेतु एसएमएस] टोकन ${tokenCode} के लिए स्लॉट कन्फर्म हुआ। कृपया मूल आधार और बैंक पासबुक साथ लाएं।`,
        channel: 'SMS',
        type: 'SLOT_CONFIRMATION',
      },
    });

    return res.json({
      success: true,
      message: 'Slot booked successfully!',
      booking: {
        ...booking,
        queueEntry,
      },
    });
  } catch (error) {
    console.error('Error booking slot:', error);
    return res.status(500).json({ success: false, message: 'Booking failed. Please try again.' });
  }
});

/**
 * Get Booking & QR Token Details by Token Code
 */
router.get('/token/:tokenCode', async (req: Request, res: Response) => {
  try {
    const { tokenCode } = req.params;
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { bookingToken: tokenCode.toUpperCase() },
          { id: tokenCode },
        ],
      },
      include: {
        farmer: { include: { state: true, district: true } },
        center: { include: { state: true, district: true } },
        crop: true,
        slot: true,
        queueEntry: true,
        procurementRecord: { include: { paymentRecord: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking token not found' });
    }

    return res.json({ success: true, booking });
  } catch (error) {
    console.error('Error fetching token:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
