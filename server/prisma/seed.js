"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting KisanSetu Database Seed...');
    // Clean existing data
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
    // 1. Seed Crops
    const crops = await Promise.all([
        prisma.crop.create({
            data: {
                id: 'crop-wheat',
                name: 'Wheat',
                hindiName: 'गेहूं',
                category: 'RABI',
                mspRatePerQuintal: 2275,
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
                mspRatePerQuintal: 2300,
                moistureStandardPercent: 17.0,
                iconName: 'Sprout',
            },
        }),
        prisma.crop.create({
            data: {
                id: 'crop-mustard',
                name: 'Mustard',
                hindiName: 'सरसों',
                category: 'RABI',
                mspRatePerQuintal: 5650,
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
                mspRatePerQuintal: 2500,
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
                mspRatePerQuintal: 2090,
                moistureStandardPercent: 14.0,
                iconName: 'Apple',
            },
        }),
        prisma.crop.create({
            data: {
                id: 'crop-cotton',
                name: 'Cotton',
                hindiName: 'कपास',
                category: 'KHARIF',
                mspRatePerQuintal: 7020,
                moistureStandardPercent: 8.5,
                iconName: 'Cloud',
            },
        }),
        prisma.crop.create({
            data: {
                id: 'crop-soybean',
                name: 'Soybean',
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
                hindiName: 'चना',
                category: 'RABI',
                mspRatePerQuintal: 5440,
                moistureStandardPercent: 9.5,
                iconName: 'CircleDot',
            },
        }),
    ]);
    console.log(`🌾 Seeded ${crops.length} Crops with MSPs.`);
    // 2. Seed States & StateConfigs
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
                dailyCapacityLimitQuintals: 85000,
                workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
                requiredDocuments: JSON.stringify(['Meri Fasal Mera Byora ID', 'Aadhaar Card', 'Bank Passbook', 'Land Farad / Jamabandi']),
                supportedCrops: JSON.stringify(['Wheat', 'Paddy / Rice', 'Mustard', 'Bajra (Pearl Millet)', 'Gram / Chana']),
                notificationChannels: JSON.stringify(['SMS', 'WhatsApp', 'Push', 'App']),
                procurementWorkflow: JSON.stringify(['E-Gate Pass', 'Gross Weighbridge', 'Grain Quality Lab', 'Unloading Bay', 'Tare Weighbridge', 'Digital J-Form', 'Direct DBT Payment']),
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
                dailyCapacityLimitQuintals: 110000,
                workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
                requiredDocuments: JSON.stringify(['Anaaj Kharid Portal ID', 'Aadhaar Card', 'Bank Passbook', 'Khasra Girdawari']),
                supportedCrops: JSON.stringify(['Wheat', 'Paddy / Rice', 'Cotton', 'Maize']),
                notificationChannels: JSON.stringify(['SMS', 'WhatsApp', 'Push', 'App']),
                procurementWorkflow: JSON.stringify(['Mandi Entry Verification', 'Weighing', 'Quality Inspection', 'J-Form Generation', 'Direct Payout']),
                maxAdvanceBookingDays: 7,
                emergencySlotQuotaPercent: 10,
                seasonName: 'Paddy & Wheat Kharid 2026',
            },
            districts: [
                { id: 'dist-pb-ludhiana', name: 'Ludhiana', hindiName: 'लुधियाना', code: 'LDH' },
                { id: 'dist-pb-patiala', name: 'Patiala', hindiName: 'पटियाला', code: 'PTL' },
                { id: 'dist-pb-amritsar', name: 'Amritsar', hindiName: 'अमृतसर', code: 'ASR' },
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
                dailyCapacityLimitQuintals: 125000,
                workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
                requiredDocuments: JSON.stringify(['FCS UP Farmer Token', 'Aadhaar Card', 'Khatauni / Land Record', 'Bank Account Details']),
                supportedCrops: JSON.stringify(['Wheat', 'Paddy / Rice', 'Maize', 'Mustard', 'Gram / Chana']),
                notificationChannels: JSON.stringify(['SMS', 'WhatsApp', 'App']),
                procurementWorkflow: JSON.stringify(['Token Verification', 'Electronic Weighing', 'Moisture Test', 'Kharid Receipt', 'PFMS Transfer']),
                maxAdvanceBookingDays: 5,
                emergencySlotQuotaPercent: 12,
                seasonName: 'UP Rabi-Kharif Procurement 2026',
            },
            districts: [
                { id: 'dist-up-aligarh', name: 'Aligarh', hindiName: 'अलीगढ़', code: 'ALG' },
                { id: 'dist-up-mathura', name: 'Mathura', hindiName: 'मथुरा', code: 'MTR' },
                { id: 'dist-up-meerut', name: 'Meerut', hindiName: 'मेरठ', code: 'MRT' },
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
                dailyCapacityLimitQuintals: 95000,
                workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
                requiredDocuments: JSON.stringify(['e-Uparjan Registration Code', 'Samagra ID', 'Aadhaar Card', 'Bhu-Abhilekh']),
                supportedCrops: JSON.stringify(['Wheat', 'Gram / Chana', 'Soybean', 'Mustard']),
                notificationChannels: JSON.stringify(['SMS', 'Push', 'App']),
                procurementWorkflow: JSON.stringify(['Slot Gate Scan', 'Quality Sampling', 'Weight Slip', 'E-Payment Dispatch']),
                maxAdvanceBookingDays: 6,
                emergencySlotQuotaPercent: 20,
                seasonName: 'e-Uparjan Rabi-Kharif 2026',
            },
            districts: [
                { id: 'dist-mp-sehore', name: 'Sehore', hindiName: 'सीहोर', code: 'SHR' },
                { id: 'dist-mp-indore', name: 'Indore', hindiName: 'इंदौर', code: 'IND' },
                { id: 'dist-mp-ujjain', name: 'Ujjain', hindiName: 'उज्जैन', code: 'UJN' },
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
                dailyCapacityLimitQuintals: 70000,
                workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
                requiredDocuments: JSON.stringify(['Jan Aadhaar Card', 'Girdawari Copy', 'Bank Account Verification']),
                supportedCrops: JSON.stringify(['Mustard', 'Bajra (Pearl Millet)', 'Wheat', 'Gram / Chana', 'Soybean']),
                notificationChannels: JSON.stringify(['SMS', 'WhatsApp', 'App']),
                procurementWorkflow: JSON.stringify(['Jan Aadhaar Verification', 'Weighing', 'Quality Analysis', 'Raj-Kharid Payout']),
                maxAdvanceBookingDays: 7,
                emergencySlotQuotaPercent: 10,
                seasonName: 'Raj-Kharid Season 2026',
            },
            districts: [
                { id: 'dist-rj-ganganagar', name: 'Sri Ganganagar', hindiName: 'श्री गंगानगर', code: 'SGN' },
                { id: 'dist-rj-kota', name: 'Kota', hindiName: 'कोटा', code: 'KTA' },
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
                dailyCapacityLimitQuintals: 80000,
                workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday',
                requiredDocuments: JSON.stringify(['7/12 Utara (7/12 उतारा)', 'Aadhaar Card', 'Bank Passbook']),
                supportedCrops: JSON.stringify(['Soybean', 'Cotton', 'Paddy / Rice', 'Gram / Chana']),
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
                dailyCapacityLimitQuintals: 75000,
                workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
                requiredDocuments: JSON.stringify(['i-Khedut Registration', '7/12 and 8A Extracts', 'Aadhaar Card', 'Bank Cancelled Cheque']),
                supportedCrops: JSON.stringify(['Cotton', 'Mustard', 'Bajra (Pearl Millet)', 'Wheat']),
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
                dailyCapacityLimitQuintals: 65000,
                workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
                requiredDocuments: JSON.stringify(['FRUITS ID (FID)', 'Aadhaar Card', 'RTC Land Record', 'Bank Account Link']),
                supportedCrops: JSON.stringify(['Paddy / Rice', 'Maize', 'Cotton', 'Gram / Chana']),
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
                dailyCapacityLimitQuintals: 70000,
                workingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
                requiredDocuments: JSON.stringify(['Uzhavan App Reg Number', 'Patta / Chitta', 'Aadhaar Card', 'Bank Passbook']),
                supportedCrops: JSON.stringify(['Paddy / Rice', 'Cotton', 'Maize']),
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
    console.log(`🏛️ Seeded 9 States, State Configurations, and Districts.`);
    // 3. Seed Procurement Centers
    const centersData = [
        // Haryana - Sonipat
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
            dailyCapacityQuintals: 7500,
            maxDailyFarmers: 180,
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
            dailyCapacityQuintals: 5200,
            maxDailyFarmers: 130,
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
            dailyCapacityQuintals: 4800,
            maxDailyFarmers: 110,
            activeGates: 2,
            currentWaitMinutes: 52,
            openTime: '08:00 AM',
            closeTime: '06:00 PM',
        },
        // Haryana - Karnal & Panipat
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
            dailyCapacityQuintals: 9000,
            maxDailyFarmers: 220,
            activeGates: 4,
            currentWaitMinutes: 45,
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
            dailyCapacityQuintals: 6500,
            maxDailyFarmers: 150,
            activeGates: 3,
            currentWaitMinutes: 84,
            openTime: '08:00 AM',
            closeTime: '06:30 PM',
        },
        // Punjab - Ludhiana
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
            dailyCapacityQuintals: 15000,
            maxDailyFarmers: 350,
            activeGates: 6,
            currentWaitMinutes: 30,
            openTime: '07:00 AM',
            closeTime: '07:30 PM',
        },
        // UP - Aligarh
        {
            id: 'center-aligarh-main',
            name: 'Aligarh Krishi Upaj Mandi Samiti',
            hindiName: 'अलीगढ़ कृषि उपज मंडी समिति',
            code: 'UP-ALG-001',
            stateId: 'state-up',
            districtId: 'dist-up-aligarh',
            address: 'Dhaniapur, GT Road, Aligarh, UP 202002',
            latitude: 27.8974,
            longitude: 78.088,
            contactNumber: '+91 571 2701100',
            officerInCharge: 'Shri Devendra Kumar',
            dailyCapacityQuintals: 7000,
            maxDailyFarmers: 160,
            activeGates: 3,
            currentWaitMinutes: 40,
            openTime: '08:00 AM',
            closeTime: '06:00 PM',
        },
        // MP - Sehore
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
            dailyCapacityQuintals: 8000,
            maxDailyFarmers: 200,
            activeGates: 4,
            currentWaitMinutes: 28,
            openTime: '08:00 AM',
            closeTime: '06:00 PM',
        },
        // Rajasthan - Kota
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
            dailyCapacityQuintals: 7200,
            maxDailyFarmers: 175,
            activeGates: 3,
            currentWaitMinutes: 35,
            openTime: '08:30 AM',
            closeTime: '06:30 PM',
        },
    ];
    for (const c of centersData) {
        await prisma.procurementCenter.create({
            data: c,
        });
    }
    console.log(`🏢 Seeded ${centersData.length} Procurement Centers with live status.`);
    // 4. Seed Slots for Sonipat & Other Centers for Today and Tomorrow
    const todayStr = '2026-09-15'; // Demo calendar date matching requirements
    const timeSlots = [
        { start: '08:00 AM', end: '09:00 AM', max: 25, booked: 25, status: 'FULL' },
        { start: '09:00 AM', end: '10:00 AM', max: 25, booked: 13, status: 'FEW_SLOTS' },
        { start: '10:00 AM', end: '11:00 AM', max: 30, booked: 3, status: 'AVAILABLE' },
        { start: '11:00 AM', end: '12:00 PM', max: 25, booked: 22, status: 'FEW_SLOTS' },
        { start: '12:00 PM', end: '01:00 PM', max: 25, booked: 10, status: 'AVAILABLE' },
        { start: '02:00 PM', end: '03:00 PM', max: 25, booked: 8, status: 'AVAILABLE' },
        { start: '03:00 PM', end: '04:00 PM', max: 25, booked: 5, status: 'AVAILABLE' },
        { start: '04:00 PM', end: '05:00 PM', max: 20, booked: 2, status: 'AVAILABLE' },
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
    // Also seed tomorrow slots
    const tomorrowStr = '2026-09-16';
    for (const ts of timeSlots) {
        await prisma.slot.create({
            data: {
                centerId: 'center-sonipat-main',
                cropId: 'crop-wheat',
                date: tomorrowStr,
                startTime: ts.start,
                endTime: ts.end,
                maxFarmers: ts.max,
                bookedFarmers: Math.floor(ts.booked / 2),
                status: 'AVAILABLE',
                capacityQuintals: ts.max * 40,
            },
        });
    }
    // Seed Paddy slots for Gohana & Khanna
    for (const ts of timeSlots.slice(0, 5)) {
        await prisma.slot.create({
            data: {
                centerId: 'center-gohana',
                cropId: 'crop-wheat',
                date: todayStr,
                startTime: ts.start,
                endTime: ts.end,
                maxFarmers: 20,
                bookedFarmers: 6,
                status: 'AVAILABLE',
                capacityQuintals: 800,
            },
        });
        await prisma.slot.create({
            data: {
                centerId: 'center-khanna-main',
                cropId: 'crop-paddy',
                date: todayStr,
                startTime: ts.start,
                endTime: ts.end,
                maxFarmers: 35,
                bookedFarmers: 12,
                status: 'AVAILABLE',
                capacityQuintals: 1500,
            },
        });
    }
    console.log('⏰ Seeded multi-time availability slots.');
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
            village: 'Murthal',
            totalLandAcres: 6.5,
            khasraNumber: '142//18/2, 142//19',
            bankName: 'State Bank of India (Murthal Branch)',
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
    // Role 3: District Admin (Smt. Neha Sharma)
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
    // Role 4: State Admin (Shri Rajesh Verma)
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
    console.log('👤 Seeded 5 Role Users (Farmer, Mandi Officer, District Admin, State Admin, Super Admin).');
    // 6. Create Demo Booking for Ramesh Kumar (WHT-4921)
    const demoBooking = await prisma.booking.create({
        data: {
            id: 'booking-wht-4921',
            bookingToken: 'WHT-4921',
            qrCodeData: JSON.stringify({
                token: 'WHT-4921',
                farmerId: 'FARM-HR-2026-8819',
                farmerName: 'Ramesh Kumar',
                crop: 'Wheat',
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
    // Create Queue Entry for Ramesh Kumar (Token #207, Position in line)
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
    // Seed supplementary bookings for realistic queue
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
                village: 'Rai / Murthal',
                totalLandAcres: 4.0,
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
                bookedQuantityQuintals: 35.0,
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
    // 7. Seed Procurement Record & Payment Record for Ramesh Kumar
    const grossAmount = 42.0 * 2275; // ₹95,550
    const moistureDeduction = 0; // standard moisture
    const netAmount = grossAmount - moistureDeduction;
    const procurementRecord = await prisma.procurementRecord.create({
        data: {
            bookingId: demoBooking.id,
            grossWeightQuintals: 58.2, // vehicle + wheat
            tareWeightQuintals: 16.2, // tractor weight
            netWeightQuintals: 42.0,
            moisturePercent: 11.4,
            foreignMatterPercent: 0.4,
            qualityGrade: 'GRADE_A',
            agreedRatePerQuintal: 2275.0,
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
    // 8. Seed Notifications for Ramesh Kumar
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
            title: 'Quality Grade A Approved',
            titleHi: 'गुणवत्ता ग्रेड A स्वीकृत',
            message: 'Moisture content: 11.4% (FAQ passed). 42 Quintal Wheat accepted at MSP ₹2,275/Qtl. Total: ₹95,550.',
            messageHi: 'नमी की मात्रा: 11.4%। 42 क्विंटल गेहूं न्यूनतम समर्थन मूल्य ₹2,275/क्विंटल पर स्वीकृत। कुल राशि: ₹95,550।',
            channel: 'APP',
            type: 'QUALITY_PASSED',
            isRead: false,
            sentAt: new Date(),
        },
    ];
    for (const n of notifications) {
        await prisma.notification.create({ data: n });
    }
    console.log('🔔 Seeded multi-channel demo notifications.');
    console.log('✅ KisanSetu Database Seed Completed Successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
