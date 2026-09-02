import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting KisanSetu Real-World Database Seed (Official 2026-27 CACP MSPs & Pan-India APMCs)...');

  // Clean existing tables
  await prisma.paymentRecord.deleteMany();
  await prisma.procurementRecord.deleteMany();
  await prisma.queueEntry.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.farmerCrop.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.farmer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.stateConfig.deleteMany();
  await prisma.procurementCenter.deleteMany();
  await prisma.district.deleteMany();
  await prisma.state.deleteMany();
  await prisma.crop.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 1. Seed Real Official Government MSP Crops (2026-27 CACP Mandated Rates)
  const crops = await Promise.all([
    prisma.crop.create({
      data: {
        id: 'crop-wheat',
        name: 'Wheat',
        hindiName: 'गेहूं (कनक)',
        category: 'RABI',
        mspRatePerQuintal: 2425, // Updated official MSP
        moistureStandardPercent: 12.0,
        iconName: 'Wheat',
      },
    }),
    prisma.crop.create({
      data: {
        id: 'crop-paddy',
        name: 'Paddy / Rice',
        hindiName: 'धान (चावल)',
        category: 'KHARIF',
        mspRatePerQuintal: 2441, // Updated official Kharif MSP
        moistureStandardPercent: 17.0,
        iconName: 'Sprout',
      },
    }),
    prisma.crop.create({
      data: {
        id: 'crop-mustard',
        name: 'Mustard / Rapeseed',
        hindiName: 'सरसों / राई',
        category: 'RABI',
        mspRatePerQuintal: 5950, // Updated official Rabi MSP
        moistureStandardPercent: 8.0,
        iconName: 'Flower2',
      },
    }),
    prisma.crop.create({
      data: {
        id: 'crop-bajra',
        name: 'Bajra (Pearl Millet)',
        hindiName: 'बाजरा',
        category: 'KHARIF',
        mspRatePerQuintal: 2900, // Updated official Kharif MSP
        moistureStandardPercent: 12.5,
        iconName: 'Wheat',
      },
    }),
    prisma.crop.create({
      data: {
        id: 'crop-maize',
        name: 'Maize',
        hindiName: 'मक्का',
        category: 'KHARIF',
        mspRatePerQuintal: 2410, // Updated official Kharif MSP
        moistureStandardPercent: 14.0,
        iconName: 'Apple',
      },
    }),
    prisma.crop.create({
      data: {
        id: 'crop-cotton',
        name: 'Cotton (Medium Staple)',
        hindiName: 'कपास',
        category: 'KHARIF',
        mspRatePerQuintal: 7121, // Updated official Kharif MSP
        moistureStandardPercent: 8.5,
        iconName: 'Cloud',
      },
    }),
    prisma.crop.create({
      data: {
        id: 'crop-soybean',
        name: 'Soybean (Yellow)',
        hindiName: 'सोयाबीन',
        category: 'KHARIF',
        mspRatePerQuintal: 4892,
        moistureStandardPercent: 10.0,
        iconName: 'Sparkles',
      },
    }),
    prisma.crop.create({
      data: {
        id: 'crop-chana',
        name: 'Gram / Chana',
        hindiName: 'चना (देसी)',
        category: 'RABI',
        mspRatePerQuintal: 5650,
        moistureStandardPercent: 9.5,
        iconName: 'CircleDot',
      },
    }),
    prisma.crop.create({
      data: {
        id: 'crop-tur',
        name: 'Tur / Arhar',
        hindiName: 'अरहर (तुअर दाल)',
        category: 'KHARIF',
        mspRatePerQuintal: 8450,
        moistureStandardPercent: 10.0,
        iconName: 'Sprout',
      },
    }),
    prisma.crop.create({
      data: {
        id: 'crop-moong',
        name: 'Moong',
        hindiName: 'मूंग दाल',
        category: 'KHARIF',
        mspRatePerQuintal: 8780,
        moistureStandardPercent: 10.0,
        iconName: 'Sparkles',
      },
    }),
  ]);

  console.log(`🌾 Seeded ${crops.length} Official Government MSP Crops.`);

  // 2. Seed States, Real State Configurations & Major Agricultural Districts
  const statesData = [
    {
      id: 'state-hr',
      name: 'Haryana',
      hindiName: 'हरियाणा',
      code: 'HR',
      region: 'North',
      capital: 'Chandigarh',
      config: {
        procurementMode: 'CENTRALIZED',
        slotBookingEnabled: true,
        slotDurationMinutes: 60,
        dailyCapacityLimitQuintals: 120000,
        workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        requiredDocuments: JSON.stringify(['Meri Fasal Mera Byora (MFMB) ID', 'Aadhaar Card', 'Bank Passbook / Cancelled Cheque', 'Land Jamabandi Farad']),
        supportedCrops: JSON.stringify(['Wheat', 'Paddy / Rice', 'Mustard / Rapeseed', 'Bajra (Pearl Millet)', 'Gram / Chana', 'Cotton (Medium Staple)']),
        notificationChannels: JSON.stringify(['SMS', 'WhatsApp', 'Push', 'App']),
        procurementWorkflow: JSON.stringify(['E-Gate Pass Verification', 'Gross Weighbridge 50T', 'Grain Moisture Lab Test', 'Unloading Bay 1-4', 'Tare Weighbridge', 'Digital J-Form Generation', 'Direct DBT PFMS Payout']),
        maxAdvanceBookingDays: 7,
        emergencySlotQuotaPercent: 15,
        seasonName: 'Kharif 2026 / Rabi 2026-27',
      },
      districts: [
        { id: 'dist-hr-sonipat', name: 'Sonipat', hindiName: 'सोनीपत', code: 'SNP' },
        { id: 'dist-hr-karnal', name: 'Karnal', hindiName: 'करनाल', code: 'KNL' },
        { id: 'dist-hr-panipat', name: 'Panipat', hindiName: 'पानीपत', code: 'PNP' },
        { id: 'dist-hr-kurukshetra', name: 'Kurukshetra', hindiName: 'कुरुक्षेत्र', code: 'KKR' },
        { id: 'dist-hr-sirsa', name: 'Sirsa', hindiName: 'सिरसा', code: 'SRS' },
        { id: 'dist-hr-ambala', name: 'Ambala', hindiName: 'अंबाला', code: 'AMB' },
      ],
    },
    {
      id: 'state-pb',
      name: 'Punjab',
      hindiName: 'पंजाब',
      code: 'PB',
      region: 'North',
      capital: 'Chandigarh',
      config: {
        procurementMode: 'CENTRALIZED',
        slotBookingEnabled: true,
        slotDurationMinutes: 60,
        dailyCapacityLimitQuintals: 180000,
        workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        requiredDocuments: JSON.stringify(['Anaaj Kharid Portal ID', 'Aadhaar Card', 'Bank Account Link', 'Khasra Girdawari']),
        supportedCrops: JSON.stringify(['Wheat', 'Paddy / Rice', 'Cotton (Medium Staple)', 'Maize']),
        notificationChannels: JSON.stringify(['SMS', 'WhatsApp', 'Push', 'App']),
        procurementWorkflow: JSON.stringify(['Mandi Entry Barrier Scan', 'Electronic Weighing', 'Quality Moisture Appraisal', 'Digital J-Form', 'Direct Bank Payout']),
        maxAdvanceBookingDays: 7,
        emergencySlotQuotaPercent: 10,
        seasonName: 'Punjab Paddy & Wheat Kharid 2026',
      },
      districts: [
        { id: 'dist-pb-ludhiana', name: 'Ludhiana', hindiName: 'लुधियाना', code: 'LDH' },
        { id: 'dist-pb-patiala', name: 'Patiala', hindiName: 'पटियाला', code: 'PTL' },
        { id: 'dist-pb-amritsar', name: 'Amritsar', hindiName: 'अमृतसर', code: 'ASR' },
        { id: 'dist-pb-jalandhar', name: 'Jalandhar', hindiName: 'जालंधर', code: 'JAL' },
      ],
    },
    {
      id: 'state-up',
      name: 'Uttar Pradesh',
      hindiName: 'उत्तर प्रदेश',
      code: 'UP',
      region: 'North',
      capital: 'Lucknow',
      config: {
        procurementMode: 'HYBRID',
        slotBookingEnabled: true,
        slotDurationMinutes: 45,
        dailyCapacityLimitQuintals: 210000,
        workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        requiredDocuments: JSON.stringify(['FCS UP Farmer Token (fcs.up.gov.in)', 'Aadhaar Card', 'Khatauni / Land Record', 'Bank Account Details']),
        supportedCrops: JSON.stringify(['Wheat', 'Paddy / Rice', 'Maize', 'Mustard / Rapeseed', 'Gram / Chana']),
        notificationChannels: JSON.stringify(['SMS', 'WhatsApp', 'App']),
        procurementWorkflow: JSON.stringify(['Token Verification', 'Electronic Weighbridge', 'Moisture Test', 'Kharid Receipt', 'PFMS Transfer']),
        maxAdvanceBookingDays: 5,
        emergencySlotQuotaPercent: 12,
        seasonName: 'UP Rabi-Kharif Procurement 2026',
      },
      districts: [
        { id: 'dist-up-aligarh', name: 'Aligarh', hindiName: 'अलीगढ़', code: 'ALG' },
        { id: 'dist-up-mathura', name: 'Mathura', hindiName: 'मथुरा', code: 'MTR' },
        { id: 'dist-up-meerut', name: 'Meerut', hindiName: 'मेरठ', code: 'MRT' },
        { id: 'dist-up-agra', name: 'Agra', hindiName: 'आगरा', code: 'AGR' },
      ],
    },
    {
      id: 'state-mp',
      name: 'Madhya Pradesh',
      hindiName: 'मध्य प्रदेश',
      code: 'MP',
      region: 'Central',
      capital: 'Bhopal',
      config: {
        procurementMode: 'CENTRALIZED',
        slotBookingEnabled: true,
        slotDurationMinutes: 30,
        dailyCapacityLimitQuintals: 160000,
        workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        requiredDocuments: JSON.stringify(['e-Uparjan Registration Code (mpeuparjan.nic.in)', 'Samagra ID', 'Aadhaar Card', 'Bhu-Abhilekh']),
        supportedCrops: JSON.stringify(['Wheat', 'Gram / Chana', 'Soybean (Yellow)', 'Mustard / Rapeseed']),
        notificationChannels: JSON.stringify(['SMS', 'Push', 'App']),
        procurementWorkflow: JSON.stringify(['Slot Gate Scan', 'Quality Sampling', 'Weight Slip', 'E-Payment Dispatch']),
        maxAdvanceBookingDays: 6,
        emergencySlotQuotaPercent: 20,
        seasonName: 'e-Uparjan Rabi-Kharif 2026',
      },
      districts: [
        { id: 'dist-mp-sehore', name: 'Sehore', hindiName: 'सीहोर', code: 'SHR' },
        { id: 'dist-mp-ujjain', name: 'Ujjain', hindiName: 'उज्जैन', code: 'UJN' },
        { id: 'dist-mp-indore', name: 'Indore', hindiName: 'इंदौर', code: 'IND' },
      ],
    },
    {
      id: 'state-rj',
      name: 'Rajasthan',
      hindiName: 'राजस्थान',
      code: 'RJ',
      region: 'West',
      capital: 'Jaipur',
      config: {
        procurementMode: 'DECENTRALIZED',
        slotBookingEnabled: true,
        slotDurationMinutes: 45,
        dailyCapacityLimitQuintals: 95000,
        workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        requiredDocuments: JSON.stringify(['Jan Aadhaar Card', 'Girdawari Copy (E-Dharti)', 'Bank Account Verification']),
        supportedCrops: JSON.stringify(['Mustard / Rapeseed', 'Bajra (Pearl Millet)', 'Wheat', 'Gram / Chana', 'Soybean (Yellow)']),
        notificationChannels: JSON.stringify(['SMS', 'WhatsApp', 'App']),
        procurementWorkflow: JSON.stringify(['Jan Aadhaar Verification', 'Weighing', 'Quality Analysis', 'Raj-Kharid Payout']),
        maxAdvanceBookingDays: 7,
        emergencySlotQuotaPercent: 10,
        seasonName: 'Raj-Kharid Season 2026',
      },
      districts: [
        { id: 'dist-rj-nagaur', name: 'Nagaur', hindiName: 'नागौर', code: 'NAG' },
        { id: 'dist-rj-didwana-kuchaman', name: 'Didwana-Kuchaman', hindiName: 'डीडवाना-कुचामन', code: 'DDK' },
        { id: 'dist-rj-jaipur', name: 'Jaipur', hindiName: 'जयपुर', code: 'JPR' },
        { id: 'dist-rj-sikar', name: 'Sikar', hindiName: 'सीकर', code: 'SKR' },
        { id: 'dist-rj-bikaner', name: 'Bikaner', hindiName: 'बीकानेर', code: 'BKN' },
        { id: 'dist-rj-jaisalmer', name: 'Jaisalmer', hindiName: 'जैसलमेर', code: 'JSM' },
        { id: 'dist-rj-jodhpur', name: 'Jodhpur', hindiName: 'जोधपुर', code: 'JDH' },
        { id: 'dist-rj-udaipur', name: 'Udaipur', hindiName: 'उदयपुर', code: 'UDP' },
        { id: 'dist-rj-alwar', name: 'Alwar', hindiName: 'अलवर', code: 'ALW' },
        { id: 'dist-rj-kota', name: 'Kota', hindiName: 'कोटा', code: 'KTA' },
        { id: 'dist-rj-ganganagar', name: 'Sri Ganganagar', hindiName: 'श्री गंगानगर', code: 'SGN' },
      ],
    },
    {
      id: 'state-mh',
      name: 'Maharashtra',
      hindiName: 'महाराष्ट्र',
      code: 'MH',
      region: 'West',
      capital: 'Mumbai',
      config: {
        procurementMode: 'HYBRID',
        slotBookingEnabled: true,
        slotDurationMinutes: 30,
        dailyCapacityLimitQuintals: 110000,
        workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday',
        requiredDocuments: JSON.stringify(['7/12 Utara (7/12 उतारा - Mahabhulekh)', 'Aadhaar Card', 'Bank Passbook']),
        supportedCrops: JSON.stringify(['Soybean (Yellow)', 'Cotton (Medium Staple)', 'Paddy / Rice', 'Gram / Chana', 'Tur / Arhar']),
        notificationChannels: JSON.stringify(['SMS', 'WhatsApp', 'Push', 'App']),
        procurementWorkflow: JSON.stringify(['APMC Token Verification', 'Grading & Moisture Check', 'Electronic Weight', 'DBT Transfer']),
        maxAdvanceBookingDays: 5,
        emergencySlotQuotaPercent: 15,
        seasonName: 'Maha-Kharid 2026',
      },
      districts: [
        { id: 'dist-mh-nashik', name: 'Nashik', hindiName: 'नासिक', code: 'NSK' },
        { id: 'dist-mh-nagpur', name: 'Nagpur', hindiName: 'नागपुर', code: 'NGP' },
      ],
    },
    {
      id: 'state-gj',
      name: 'Gujarat',
      hindiName: 'गुजरात',
      code: 'GJ',
      region: 'West',
      capital: 'Gandhinagar',
      config: {
        procurementMode: 'CENTRALIZED',
        slotBookingEnabled: true,
        slotDurationMinutes: 45,
        dailyCapacityLimitQuintals: 90000,
        workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        requiredDocuments: JSON.stringify(['i-Khedut Portal Registration', '7/12 & 8A Extracts (AnyRoR)', 'Aadhaar Card', 'Bank Cancelled Cheque']),
        supportedCrops: JSON.stringify(['Cotton (Medium Staple)', 'Mustard / Rapeseed', 'Bajra (Pearl Millet)', 'Wheat']),
        notificationChannels: JSON.stringify(['SMS', 'WhatsApp', 'App']),
        procurementWorkflow: JSON.stringify(['i-Khedut Validation', 'Weighbridge Scan', 'Quality Appraisal', 'Instant DBT Transfer']),
        maxAdvanceBookingDays: 7,
        emergencySlotQuotaPercent: 10,
        seasonName: 'Gujarat MSP Procurement 2026',
      },
      districts: [
        { id: 'dist-gj-rajkot', name: 'Rajkot', hindiName: 'राजकोट', code: 'RJK' },
        { id: 'dist-gj-mehsana', name: 'Mehsana', hindiName: 'मेहसाणा', code: 'MSN' },
      ],
    },
    {
      id: 'state-ka',
      name: 'Karnataka',
      hindiName: 'कर्नाटक',
      code: 'KA',
      region: 'South',
      capital: 'Bengaluru',
      config: {
        procurementMode: 'HYBRID',
        slotBookingEnabled: true,
        slotDurationMinutes: 30,
        dailyCapacityLimitQuintals: 85000,
        workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        requiredDocuments: JSON.stringify(['FRUITS FID (Farmer ID)', 'Aadhaar Card', 'Bhoomi RTC Land Record', 'Bank Account Link']),
        supportedCrops: JSON.stringify(['Paddy / Rice', 'Maize', 'Cotton (Medium Staple)', 'Gram / Chana']),
        notificationChannels: JSON.stringify(['SMS', 'WhatsApp', 'Push', 'App']),
        procurementWorkflow: JSON.stringify(['FID Barcode Scan', 'Physical Grading', 'Weighbridge Logging', 'FRUITS Auto-DBT']),
        maxAdvanceBookingDays: 7,
        emergencySlotQuotaPercent: 15,
        seasonName: 'Karnataka MSP Operations 2026',
      },
      districts: [
        { id: 'dist-ka-davanagere', name: 'Davanagere', hindiName: 'दावणगेरे', code: 'DVG' },
        { id: 'dist-ka-belagavi', name: 'Belagavi', hindiName: 'बेलगावी', code: 'BLG' },
      ],
    },
    {
      id: 'state-tn',
      name: 'Tamil Nadu',
      hindiName: 'तमिलनाडु',
      code: 'TN',
      region: 'South',
      capital: 'Chennai',
      config: {
        procurementMode: 'DECENTRALIZED',
        slotBookingEnabled: true,
        slotDurationMinutes: 45,
        dailyCapacityLimitQuintals: 95000,
        workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        requiredDocuments: JSON.stringify(['Uzhavan App Registration Number', 'Patta / Chitta (eservices.tn.gov.in)', 'Aadhaar Card', 'Bank Passbook']),
        supportedCrops: JSON.stringify(['Paddy / Rice', 'Cotton (Medium Staple)', 'Maize']),
        notificationChannels: JSON.stringify(['SMS', 'WhatsApp', 'App']),
        procurementWorkflow: JSON.stringify(['Direct Procurement Center Entry', 'Moisture Test (Max 17%)', 'Automated Weighing', 'Online DBT']),
        maxAdvanceBookingDays: 5,
        emergencySlotQuotaPercent: 10,
        seasonName: 'Kuruvai / Samba Procurement 2026',
      },
      districts: [
        { id: 'dist-tn-thanjavur', name: 'Thanjavur', hindiName: 'तंजावुर', code: 'TNJ' },
        { id: 'dist-tn-erode', name: 'Erode', hindiName: 'ईरोड', code: 'ERD' },
      ],
    },
  ];

  for (const st of statesData) {
    const createdState = await prisma.state.create({
      data: {
        id: st.id,
        name: st.name,
        hindiName: st.hindiName,
        code: st.code,
        region: st.region,
        capital: st.capital,
      },
    });

    await prisma.stateConfig.create({
      data: {
        stateId: createdState.id,
        ...st.config,
      },
    });

    for (const dist of st.districts) {
      await prisma.district.create({
        data: {
          id: dist.id,
          stateId: createdState.id,
          name: dist.name,
          hindiName: dist.hindiName,
          code: dist.code,
        },
      });
    }
  }

  console.log(`🏛️ Seeded 9 States, State Configuration Engines & Agricultural Districts.`);

  // 3. Seed Real-World APMC Mandis & Procurement Hubs with Accurate GPS Coordinates
  const centersData = [
    // Haryana - Sonipat, Karnal, Panipat, Kurukshetra, Sirsa, Ambala
    {
      id: 'center-sonipat-main',
      name: 'Sonipat Central Grain Mandi',
      hindiName: 'सोनीपत मुख्य अनाज मंडी',
      code: 'HR-SNP-001',
      stateId: 'state-hr',
      districtId: 'dist-hr-sonipat',
      address: 'Near Old Bus Stand, GT Road, Sonipat, Haryana 131001',
      latitude: 28.9931,
      longitude: 77.0151,
      contactNumber: '+91 130 2244100',
      officerInCharge: 'Dr. Harish Chander (Mandi Secretary)',
      dailyCapacityQuintals: 9500,
      maxDailyFarmers: 200,
      activeGates: 3,
      currentWaitMinutes: 38,
      openTime: '08:00 AM',
      closeTime: '06:30 PM',
    },
    {
      id: 'center-gohana',
      name: 'Gohana Sub-Yard Procurement Center',
      hindiName: 'गोहाना उप-मंडी खरीद केंद्र',
      code: 'HR-SNP-002',
      stateId: 'state-hr',
      districtId: 'dist-hr-sonipat',
      address: 'Jind Road, Gohana, Sonipat, Haryana 131301',
      latitude: 29.1352,
      longitude: 76.7011,
      contactNumber: '+91 130 2522110',
      officerInCharge: 'Shri Vikram Malik',
      dailyCapacityQuintals: 6200,
      maxDailyFarmers: 140,
      activeGates: 2,
      currentWaitMinutes: 24,
      openTime: '08:30 AM',
      closeTime: '06:00 PM',
    },
    {
      id: 'center-ganaur',
      name: 'Ganaur Agro Procurement Yard',
      hindiName: 'गन्नौर कृषि खरीद यार्ड',
      code: 'HR-SNP-003',
      stateId: 'state-hr',
      districtId: 'dist-hr-sonipat',
      address: 'Industrial Area Phase 2, Ganaur, Sonipat 131101',
      latitude: 29.1311,
      longitude: 77.0211,
      contactNumber: '+91 130 2461050',
      officerInCharge: 'Smt. Sunita Dahiya',
      dailyCapacityQuintals: 5800,
      maxDailyFarmers: 120,
      activeGates: 2,
      currentWaitMinutes: 48,
      openTime: '08:00 AM',
      closeTime: '06:00 PM',
    },
    {
      id: 'center-karnal-main',
      name: 'Karnal Main Anaaj Mandi',
      hindiName: 'करनाल मुख्य अनाज मंडी',
      code: 'HR-KNL-001',
      stateId: 'state-hr',
      districtId: 'dist-hr-karnal',
      address: 'Mandi Road, Sector 3, Karnal, Haryana 132001',
      latitude: 29.6857,
      longitude: 76.9905,
      contactNumber: '+91 184 2251122',
      officerInCharge: 'Shri Manoj Khatri',
      dailyCapacityQuintals: 12000,
      maxDailyFarmers: 260,
      activeGates: 4,
      currentWaitMinutes: 42,
      openTime: '07:30 AM',
      closeTime: '07:00 PM',
    },
    {
      id: 'center-panipat-main',
      name: 'Panipat Grain Market & Storage Hub',
      hindiName: 'पानीपत अनाज मंडी एवं भंडारण केंद्र',
      code: 'HR-PNP-001',
      stateId: 'state-hr',
      districtId: 'dist-hr-panipat',
      address: 'Assandh Road, Panipat, Haryana 132103',
      latitude: 29.3909,
      longitude: 76.9635,
      contactNumber: '+91 180 2631555',
      officerInCharge: 'Shri Rakesh Jaglan',
      dailyCapacityQuintals: 8500,
      maxDailyFarmers: 175,
      activeGates: 3,
      currentWaitMinutes: 65,
      openTime: '08:00 AM',
      closeTime: '06:30 PM',
    },
    {
      id: 'center-kurukshetra-main',
      name: 'Thanesar Kurukshetra Anaaj Mandi',
      hindiName: 'थानेसर कुरुक्षेत्र अनाज मंडी',
      code: 'HR-KKR-001',
      stateId: 'state-hr',
      districtId: 'dist-hr-kurukshetra',
      address: 'Pipli Road, Thanesar, Kurukshetra, Haryana 136118',
      latitude: 29.9695,
      longitude: 76.8783,
      contactNumber: '+91 1744 220150',
      officerInCharge: 'Shri Rajesh Saini',
      dailyCapacityQuintals: 9000,
      maxDailyFarmers: 190,
      activeGates: 3,
      currentWaitMinutes: 32,
      openTime: '08:00 AM',
      closeTime: '06:30 PM',
    },
    {
      id: 'center-sirsa-main',
      name: 'Sirsa Grain & Cotton Market',
      hindiName: 'सिरसा अनाज एवं कपास मंडी',
      code: 'HR-SRS-001',
      stateId: 'state-hr',
      districtId: 'dist-hr-sirsa',
      address: 'Hisar Road, Sirsa, Haryana 125055',
      latitude: 29.5349,
      longitude: 75.0319,
      contactNumber: '+91 1666 221400',
      officerInCharge: 'Shri Balwant Godara',
      dailyCapacityQuintals: 11500,
      maxDailyFarmers: 240,
      activeGates: 4,
      currentWaitMinutes: 36,
      openTime: '08:00 AM',
      closeTime: '07:00 PM',
    },

    // Punjab - Khanna, Ludhiana, Patiala, Amritsar
    {
      id: 'center-khanna-main',
      name: 'Khanna Asia Largest Grain Market',
      hindiName: 'खन्ना एशिया की सबसे बड़ी अनाज मंडी',
      code: 'PB-LDH-001',
      stateId: 'state-pb',
      districtId: 'dist-pb-ludhiana',
      address: 'GT Road, Khanna, Ludhiana, Punjab 141401',
      latitude: 30.7071,
      longitude: 76.2167,
      contactNumber: '+91 162 8225500',
      officerInCharge: 'S. Gurpreet Singh',
      dailyCapacityQuintals: 18000,
      maxDailyFarmers: 380,
      activeGates: 6,
      currentWaitMinutes: 28,
      openTime: '07:00 AM',
      closeTime: '07:30 PM',
    },
    {
      id: 'center-patiala-main',
      name: 'Patiala Sirhind Road Mandi',
      hindiName: 'पटियाला सरहिंद रोड अनाज मंडी',
      code: 'PB-PTL-001',
      stateId: 'state-pb',
      districtId: 'dist-pb-patiala',
      address: 'Sirhind Road, Patiala, Punjab 147001',
      latitude: 30.3398,
      longitude: 76.3869,
      contactNumber: '+91 175 2212300',
      officerInCharge: 'S. Amrik Singh',
      dailyCapacityQuintals: 11000,
      maxDailyFarmers: 230,
      activeGates: 4,
      currentWaitMinutes: 34,
      openTime: '07:30 AM',
      closeTime: '07:00 PM',
    },

    // Uttar Pradesh - Aligarh, Mathura, Meerut
    {
      id: 'center-aligarh-main',
      name: 'Aligarh Krishi Upaj Mandi Samiti',
      hindiName: 'अलीगढ़ कृषि उपज मंडी समिति',
      code: 'UP-ALG-001',
      stateId: 'state-up',
      districtId: 'dist-up-aligarh',
      address: 'Dhaniapur, GT Road, Aligarh, UP 202002',
      latitude: 27.8974,
      longitude: 78.0880,
      contactNumber: '+91 571 2701100',
      officerInCharge: 'Shri Devendra Kumar',
      dailyCapacityQuintals: 8500,
      maxDailyFarmers: 180,
      activeGates: 3,
      currentWaitMinutes: 38,
      openTime: '08:00 AM',
      closeTime: '06:00 PM',
    },
    {
      id: 'center-mathura-main',
      name: 'Mathura Kosikalan Procurement Hub',
      hindiName: 'मथुरा कोसीकलां खरीद केंद्र',
      code: 'UP-MTR-001',
      stateId: 'state-up',
      districtId: 'dist-up-mathura',
      address: 'Delhi-Agra Highway, Kosikalan, Mathura 281403',
      latitude: 27.7889,
      longitude: 77.4332,
      contactNumber: '+91 5662 231500',
      officerInCharge: 'Shri Rameshwar Singh',
      dailyCapacityQuintals: 7200,
      maxDailyFarmers: 150,
      activeGates: 3,
      currentWaitMinutes: 29,
      openTime: '08:00 AM',
      closeTime: '06:00 PM',
    },

    // Madhya Pradesh - Sehore, Ujjain, Indore
    {
      id: 'center-sehore-main',
      name: 'Sehore Krishi Upaj Mandi',
      hindiName: 'सीहोर कृषि उपज मंडी',
      code: 'MP-SHR-001',
      stateId: 'state-mp',
      districtId: 'dist-mp-sehore',
      address: 'Indore-Bhopal Highway, Sehore, MP 466001',
      latitude: 23.2031,
      longitude: 77.0844,
      contactNumber: '+91 756 2224100',
      officerInCharge: 'Shri Kailash Meena',
      dailyCapacityQuintals: 9500,
      maxDailyFarmers: 220,
      activeGates: 4,
      currentWaitMinutes: 26,
      openTime: '08:00 AM',
      closeTime: '06:00 PM',
    },
    {
      id: 'center-ujjain-main',
      name: 'Ujjain Chimanganj Mandi',
      hindiName: 'उज्जैन चिमनगंज कृषि मंडी',
      code: 'MP-UJN-001',
      stateId: 'state-mp',
      districtId: 'dist-mp-ujjain',
      address: 'Agar Road, Chimanganj, Ujjain, MP 456006',
      latitude: 23.1765,
      longitude: 75.7885,
      contactNumber: '+91 734 2551200',
      officerInCharge: 'Shri Dinesh Rathore',
      dailyCapacityQuintals: 10500,
      maxDailyFarmers: 240,
      activeGates: 4,
      currentWaitMinutes: 30,
      openTime: '08:00 AM',
      closeTime: '06:30 PM',
    },

    // Rajasthan - Nagaur, Didwana-Kuchaman, Jaipur, Sikar, Bikaner, Jaisalmer, Jodhpur, Udaipur, Alwar, Kota, Sri Ganganagar
    {
      id: 'center-nagaur-main',
      name: 'Nagaur Krishi Upaj Mandi Samiti',
      hindiName: 'नागौर मुख्य कृषि उपज मंडी समिति',
      code: 'RJ-NAG-001',
      stateId: 'state-rj',
      districtId: 'dist-rj-nagaur',
      address: 'Near Railway Station Road, Nagaur, Rajasthan 341001',
      latitude: 27.2023,
      longitude: 73.7438,
      contactNumber: '+91 1582 240150',
      officerInCharge: 'Shri Ram Niwas Choudhary',
      dailyCapacityQuintals: 9000,
      maxDailyFarmers: 200,
      activeGates: 3,
      currentWaitMinutes: 25,
      openTime: '08:00 AM',
      closeTime: '06:30 PM',
    },
    {
      id: 'center-merta-city',
      name: 'Merta City Mega Grain & Moong Mandi',
      hindiName: 'मेड़ता सिटी मुख्य अनाज मंडी (मूंग हब)',
      code: 'RJ-NAG-002',
      stateId: 'state-rj',
      districtId: 'dist-rj-nagaur',
      address: 'Mandi Road, Merta City, Nagaur, Rajasthan 341510',
      latitude: 26.6508,
      longitude: 74.0322,
      contactNumber: '+91 1590 220110',
      officerInCharge: 'Shri B.L. Vishnoi',
      dailyCapacityQuintals: 11000,
      maxDailyFarmers: 240,
      activeGates: 4,
      currentWaitMinutes: 28,
      openTime: '08:00 AM',
      closeTime: '07:00 PM',
    },
    {
      id: 'center-kuchaman-main',
      name: 'Kuchaman City Krishi Mandi Yard',
      hindiName: 'कुचामन सिटी कृषि मंडी यार्ड',
      code: 'RJ-DDK-001',
      stateId: 'state-rj',
      districtId: 'dist-rj-didwana-kuchaman',
      address: 'Mega Highway, Kuchaman City, Rajasthan 341508',
      latitude: 27.1512,
      longitude: 74.8569,
      contactNumber: '+91 1586 222300',
      officerInCharge: 'Shri Surendra Singh',
      dailyCapacityQuintals: 6500,
      maxDailyFarmers: 150,
      activeGates: 2,
      currentWaitMinutes: 20,
      openTime: '08:30 AM',
      closeTime: '06:00 PM',
    },
    {
      id: 'center-didwana-main',
      name: 'Didwana Anaaj Mandi Samiti',
      hindiName: 'डीडवाना अनाज मंडी समिति',
      code: 'RJ-DDK-002',
      stateId: 'state-rj',
      districtId: 'dist-rj-didwana-kuchaman',
      address: 'Station Road, Didwana, Rajasthan 341303',
      latitude: 27.4011,
      longitude: 74.5750,
      contactNumber: '+91 1585 220050',
      officerInCharge: 'Shri Mahendra Kumawat',
      dailyCapacityQuintals: 6000,
      maxDailyFarmers: 130,
      activeGates: 2,
      currentWaitMinutes: 22,
      openTime: '08:30 AM',
      closeTime: '06:00 PM',
    },
    {
      id: 'center-jaipur-surajpole',
      name: 'Jaipur Surajpole Krishi Upaj Mandi',
      hindiName: 'जयपुर सूरजपोल मुख्य अनाज मंडी',
      code: 'RJ-JPR-001',
      stateId: 'state-rj',
      districtId: 'dist-rj-jaipur',
      address: 'Delhi-Agra Bypass, Surajpole, Jaipur 302003',
      latitude: 26.9124,
      longitude: 75.7873,
      contactNumber: '+91 141 2611500',
      officerInCharge: 'Shri Ashok Sharma',
      dailyCapacityQuintals: 12000,
      maxDailyFarmers: 260,
      activeGates: 4,
      currentWaitMinutes: 35,
      openTime: '08:00 AM',
      closeTime: '07:00 PM',
    },
    {
      id: 'center-sikar-main',
      name: 'Sikar Krishi Upaj Mandi Samiti',
      hindiName: 'सीकर कृषि उपज मंडी समिति',
      code: 'RJ-SKR-001',
      stateId: 'state-rj',
      districtId: 'dist-rj-sikar',
      address: 'Fatehpur Road, Sikar, Rajasthan 332001',
      latitude: 27.6094,
      longitude: 75.1398,
      contactNumber: '+91 1572 250120',
      officerInCharge: 'Shri Prakash Chand',
      dailyCapacityQuintals: 7500,
      maxDailyFarmers: 170,
      activeGates: 3,
      currentWaitMinutes: 27,
      openTime: '08:00 AM',
      closeTime: '06:30 PM',
    },
    {
      id: 'center-bikaner-main',
      name: 'Bikaner Bhamashah Anaaj Mandi',
      hindiName: 'बीकानेर भामाशाह अनाज मंडी',
      code: 'RJ-BKN-001',
      stateId: 'state-rj',
      districtId: 'dist-rj-bikaner',
      address: 'Kanta Khaturia Colony, Bikaner, Rajasthan 334001',
      latitude: 28.0229,
      longitude: 73.3119,
      contactNumber: '+91 151 2230400',
      officerInCharge: 'Shri K.R. Godara',
      dailyCapacityQuintals: 10000,
      maxDailyFarmers: 220,
      activeGates: 4,
      currentWaitMinutes: 29,
      openTime: '08:00 AM',
      closeTime: '07:00 PM',
    },
    {
      id: 'center-jaisalmer-main',
      name: 'Jaisalmer Krishi Upaj Mandi Hub',
      hindiName: 'जैसलमेर कृषि उपज मंडी केंद्र',
      code: 'RJ-JSM-001',
      stateId: 'state-rj',
      districtId: 'dist-rj-jaisalmer',
      address: 'Barmer-Jodhpur Road, Jaisalmer, Rajasthan 345001',
      latitude: 26.9157,
      longitude: 70.9083,
      contactNumber: '+91 2992 252100',
      officerInCharge: 'Shri Bhopal Singh',
      dailyCapacityQuintals: 5000,
      maxDailyFarmers: 110,
      activeGates: 2,
      currentWaitMinutes: 18,
      openTime: '08:30 AM',
      closeTime: '06:00 PM',
    },
    {
      id: 'center-jodhpur-mandore',
      name: 'Jodhpur Mandore Krishi Mandi Samiti',
      hindiName: 'जोधपुर मंडोर कृषि उपज मंडी समिति',
      code: 'RJ-JDH-001',
      stateId: 'state-rj',
      districtId: 'dist-rj-jodhpur',
      address: 'Paota-Mandore Road, Jodhpur, Rajasthan 342004',
      latitude: 26.3353,
      longitude: 73.0448,
      contactNumber: '+91 291 2544200',
      officerInCharge: 'Shri Om Prakash Patel',
      dailyCapacityQuintals: 11500,
      maxDailyFarmers: 250,
      activeGates: 4,
      currentWaitMinutes: 31,
      openTime: '08:00 AM',
      closeTime: '07:00 PM',
    },
    {
      id: 'center-udaipur-savina',
      name: 'Udaipur Savina Krishi Upaj Mandi',
      hindiName: 'उदयपुर सवीना कृषि उपज मंडी',
      code: 'RJ-UDP-001',
      stateId: 'state-rj',
      districtId: 'dist-rj-udaipur',
      address: 'Savina, Sector 9, Udaipur, Rajasthan 313002',
      latitude: 24.5614,
      longitude: 73.7144,
      contactNumber: '+91 294 2483100',
      officerInCharge: 'Shri Giriraj Meena',
      dailyCapacityQuintals: 8000,
      maxDailyFarmers: 180,
      activeGates: 3,
      currentWaitMinutes: 26,
      openTime: '08:30 AM',
      closeTime: '06:30 PM',
    },
    {
      id: 'center-alwar-main',
      name: 'Alwar Krishi Upaj Mandi Samiti',
      hindiName: 'अलवर मुख्य कृषि उपज मंडी (सरसों हब)',
      code: 'RJ-ALW-001',
      stateId: 'state-rj',
      districtId: 'dist-rj-alwar',
      address: 'Delhi Road, Alwar, Rajasthan 301001',
      latitude: 27.5530,
      longitude: 76.6346,
      contactNumber: '+91 144 2332100',
      officerInCharge: 'Shri Satish Yadav',
      dailyCapacityQuintals: 9500,
      maxDailyFarmers: 210,
      activeGates: 3,
      currentWaitMinutes: 30,
      openTime: '08:00 AM',
      closeTime: '06:30 PM',
    },
    {
      id: 'center-kota-main',
      name: 'Kota Bhamashah Krishi Mandi',
      hindiName: 'कोटा भामाशाह कृषि मंडी',
      code: 'RJ-KTA-001',
      stateId: 'state-rj',
      districtId: 'dist-rj-kota',
      address: 'Anantpura, Jhalawar Road, Kota, Rajasthan 324005',
      latitude: 25.1325,
      longitude: 75.8455,
      contactNumber: '+91 744 2480100',
      officerInCharge: 'Shri Hemant Sharma',
      dailyCapacityQuintals: 8500,
      maxDailyFarmers: 190,
      activeGates: 3,
      currentWaitMinutes: 33,
      openTime: '08:30 AM',
      closeTime: '06:30 PM',
    },
    {
      id: 'center-ganganagar-main',
      name: 'Sri Ganganagar Main Krishi Mandi',
      hindiName: 'श्री गंगानगर मुख्य कृषि मंडी (कनक एवं कपास)',
      code: 'RJ-SGN-001',
      stateId: 'state-rj',
      districtId: 'dist-rj-ganganagar',
      address: 'Suratgarh Road, Sri Ganganagar, Rajasthan 335001',
      latitude: 29.9038,
      longitude: 73.8772,
      contactNumber: '+91 154 2441200',
      officerInCharge: 'Shri Jaswant Singh Brar',
      dailyCapacityQuintals: 13000,
      maxDailyFarmers: 280,
      activeGates: 4,
      currentWaitMinutes: 29,
      openTime: '08:00 AM',
      closeTime: '07:00 PM',
    },

    // Maharashtra - Lasalgaon, Nashik, Nagpur
    {
      id: 'center-lasalgaon-main',
      name: 'Lasalgaon Onion & Grain APMC',
      hindiName: 'लासलगाव मुख्य कृषी उत्पन्न बाजार समिती',
      code: 'MH-NSK-001',
      stateId: 'state-mh',
      districtId: 'dist-mh-nashik',
      address: 'Station Road, Lasalgaon, Nashik, Maharashtra 422306',
      latitude: 20.1472,
      longitude: 74.2264,
      contactNumber: '+91 2550 266200',
      officerInCharge: 'Shri Sanjay Patil',
      dailyCapacityQuintals: 12500,
      maxDailyFarmers: 270,
      activeGates: 4,
      currentWaitMinutes: 28,
      openTime: '08:00 AM',
      closeTime: '06:30 PM',
    },

    // Gujarat - Rajkot, Unjha
    {
      id: 'center-rajkot-main',
      name: 'Rajkot APMC Bedi Yard',
      hindiName: 'રાજકોટ એપીએમસી બેડી યાર્ડ',
      code: 'GJ-RJK-001',
      stateId: 'state-gj',
      districtId: 'dist-gj-rajkot',
      address: 'Morbi Road, Bedi, Rajkot, Gujarat 360003',
      latitude: 22.3039,
      longitude: 70.8022,
      contactNumber: '+91 281 2703100',
      officerInCharge: 'Shri Nilesh Patel',
      dailyCapacityQuintals: 11000,
      maxDailyFarmers: 230,
      activeGates: 4,
      currentWaitMinutes: 31,
      openTime: '08:00 AM',
      closeTime: '06:00 PM',
    },
  ];

  for (const c of centersData) {
    await prisma.procurementCenter.create({
      data: c,
    });
  }

  console.log(`🏢 Seeded ${centersData.length} Real-World APMC Procurement Centers.`);

  // 4. Seed Multi-Hour Availability Slots
  const todayStr = '2026-09-15';
  const timeSlots = [
    { start: '08:00 AM', end: '09:00 AM', max: 30, booked: 30, status: 'FULL' },
    { start: '09:00 AM', end: '10:00 AM', max: 30, booked: 18, status: 'FEW_SLOTS' },
    { start: '10:00 AM', end: '11:00 AM', max: 35, booked: 5, status: 'AVAILABLE' },
    { start: '11:00 AM', end: '12:00 PM', max: 30, booked: 26, status: 'FEW_SLOTS' },
    { start: '12:00 PM', end: '01:00 PM', max: 30, booked: 12, status: 'AVAILABLE' },
    { start: '02:00 PM', end: '03:00 PM', max: 30, booked: 9, status: 'AVAILABLE' },
    { start: '03:00 PM', end: '04:00 PM', max: 30, booked: 4, status: 'AVAILABLE' },
    { start: '04:00 PM', end: '05:00 PM', max: 25, booked: 2, status: 'AVAILABLE' },
  ];

  let sonipatWheatSlot10amId = '';

  for (const ts of timeSlots) {
    const slot = await prisma.slot.create({
      data: {
        centerId: 'center-sonipat-main',
        cropId: 'crop-wheat',
        date: todayStr,
        startTime: ts.start,
        endTime: ts.end,
        maxFarmers: ts.max,
        bookedFarmers: ts.booked,
        status: ts.status,
        capacityQuintals: ts.max * 40,
      },
    });

    if (ts.start === '10:00 AM') {
      sonipatWheatSlot10amId = slot.id;
    }
  }

  // Seed slots for all procurement centers
  for (const c of centersData) {
    if (c.id === 'center-sonipat-main') continue; // already seeded above
    for (const ts of timeSlots.slice(0, 5)) {
      await prisma.slot.create({
        data: {
          centerId: c.id,
          cropId: 'crop-wheat',
          date: todayStr,
          startTime: ts.start,
          endTime: ts.end,
          maxFarmers: 30,
          bookedFarmers: Math.floor(Math.random() * 12),
          status: 'AVAILABLE',
          capacityQuintals: 1200,
        },
      });
    }
  }

  console.log('⏰ Seeded multi-time availability slots across centers.');

  // 5. Seed Users & Demo Credentials for all 5 Roles
  // Role 1: Demo Farmer (Ramesh Kumar)
  const farmerUser = await prisma.user.create({
    data: {
      id: 'user-farmer-ramesh',
      phone: '9876543210',
      name: 'Ramesh Kumar',
      email: 'ramesh.farmer@kisansetu.in',
      role: 'FARMER',
      stateId: 'state-hr',
      districtId: 'dist-hr-sonipat',
    },
  });

  const farmerProfile = await prisma.farmer.create({
    data: {
      id: 'farmer-ramesh',
      userId: farmerUser.id,
      farmerId: 'FARM-HR-2026-8819',
      fullName: 'Ramesh Kumar',
      fatherName: 'Shri Ram Swaroop',
      phone: '9876543210',
      stateId: 'state-hr',
      districtId: 'dist-hr-sonipat',
      village: 'Murthal, Sonipat',
      totalLandAcres: 6.5,
      khasraNumber: '142//18/2, 142//19 (MFMB Verified)',
      bankName: 'State Bank of India (Murthal GT Road Branch)',
      accountNumberMasked: 'XXXX-XXXX-4819',
      ifscCode: 'SBIN0001482',
      isVerified: true,
    },
  });

  await prisma.farmerCrop.create({
    data: {
      farmerId: farmerProfile.id,
      cropId: 'crop-wheat',
      cultivatedAreaAcres: 5.0,
      estimatedYieldQuintals: 42.0,
      season: 'Rabi 2026',
      year: 2026,
    },
  });

  // Role 2: Mandi Officer (Dr. Harish Chander)
  await prisma.user.create({
    data: {
      id: 'user-officer-harish',
      phone: '9876500001',
      name: 'Dr. Harish Chander',
      email: 'harish.officer@mandi.gov.in',
      role: 'MANDI_OFFICER',
      stateId: 'state-hr',
      districtId: 'dist-hr-sonipat',
      centerId: 'center-sonipat-main',
    },
  });

  // Role 3: District Admin (Smt. Neha Sharma, IAS)
  await prisma.user.create({
    data: {
      id: 'user-admin-district',
      phone: '9876500002',
      name: 'Smt. Neha Sharma, IAS',
      email: 'dc.sonipat@hry.gov.in',
      role: 'DISTRICT_ADMIN',
      stateId: 'state-hr',
      districtId: 'dist-hr-sonipat',
    },
  });

  // Role 4: State Admin (Shri Rajesh Verma, IAS)
  await prisma.user.create({
    data: {
      id: 'user-admin-state',
      phone: '9876500003',
      name: 'Shri Rajesh Verma, IAS',
      email: 'sec.agri@haryana.gov.in',
      role: 'STATE_ADMIN',
      stateId: 'state-hr',
    },
  });

  // Role 5: Super Admin (National Administrator)
  await prisma.user.create({
    data: {
      id: 'user-admin-super',
      phone: '9876500000',
      name: 'KisanSetu National Administrator',
      email: 'superadmin@kisansetu.gov.in',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('👤 Seeded 5 Role Users.');

  // 6. Create Demo Booking for Ramesh Kumar (WHT-4921)
  const demoBooking = await prisma.booking.create({
    data: {
      id: 'booking-wht-4921',
      bookingToken: 'WHT-4921',
      qrCodeData: JSON.stringify({
        token: 'WHT-4921',
        farmerId: 'FARM-HR-2026-8819',
        farmerName: 'Ramesh Kumar',
        crop: 'Wheat (गेहूं)',
        quantity: 42,
        center: 'Sonipat Central Grain Mandi',
        date: todayStr,
        time: '10:00 AM - 11:00 AM',
        gate: 'Gate 2',
      }),
      farmerId: farmerProfile.id,
      centerId: 'center-sonipat-main',
      slotId: sonipatWheatSlot10amId,
      cropId: 'crop-wheat',
      bookedQuantityQuintals: 42.0,
      vehicleNumber: 'HR-10-AT-7821',
      vehicleType: 'Tractor-Trolley',
      status: 'WEIGHING',
      scheduledDate: '15 September 2026',
      scheduledTime: '10:00 AM - 11:00 AM',
    },
  });

  // Create Queue Entry for Ramesh Kumar (Token #207)
  await prisma.queueEntry.create({
    data: {
      centerId: 'center-sonipat-main',
      bookingId: demoBooking.id,
      tokenNumber: '#207',
      queuePosition: 24,
      stage: 'WEIGHING',
      gateNumber: 'Gate 2',
      estimatedCallTime: '10:42 AM',
      actualEntryTime: new Date(Date.now() - 15 * 60 * 1000),
    },
  });

  // Create Live Queue Entries around #207
  const mockQueueTokens = [
    { token: '#182', stage: 'COMPLETED', pos: 0, time: '09:40 AM' },
    { token: '#183', stage: 'QUALITY_CHECK', pos: 0, time: '09:55 AM' },
    { token: '#184', stage: 'WEIGHING', pos: 1, time: '10:00 AM' }, // Currently Serving
    { token: '#185', stage: 'GATE_ENTRY', pos: 2, time: '10:05 AM' },
    { token: '#186', stage: 'WAITING', pos: 3, time: '10:10 AM' },
    { token: '#187', stage: 'WAITING', pos: 4, time: '10:15 AM' },
    { token: '#190', stage: 'WAITING', pos: 7, time: '10:20 AM' },
    { token: '#195', stage: 'WAITING', pos: 12, time: '10:28 AM' },
    { token: '#200', stage: 'WAITING', pos: 17, time: '10:35 AM' },
  ];

  let qIndex = 1;
  for (const q of mockQueueTokens) {
    const dummyUser = await prisma.user.create({
      data: {
        phone: `987000${1000 + qIndex}`,
        name: `Farmer ${q.token}`,
        role: 'FARMER',
        stateId: 'state-hr',
        districtId: 'dist-hr-sonipat',
      },
    });

    const dummyFarmer = await prisma.farmer.create({
      data: {
        userId: dummyUser.id,
        farmerId: `FARM-HR-${1000 + qIndex}`,
        fullName: `Farmer ${q.token}`,
        phone: dummyUser.phone,
        stateId: 'state-hr',
        districtId: 'dist-hr-sonipat',
        village: 'Murthal / Rai',
        totalLandAcres: 4.5,
      },
    });

    const dummyBooking = await prisma.booking.create({
      data: {
        bookingToken: `WHT-${2000 + qIndex}`,
        qrCodeData: JSON.stringify({ token: `WHT-${2000 + qIndex}` }),
        farmerId: dummyFarmer.id,
        centerId: 'center-sonipat-main',
        slotId: sonipatWheatSlot10amId,
        cropId: 'crop-wheat',
        bookedQuantityQuintals: 38.0,
        status: q.stage,
        scheduledDate: todayStr,
        scheduledTime: '10:00 AM - 11:00 AM',
      },
    });

    await prisma.queueEntry.create({
      data: {
        centerId: 'center-sonipat-main',
        bookingId: dummyBooking.id,
        tokenNumber: q.token,
        queuePosition: q.pos,
        stage: q.stage,
        gateNumber: 'Gate 1',
        estimatedCallTime: q.time,
      },
    });
    qIndex++;
  }

  // 7. Seed Official Procurement Record & DBT Payment Record (MSP ₹2,425 * 42 Qtl = ₹1,01,850)
  const mspRate = 2425;
  const grossAmount = 42.0 * mspRate;
  const moistureDeduction = 0;
  const netAmount = grossAmount - moistureDeduction;

  const procurementRecord = await prisma.procurementRecord.create({
    data: {
      bookingId: demoBooking.id,
      grossWeightQuintals: 58.2,
      tareWeightQuintals: 16.2,
      netWeightQuintals: 42.0,
      moisturePercent: 11.4,
      foreignMatterPercent: 0.4,
      qualityGrade: 'GRADE_A',
      agreedRatePerQuintal: mspRate,
      grossAmount: grossAmount,
      deductionAmount: moistureDeduction,
      netPayableAmount: netAmount,
      jFormNumber: 'J-HR-2026-90412',
      verifiedByOfficer: 'Dr. Harish Chander (Mandi Secretary)',
    },
  });

  await prisma.paymentRecord.create({
    data: {
      procurementId: procurementRecord.id,
      paymentRefNumber: 'DBT-PFMS-HR-2026-89412',
      amount: netAmount,
      status: 'PENDING',
      mode: 'DBT_PFMS',
      bankAccountMasked: 'XXXX-XXXX-4819',
      ifscCode: 'SBIN0001482',
      initiatedAt: new Date(),
    },
  });

  // 8. Seed Multi-Channel Notifications
  const notifications = [
    {
      userId: farmerUser.id,
      farmerId: farmerProfile.id,
      title: 'Slot Confirmed for Wheat Procurement',
      titleHi: 'गेहूं खरीद के लिए स्लॉट कन्फर्म हुआ',
      message: 'Your slot at Sonipat Central Grain Mandi is confirmed for 15 Sep 2026 (10:00 AM - 11:00 AM). Token: WHT-4921.',
      messageHi: 'सोनीपत मुख्य अनाज मंडी में आपका 15 सितंबर 2026 (10:00 पूर्वाह्न - 11:00 पूर्वाह्न) का स्लॉट कन्फर्म हो गया है। टोकन: WHT-4921।',
      channel: 'WHATSAPP',
      type: 'SLOT_CONFIRMATION',
      isRead: true,
      sentAt: new Date(Date.now() - 3600 * 1000 * 24),
    },
    {
      userId: farmerUser.id,
      farmerId: farmerProfile.id,
      title: 'Queue Alert: 23 Farmers Ahead',
      titleHi: 'कतार अलर्ट: आपके आगे 23 किसान हैं',
      message: 'Current serving token is #184. You have token #207. Estimated wait time is ~38 minutes.',
      messageHi: 'वर्तमान सेवारत टोकन #184 है। आपका टोकन #207 है। अनुमानित प्रतीक्षा समय लगभग 38 मिनट है।',
      channel: 'SMS',
      type: 'QUEUE_ALERT',
      isRead: false,
      sentAt: new Date(Date.now() - 1000 * 60 * 10),
    },
    {
      userId: farmerUser.id,
      farmerId: farmerProfile.id,
      title: 'Proceed to Gate 2 Weighbridge',
      titleHi: 'कृपया गेट नंबर 2 वे-ब्रिज पर पहुंचें',
      message: 'Please move your Tractor-Trolley (HR-10-AT-7821) to Gate 2 for gross weighing.',
      messageHi: 'कृपया वजन के लिए अपनी ट्रैक्टर-ट्रॉली (HR-10-AT-7821) को गेट 2 पर ले जाएं।',
      channel: 'PUSH',
      type: 'TURN_APPROACHING',
      isRead: false,
      sentAt: new Date(Date.now() - 1000 * 60 * 2),
    },
    {
      userId: farmerUser.id,
      farmerId: farmerProfile.id,
      title: 'Quality Grade A Approved (11.4% Moisture)',
      titleHi: 'गुणवत्ता ग्रेड A स्वीकृत (11.4% नमी)',
      message: `Moisture content: 11.4% (FAQ standard passed). 42 Quintal Wheat accepted at MSP ₹${mspRate}/Qtl. Total: ₹${netAmount.toLocaleString('en-IN')}.`,
      messageHi: `नमी की मात्रा: 11.4%। 42 क्विंटल गेहूं न्यूनतम समर्थन मूल्य ₹${mspRate}/क्विंटल पर स्वीकृत। कुल राशि: ₹${netAmount.toLocaleString('en-IN')}।`,
      channel: 'APP',
      type: 'QUALITY_PASSED',
      isRead: false,
      sentAt: new Date(),
    },
  ];

  for (const n of notifications) {
    await prisma.notification.create({ data: n });
  }

  console.log('✅ KisanSetu Real-World Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
