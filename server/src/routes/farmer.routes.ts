import { Router, Response } from 'express';
import { prisma } from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

/**
 * Get Farmer Profile
 */
router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const farmer = await prisma.farmer.findFirst({
      where: { userId },
      include: {
        state: true,
        district: true,
        crops: { include: { crop: true } },
        bookings: {
          include: {
            center: true,
            crop: true,
            slot: true,
            queueEntry: true,
            procurementRecord: { include: { paymentRecord: true } },
          },
          orderBy: { bookedAt: 'desc' },
        },
      },
    });

    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found' });
    }

    return res.json({ success: true, farmer });
  } catch (error) {
    console.error('Error fetching farmer profile:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Complete Farmer Registration (Step 3 of registration flow)
 */
router.post('/register', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User unauthorized' });
    }

    const {
      fullName,
      fatherName,
      stateId,
      districtId,
      village,
      totalLandAcres,
      khasraNumber,
      bankName,
      accountNumber,
      ifscCode,
      cropId,
      cultivatedAreaAcres,
      estimatedYieldQuintals,
      season = 'Rabi 2026',
    } = req.body;

    if (!fullName || !stateId || !districtId || !village || !cropId) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all mandatory fields (Name, State, District, Village, Crop)',
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update user's name & state/district
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: fullName,
        stateId,
        districtId,
      },
    });

    // Generate unique Farmer ID
    const state = await prisma.state.findUnique({ where: { id: stateId } });
    const stateCode = state ? state.code : 'IN';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedFarmerId = `FARM-${stateCode}-2026-${randomSuffix}`;

    const maskedAccount = accountNumber
      ? `XXXX-XXXX-${accountNumber.slice(-4)}`
      : 'XXXX-XXXX-1234';

    // Upsert farmer record
    const existingFarmer = await prisma.farmer.findFirst({ where: { userId } });
    let farmerRecord;

    if (existingFarmer) {
      farmerRecord = await prisma.farmer.update({
        where: { id: existingFarmer.id },
        data: {
          fullName,
          fatherName,
          stateId,
          districtId,
          village,
          totalLandAcres: parseFloat(totalLandAcres) || 0,
          khasraNumber,
          bankName,
          accountNumberMasked: maskedAccount,
          ifscCode,
          isVerified: true,
        },
      });
    } else {
      farmerRecord = await prisma.farmer.create({
        data: {
          userId,
          farmerId: generatedFarmerId,
          fullName,
          fatherName,
          phone: user.phone,
          stateId,
          districtId,
          village,
          totalLandAcres: parseFloat(totalLandAcres) || 0,
          khasraNumber,
          bankName,
          accountNumberMasked: maskedAccount,
          ifscCode,
          isVerified: true,
        },
      });
    }

    // Add / Update crop record
    await prisma.farmerCrop.create({
      data: {
        farmerId: farmerRecord.id,
        cropId,
        cultivatedAreaAcres: parseFloat(cultivatedAreaAcres) || parseFloat(totalLandAcres) || 4.0,
        estimatedYieldQuintals: parseFloat(estimatedYieldQuintals) || 40.0,
        season,
        year: 2026,
      },
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId,
        farmerId: farmerRecord.id,
        title: 'Farmer Registration Successful',
        titleHi: 'किसान पंजीकरण सफल हुआ',
        message: `Welcome to KisanSetu! Your Farmer ID is ${farmerRecord.farmerId}. You can now book procurement slots.`,
        messageHi: `किसानसेतु में आपका स्वागत है! आपकी किसान आईडी ${farmerRecord.farmerId} है। अब आप खरीद स्लॉट बुक कर सकते हैं।`,
        channel: 'SMS',
        type: 'SYSTEM',
      },
    });

    return res.json({
      success: true,
      message: 'Registration completed successfully!',
      farmer: farmerRecord,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
});

/**
 * Get Farmer's Dashboard Summary
 */
router.get('/dashboard-summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const farmer = await prisma.farmer.findFirst({
      where: { userId },
      include: {
        state: { include: { config: true } },
        district: true,
        crops: { include: { crop: true } },
        bookings: {
          include: {
            center: true,
            crop: true,
            slot: true,
            queueEntry: true,
            procurementRecord: { include: { paymentRecord: true } },
          },
          orderBy: { bookedAt: 'desc' },
        },
      },
    });

    if (!farmer) {
      return res.json({
        success: true,
        isRegistered: false,
        summary: null,
      });
    }

    // Active or latest booking
    const activeBooking = farmer.bookings[0] || null;

    return res.json({
      success: true,
      isRegistered: true,
      farmer: {
        id: farmer.id,
        farmerId: farmer.farmerId,
        fullName: farmer.fullName,
        phone: farmer.phone,
        state: farmer.state,
        district: farmer.district,
        village: farmer.village,
        totalLandAcres: farmer.totalLandAcres,
        bankAccountMasked: farmer.accountNumberMasked,
        bankName: farmer.bankName,
      },
      crops: farmer.crops,
      activeBooking,
      totalBookingsCount: farmer.bookings.length,
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
