import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Store OTPs in-memory for verification (mock SMS gateway)
const otpStore: Record<string, { otp: string; expiresAt: number }> = {
  '9876543210': { otp: '123456', expiresAt: Date.now() + 1000 * 60 * 60 },
};

/**
 * Send OTP to Mobile Number
 */
router.post('/send-otp', async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid 10-digit mobile number',
    });
  }

  // Generate 6-digit OTP (for demo default is 123456 or generated)
  const otp = phone === '9876543210' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
  };

  console.log(`📱 [SMS Gateway Simulation] OTP for ${phone} is: ${otp}`);

  return res.json({
    success: true,
    message: `OTP sent successfully to +91 ${phone}`,
    demoHint: `Demo OTP is: ${otp}`,
    expiresInSeconds: 600,
  });
});

/**
 * Verify OTP and authenticate user
 */
router.post('/verify-otp', async (req: Request, res: Response) => {
  const { phone, otp, role = 'FARMER' } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
  }

  const stored = otpStore[phone];
  // Allow '123456' as master demo OTP or verified store OTP
  const isValid = (stored && stored.otp === otp && stored.expiresAt > Date.now()) || otp === '123456';

  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Use 123456 for demo.' });
  }

  // Find user by phone
  let user = await prisma.user.findUnique({
    where: { phone },
    include: {
      farmer: {
        include: {
          crops: { include: { crop: true } },
          state: true,
          district: true,
        },
      },
      center: true,
      state: true,
      district: true,
    },
  });

  let isNewUser = false;

  if (!user) {
    isNewUser = true;
    // Create new temporary user entry
    user = await prisma.user.create({
      data: {
        phone,
        name: `Farmer ${phone.slice(-4)}`,
        role: role.toUpperCase(),
      },
      include: {
        farmer: {
          include: {
            crops: { include: { crop: true } },
            state: true,
            district: true,
          },
        },
        center: true,
        state: true,
        district: true,
      },
    });
  }

  const token = generateToken({
    userId: user.id,
    phone: user.phone,
    role: user.role,
    name: user.name,
    stateId: user.stateId,
    districtId: user.districtId,
    centerId: user.centerId,
  });

  return res.json({
    success: true,
    message: 'OTP verified successfully',
    token,
    isNewUser: isNewUser || !user.farmer,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      stateId: user.stateId,
      districtId: user.districtId,
      centerId: user.centerId,
      farmerProfile: user.farmer || null,
      center: user.center || null,
    },
  });
});

/**
 * 1-Click Demo Login for all 5 roles
 */
router.post('/demo-login', async (req: Request, res: Response) => {
  const { role = 'FARMER' } = req.body;

  let phone = '9876543210'; // Farmer Ramesh Kumar

  if (role === 'MANDI_OFFICER') phone = '9876500001';
  else if (role === 'DISTRICT_ADMIN') phone = '9876500002';
  else if (role === 'STATE_ADMIN') phone = '9876500003';
  else if (role === 'SUPER_ADMIN') phone = '9876500000';

  const user = await prisma.user.findUnique({
    where: { phone },
    include: {
      farmer: {
        include: {
          crops: { include: { crop: true } },
          state: true,
          district: true,
        },
      },
      center: true,
      state: true,
      district: true,
    },
  });

  if (!user) {
    return res.status(404).json({ success: false, message: `Demo user for role ${role} not found. Please run seed.` });
  }

  const token = generateToken({
    userId: user.id,
    phone: user.phone,
    role: user.role,
    name: user.name,
    stateId: user.stateId,
    districtId: user.districtId,
    centerId: user.centerId,
  });

  return res.json({
    success: true,
    message: `Logged in as Demo ${user.role} (${user.name})`,
    token,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      stateId: user.stateId,
      districtId: user.districtId,
      centerId: user.centerId,
      farmerProfile: user.farmer || null,
      center: user.center || null,
    },
  });
});

/**
 * Get current session user profile
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: {
      farmer: {
        include: {
          crops: { include: { crop: true } },
          state: true,
          district: true,
        },
      },
      center: true,
      state: true,
      district: true,
    },
  });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      stateId: user.stateId,
      districtId: user.districtId,
      centerId: user.centerId,
      farmerProfile: user.farmer || null,
      center: user.center || null,
    },
  });
});

export default router;
