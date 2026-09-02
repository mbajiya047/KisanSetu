import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

/**
 * Get Live Queue for a Procurement Center
 */
router.get('/:centerId', async (req: Request, res: Response) => {
  try {
    const { centerId } = req.params;
    const { tokenNumber } = req.query;

    const center = await prisma.procurementCenter.findUnique({
      where: { id: centerId },
      include: { state: true, district: true },
    });

    if (!center) {
      return res.status(404).json({ success: false, message: 'Center not found' });
    }

    const queueEntries = await prisma.queueEntry.findMany({
      where: { centerId },
      include: {
        booking: {
          include: {
            farmer: true,
            crop: true,
          },
        },
      },
      orderBy: { queuePosition: 'asc' },
    });

    // Find currently serving token
    const servingEntry =
      queueEntries.find((q) => q.stage === 'WEIGHING') ||
      queueEntries.find((q) => q.stage === 'QUALITY_CHECK') ||
      queueEntries.find((q) => q.stage === 'GATE_ENTRY') ||
      queueEntries[0];

    // Compute metrics for specific farmer token if requested
    let farmerQueueInfo = null;
    if (tokenNumber) {
      const myEntry = queueEntries.find((q) => q.tokenNumber === tokenNumber || q.booking?.bookingToken === tokenNumber);
      if (myEntry) {
        const servingPos = servingEntry ? servingEntry.queuePosition : 1;
        const farmersAhead = Math.max(0, myEntry.queuePosition - servingPos);
        const estimatedWaitMinutes = farmersAhead * 2.5 + 5;

        farmerQueueInfo = {
          myToken: myEntry.tokenNumber,
          bookingToken: myEntry.booking.bookingToken,
          farmerName: myEntry.booking.farmer.fullName,
          crop: myEntry.booking.crop.name,
          currentStage: myEntry.stage,
          farmersAhead,
          estimatedWaitMinutes: Math.round(estimatedWaitMinutes),
          gateNumber: myEntry.gateNumber,
        };
      }
    }

    return res.json({
      success: true,
      center: {
        id: center.id,
        name: center.name,
        hindiName: center.hindiName,
        code: center.code,
        activeGates: center.activeGates,
        currentWaitMinutes: center.currentWaitMinutes,
      },
      currentlyServing: servingEntry
        ? {
            tokenNumber: servingEntry.tokenNumber,
            bookingToken: servingEntry.booking.bookingToken,
            stage: servingEntry.stage,
            crop: servingEntry.booking.crop.name,
            gateNumber: servingEntry.gateNumber,
          }
        : { tokenNumber: '#184', bookingToken: 'WHT-2003', stage: 'WEIGHING', crop: 'Wheat', gateNumber: 'Gate 2' },
      totalWaitingCount: queueEntries.filter((q) => q.stage === 'WAITING').length,
      queueEntries: queueEntries.map((q) => ({
        id: q.id,
        tokenNumber: q.tokenNumber,
        bookingToken: q.booking.bookingToken,
        farmerName: q.booking.farmer.fullName,
        cropName: q.booking.crop.name,
        quantity: q.booking.bookedQuantityQuintals,
        vehicleNumber: q.booking.vehicleNumber,
        stage: q.stage,
        queuePosition: q.queuePosition,
        gateNumber: q.gateNumber,
        estimatedCallTime: q.estimatedCallTime,
      })),
      farmerQueueInfo,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching live queue:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Mandi Officer: Call Next Token in Queue
 */
router.post('/call-next', authenticateToken, authorizeRoles('MANDI_OFFICER', 'DISTRICT_ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { centerId } = req.body;
    const targetCenterId = centerId || req.user?.centerId || 'center-sonipat-main';

    // Find next waiting entry
    const nextWaiting = await prisma.queueEntry.findFirst({
      where: { centerId: targetCenterId, stage: 'WAITING' },
      orderBy: { queuePosition: 'asc' },
      include: { booking: { include: { farmer: true, crop: true } } },
    });

    if (!nextWaiting) {
      return res.json({ success: true, message: 'No more waiting farmers in queue.' });
    }

    // Advance to GATE_ENTRY
    const updated = await prisma.queueEntry.update({
      where: { id: nextWaiting.id },
      data: { stage: 'GATE_ENTRY', actualEntryTime: new Date() },
    });

    await prisma.booking.update({
      where: { id: nextWaiting.bookingId },
      data: { status: 'ARRIVED' },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: nextWaiting.booking.farmer.userId,
        farmerId: nextWaiting.booking.farmerId,
        title: `Token ${nextWaiting.tokenNumber}: Called to Gate`,
        titleHi: `टोकन ${nextWaiting.tokenNumber}: गेट पर बुलावा`,
        message: `Your turn has arrived! Please proceed immediately to ${nextWaiting.gateNumber} with your vehicle ${nextWaiting.booking.vehicleNumber || ''}.`,
        messageHi: `आपकी बारी आ गई है! कृपया अपने वाहन ${nextWaiting.booking.vehicleNumber || ''} के साथ तुरंत ${nextWaiting.gateNumber} पर पहुंचें।`,
        channel: 'SMS',
        type: 'TURN_APPROACHING',
      },
    });

    return res.json({
      success: true,
      message: `Called token ${nextWaiting.tokenNumber} to ${nextWaiting.gateNumber}`,
      calledEntry: { ...nextWaiting, stage: 'GATE_ENTRY' },
    });
  } catch (error) {
    console.error('Error calling next token:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Mandi Officer: Update Stage of a Specific Queue Token
 */
router.post('/update-stage', authenticateToken, authorizeRoles('MANDI_OFFICER', 'DISTRICT_ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { queueEntryId, stage, gateNumber } = req.body;

    if (!queueEntryId || !stage) {
      return res.status(400).json({ success: false, message: 'Queue Entry ID and stage required' });
    }

    const queueEntry = await prisma.queueEntry.findUnique({
      where: { id: queueEntryId },
      include: { booking: { include: { farmer: true, crop: true } } },
    });

    if (!queueEntry) {
      return res.status(404).json({ success: false, message: 'Queue entry not found' });
    }

    const updated = await prisma.queueEntry.update({
      where: { id: queueEntryId },
      data: {
        stage,
        ...(gateNumber && { gateNumber }),
        ...(stage === 'COMPLETED' && { completedTime: new Date() }),
      },
    });

    // Also update booking status
    let bookingStatus = 'BOOKED';
    if (stage === 'GATE_ENTRY' || stage === 'ARRIVED') bookingStatus = 'ARRIVED';
    else if (stage === 'WEIGHING') bookingStatus = 'WEIGHING';
    else if (stage === 'QUALITY_CHECK') bookingStatus = 'QUALITY_CHECK';
    else if (stage === 'COMPLETED') bookingStatus = 'COMPLETED';
    else if (stage === 'NO_SHOW') bookingStatus = 'NO_SHOW';

    await prisma.booking.update({
      where: { id: queueEntry.bookingId },
      data: { status: bookingStatus },
    });

    // Notify farmer of stage progress
    let title = `Queue Update: Stage is ${stage}`;
    let titleHi = `कतार अपडेट: नया चरण ${stage}`;
    let msg = `Your token ${queueEntry.tokenNumber} is now at stage: ${stage}.`;
    let msgHi = `आपका टोकन ${queueEntry.tokenNumber} अब चरण: ${stage} पर है।`;

    if (stage === 'WEIGHING') {
      title = 'Weighing in Progress';
      titleHi = 'वजन प्रक्रिया जारी है';
      msg = `Tractor weighing in progress at ${gateNumber || 'Gate 2'}.`;
      msgHi = `गेट 2 पर वाहन का वजन किया जा रहा है।`;
    } else if (stage === 'QUALITY_CHECK') {
      title = 'Quality Inspection in Progress';
      titleHi = 'गुणवत्ता निरीक्षण जारी है';
      msg = `Sample collected for moisture and grain analysis at Mandi Lab.`;
      msgHi = `मंडी प्रयोगशाला में नमी और गुणवत्ता विश्लेषण हेतु नमूना एकत्र किया गया।`;
    } else if (stage === 'COMPLETED') {
      title = 'Procurement Completed Successfully';
      titleHi = 'फसल खरीद सफलतापूर्वक संपन्न';
      msg = `Procurement completed. Digital J-Form generated. Payment will be credited via DBT.`;
      msgHi = `खरीद प्रक्रिया पूरी हुई। डिजिटल जे-फॉर्म जारी किया गया। भुगतान डीबीटी द्वारा भेजा जाएगा।`;
    }

    await prisma.notification.create({
      data: {
        userId: queueEntry.booking.farmer.userId,
        farmerId: queueEntry.booking.farmerId,
        title,
        titleHi,
        message: msg,
        messageHi: msgHi,
        channel: 'PUSH',
        type: 'QUEUE_ALERT',
      },
    });

    return res.json({
      success: true,
      message: `Token ${queueEntry.tokenNumber} stage updated to ${stage}`,
      updated,
    });
  } catch (error) {
    console.error('Error updating queue stage:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Mandi Officer: Pause or Resume Queue
 */
router.post('/pause', authenticateToken, authorizeRoles('MANDI_OFFICER', 'DISTRICT_ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { centerId, isPaused, pauseReason } = req.body;
    const targetCenterId = centerId || req.user?.centerId || 'center-sonipat-main';

    const center = await prisma.procurementCenter.update({
      where: { id: targetCenterId },
      data: { isOperational: !isPaused },
    });

    return res.json({
      success: true,
      message: isPaused
        ? `Queue paused at ${center.name}. Reason: ${pauseReason || 'Weighbridge calibration & lunch break'}`
        : `Queue resumed successfully at ${center.name}.`,
      isOperational: center.isOperational,
    });
  } catch (error) {
    console.error('Error pausing queue:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
