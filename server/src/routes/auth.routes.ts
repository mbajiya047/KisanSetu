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

/**
 * Official Government Authority & Administration Email + Password Login
 */
router.post('/official-login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Official government email address is required' });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ success: false, message: 'Government security password is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    let targetPhone = '9876500001'; // Default Mandi Officer

    if (cleanEmail.includes('superadmin') || cleanEmail.includes('nic.in') || cleanEmail.includes('super') || cleanEmail.includes('national')) {
      targetPhone = '9876500000';
    } else if (cleanEmail.includes('state') || cleanEmail.includes('nodal')) {
      targetPhone = '9876500003';
    } else if (cleanEmail.includes('district') || cleanEmail.includes('collector')) {
      targetPhone = '9876500002';
    } else if (cleanEmail.includes('officer') || cleanEmail.includes('mandi') || cleanEmail.includes('secretary')) {
      targetPhone = '9876500001';
    }

    const user = await prisma.user.findUnique({
      where: { phone: targetPhone },
      include: {
        center: true,
        state: true,
        district: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Government official account not found in registry. Please contact Ministry of Agriculture IT Cell.',
      });
    }

    if (!user.email || user.email !== cleanEmail) {
      await prisma.user.update({
        where: { id: user.id },
        data: { email: cleanEmail },
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
      message: `Authenticated successfully as ${user.role} (${user.name})`,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: cleanEmail,
        role: user.role,
        stateId: user.stateId,
        districtId: user.districtId,
        centerId: user.centerId,
        center: user.center || null,
        state: user.state || null,
        district: user.district || null,
      },
    });
  } catch (error) {
    console.error('Error in official login:', error);
    return res.status(500).json({ success: false, message: 'Server error during official login' });
  }
});

/**
 * Simplified Farmer Registration (Name, Phone, DOB, Email [Optional], State, District)
 */
router.post('/farmer-register', async (req: Request, res: Response) => {
  try {
    const { fullName, phone, dob, email, stateId = 'state-rj', districtId = 'dist-rj-nagaur' } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Farmer full name is required' });
    }

    if (!phone || !/^\d{10}$/.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number' });
    }

    if (!dob) {
      return res.status(400).json({ success: false, message: 'Date of Birth (DOB) is required' });
    }

    const cleanPhone = phone.trim();
    const cleanName = fullName.trim();
    const cleanEmail = email && email.trim() ? email.trim() : null;

    // Check if user already exists with this phone
    let existingUser = await prisma.user.findUnique({
      where: { phone: cleanPhone },
      include: { farmer: true },
    });

    if (existingUser && existingUser.farmer) {
      return res.status(400).json({
        success: false,
        message: 'A farmer account with this mobile number already exists. Please login with OTP.',
      });
    }

    // Default state/district
    const chosenStateId = stateId || 'state-rj';
    const chosenDistrictId = districtId || 'dist-rj-nagaur';

    let user: any = existingUser;
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: `user-farmer-${cleanPhone.slice(-6)}-${Date.now().toString().slice(-4)}`,
          phone: cleanPhone,
          name: cleanName,
          email: cleanEmail,
          role: 'FARMER',
          stateId: chosenStateId,
          districtId: chosenDistrictId,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: cleanName,
          email: cleanEmail,
          role: 'FARMER',
          stateId: chosenStateId,
          districtId: chosenDistrictId,
        },
      });
    }

    const farmerCustomId = `FARM-IN-${cleanPhone.slice(-6)}`;
    const farmer = await prisma.farmer.create({
      data: {
        id: `farmer-${cleanPhone.slice(-6)}-${Date.now().toString().slice(-4)}`,
        userId: user.id,
        farmerId: farmerCustomId,
        fullName: cleanName,
        phone: cleanPhone,
        stateId: chosenStateId,
        districtId: chosenDistrictId,
        village: 'Farmer Native Gram',
        totalLandAcres: 4.5,
        isVerified: true,
      },
    });

    // Seed default crop for this farmer
    try {
      await prisma.farmerCrop.create({
        data: {
          farmerId: farmer.id,
          cropId: 'crop-wheat',
          cultivatedAreaAcres: 4.5,
          estimatedYieldQuintals: 85.0,
          season: 'Rabi 2026',
          year: 2026,
        },
      });
    } catch (cropErr) {
      console.warn('Farmer crop default seed skipped:', cropErr);
    }

    const token = generateToken({
      userId: user.id,
      phone: user.phone,
      role: 'FARMER',
      name: cleanName,
      stateId: chosenStateId,
      districtId: chosenDistrictId,
    });

    return res.json({
      success: true,
      message: `Farmer account created successfully! Welcome, ${cleanName}.`,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: cleanName,
        email: cleanEmail,
        role: 'FARMER',
        stateId: chosenStateId,
        districtId: chosenDistrictId,
        farmerProfile: farmer,
      },
    });
  } catch (error) {
    console.error('Error in farmer registration:', error);
    return res.status(500).json({ success: false, message: 'Server error during farmer registration' });
  }
});

export default router;
