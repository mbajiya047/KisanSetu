export type Language = 'en' | 'hi' | 'pa' | 'mr' | 'gu' | 'bn' | 'ta' | 'te' | 'kn' | 'ml' | 'or';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ (Coming Soon)' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी (Coming Soon)' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી (Coming Soon)' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা (Coming Soon)' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ் (Coming Soon)' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు (Coming Soon)' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ (Coming Soon)' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം (Coming Soon)' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ (Coming Soon)' },
];

export const translations = {
  en: {
    // Brand
    brandName: 'KisanSetu',
    brandTagline: 'Common India-wide Agricultural Procurement & Queue Management Platform',
    sihBadge: 'Smart India Hackathon 2026 • Problem ID 26032',
    govHeader: 'Unified Farmer Procurement Portal | Government of India Standard',

    // Navigation
    navHome: 'Home',
    navStates: 'States',
    navCenters: 'Procurement Centers',
    navMandiStatus: 'Mandi Status',
    navHelp: 'Help & FAQ',
    navDashboard: 'Dashboard',
    navBookSlot: 'Book Slot',
    navLiveQueue: 'Live Queue',
    navProcurement: 'My Procurement',
    navNotifications: 'Notifications',
    navLogin: 'Login / Sign In',
    navLogout: 'Logout',

    // Hero
    heroTitle: 'Sell Your Crop Without Waiting in Long Queues',
    heroSubtitle: 'Register your crop, book a procurement slot, track your live queue position, and receive transparent DBT payments from one unified platform.',
    heroBtnBook: 'Book Procurement Slot',
    heroBtnTrack: 'Track My Procurement',
    heroTryDemo: 'Try Demo Mode (Instant Access)',

    // Farmer 4 Main Actions
    actionBookSlot: 'Book Slot',
    actionBookSlotDesc: 'Reserve date & time at nearest mandi',
    actionTrackToken: 'Track Token',
    actionTrackTokenDesc: 'Check live queue position & wait time',
    actionMandiStatus: 'Mandi Status',
    actionMandiStatusDesc: 'Real-time queue load across India',
    actionMyProcurement: 'My Procurement',
    actionMyProcurementDesc: 'Digital J-Form & DBT payment status',

    // Quick Search
    quickSearchTitle: 'Find Procurement Center',
    quickSearchSubtitle: 'Select your state, district and crop to view live queue, waiting time and available slots',
    selectState: 'Select State',
    selectDistrict: 'Select District',
    selectCrop: 'Select Crop',
    btnFindCenters: 'Find Procurement Centers',
    distance: 'Distance',
    currentQueue: 'Current Queue',
    estimatedWait: 'Estimated Waiting',
    availableSlots: 'Available Slots',
    btnViewSlots: 'View Slots',
    farmers: 'farmers',
    min: 'min',

    // How it works
    howItWorksTitle: 'How KisanSetu Works',
    howItWorksSubtitle: 'From crop registration to direct bank payment in 6 transparent steps',
    step1Title: '1. Farmer Registration',
    step1Desc: 'Quick mobile OTP sign-in and verified land & crop details.',
    step2Title: '2. Select Crop & Quantity',
    step2Desc: 'Choose harvested crop with estimated quintal yield.',
    step3Title: '3. Book Mandi Slot',
    step3Desc: 'Smart recommendation suggests shortest wait times.',
    step4Title: '4. Digital QR Token',
    step4Desc: 'Instant digital gate pass sent via SMS & WhatsApp.',
    step5Title: '5. Track Live Queue',
    step5Desc: 'Live position ticker ensures arrival at exact call time.',
    step6Title: '6. J-Form & DBT Payout',
    step6Desc: 'Weighing, quality check & automated direct bank transfer.',

    // State Configuration Engine
    stateEngineTitle: 'One Platform Across India',
    stateEngineSubtitle: 'Dynamic State Configuration Engine allows different states to run customized procurement rules, slot durations, documents, and notifications while farmers enjoy a uniform, effortless experience.',
    centralizedMode: 'Centralized Procurement',
    hybridMode: 'Hybrid Procurement',
    decentralizedMode: 'Decentralized Procurement',

    // Stats
    statStates: 'States Supported',
    statCenters: 'Procurement Centers',
    statFarmers: 'Farmers Served',
    statWaitTime: 'Avg. Waiting Time (Reduced from 8h)',

    // Smart Recommendation
    recommendedCenter: 'Recommended Procurement Center',
    recommendationReason: 'Reason for Recommendation',
    bookRecommended: 'Book Recommended Slot',

    // Live Queue
    liveQueueTitle: 'Live Mandi Queue Board',
    currentlyServing: 'Currently Serving',
    yourToken: 'Your Token',
    farmersAhead: 'Farmers Ahead of You',
    estimatedWaitTime: 'Estimated Waiting Time',
    queueProgressBar: 'Live Queue Progress',
    lastUpdated: 'Last Updated',
    stageWaiting: 'Waiting',
    stageGateEntry: 'Gate Entry',
    stageWeighing: 'Gross Weighing',
    stageQualityCheck: 'Quality & Moisture Lab',
    stageCompleted: 'Procured & J-Form Issued',
    stageNoShow: 'No Show',

    // Farmer Dashboard
    goodMorning: 'Good Day',
    upcomingSlot: 'Your Upcoming Slot',
    myCrop: 'My Registered Crop',
    procurementProgress: 'Procurement Progress',
    tokenNumber: 'Token Code',
    viewLiveQueue: 'View Live Queue',
    quintal: 'Quintal',
    viewAllBookings: 'View All Bookings',

    // Slot Booking Wizard
    bookingStep1: '1. Crop & Quantity',
    bookingStep2: '2. Procurement Center',
    bookingStep3: '3. Date & Time Slot',
    bookingStep4: '4. Confirmation',
    slotAvailable: 'Available',
    slotFew: 'Few Slots Left',
    slotFull: 'Full',
    btnConfirmBooking: 'Confirm & Generate Digital Token',

    // J-Form & Procurement Tracking
    jFormReceipt: 'Digital J-Form & Procurement Receipt',
    grossWeight: 'Gross Weight',
    tareWeight: 'Tare Weight',
    netWeight: 'Net Weight',
    moistureContent: 'Moisture Content',
    mspRate: 'MSP Rate / Quintal',
    totalPayout: 'Total Expected Payout',
    paymentStatus: 'Payment Status',
    paymentPending: 'Payment Pending',
    paymentInitiated: 'DBT Transfer Initiated',
    paymentProcessed: 'Credited to Bank Account',

    // Admin & Roles
    officerDashboard: 'Mandi Officer Cockpit',
    callNextFarmer: 'Call Next Farmer',
    pauseQueue: 'Pause Queue',
    resumeQueue: 'Resume Queue',
    addEmergencySlot: 'Add Emergency Slot',
    todayFarmers: 'Today\'s Total Farmers',
    completed: 'Completed',
    waiting: 'Waiting',
    noShows: 'No Shows',
    mandiCapacity: 'Mandi Capacity',

    districtAdmin: 'District Administration',
    stateAdmin: 'State Procurement Administration',
    superAdmin: 'National Super Admin',
  },
  hi: {
    // Brand
    brandName: 'किसानसेतु',
    brandTagline: 'अखिल भारतीय एकीकृत कृषि खरीद शेड्यूलिंग एवं कतार प्रबंधन प्रणाली',
    sihBadge: 'स्मार्ट इंडिया हैकथॉन 2026 • समस्या कोड 26032',
    govHeader: 'एकीकृत किसान खरीद पोर्टल | भारत सरकार मानक',

    // Navigation
    navHome: 'होम',
    navStates: 'राज्य',
    navCenters: 'खरीद केंद्र / मंडियां',
    navMandiStatus: 'मंडी स्थिति',
    navHelp: 'सहायता एवं सवाल',
    navDashboard: 'डैशबोर्ड',
    navBookSlot: 'स्लॉट बुक करें',
    navLiveQueue: 'लाइव कतार',
    navProcurement: 'मेरी खरीद स्थिति',
    navNotifications: 'सूचनाएं',
    navLogin: 'लॉग इन / साइन इन',
    navLogout: 'लॉग आउट',

    // Hero
    heroTitle: 'लंबी कतारों में बिना रुके अपनी फसल बेचें',
    heroSubtitle: 'अपनी फसल पंजीकृत करें, खरीद स्लॉट बुक करें, अपनी कतार की स्थिति ट्रैक करें और सीधे बैंक खाते में भुगतान प्राप्त करें।',
    heroBtnBook: 'खरीद स्लॉट बुक करें',
    heroBtnTrack: 'मेरी खरीद ट्रैक करें',
    heroTryDemo: 'डेमो मोड चलाएं (तुरंत परीक्षण)',

    // Farmer 4 Main Actions
    actionBookSlot: 'स्लॉट बुक करें',
    actionBookSlotDesc: 'निकटतम मंडी में तारीख व समय चुनें',
    actionTrackToken: 'टोकन ट्रैक करें',
    actionTrackTokenDesc: 'लाइव कतार और प्रतीक्षा समय देखें',
    actionMandiStatus: 'मंडी स्थिति',
    actionMandiStatusDesc: 'देशभर की मंडियों की ताजा भीड़ स्थिति',
    actionMyProcurement: 'मेरी खरीद',
    actionMyProcurementDesc: 'डिजिटल जे-फॉर्म और डीबीटी भुगतान',

    // Quick Search
    quickSearchTitle: 'खरीद केंद्र खोजें',
    quickSearchSubtitle: 'लाइव कतार, प्रतीक्षा समय और उपलब्ध स्लॉट देखने के लिए राज्य, जिला और फसल चुनें',
    selectState: 'राज्य चुनें',
    selectDistrict: 'जिला चुनें',
    selectCrop: 'फसल चुनें',
    btnFindCenters: 'खरीद केंद्र खोजें',
    distance: 'दूरी',
    currentQueue: 'वर्तमान कतार',
    estimatedWait: 'अनुमानित प्रतीक्षा',
    availableSlots: 'उपलब्ध स्लॉट',
    btnViewSlots: 'स्लॉट देखें',
    farmers: 'किसान',
    min: 'मिनट',

    // How it works
    howItWorksTitle: 'किसानसेतु कैसे काम करता है?',
    howItWorksSubtitle: 'फसल पंजीकरण से लेकर बैंक खाते में भुगतान तक 6 आसान चरण',
    step1Title: '1. किसान पंजीकरण',
    step1Desc: 'मोबाइल ओटीपी से सुरक्षित लॉगिन और भूमि विवरण।',
    step2Title: '2. फसल एवं मात्रा का चयन',
    step2Desc: 'अपनी उपज और मात्रा (क्विंटल) दर्ज करें।',
    step3Title: '3. मंडी स्लॉट बुकिंग',
    step3Desc: 'स्मार्ट सिस्टम न्यूनतम प्रतीक्षा समय वाला केंद्र सुझाता है।',
    step4Title: '4. डिजिटल क्यूआर टोकन',
    step4Desc: 'एसएमएस और व्हाट्सएप पर तुरंत टोकन प्राप्त करें।',
    step5Title: '5. लाइव कतार ट्रैकिंग',
    step5Desc: 'मंडी में अपनी बारी आने के सही समय पर पहुंचे।',
    step6Title: '6. जे-फॉर्म और डीबीटी भुगतान',
    step6Desc: 'सटीक वजन, गुणवत्ता जांच और सीधे खाते में पैसा।',

    // State Configuration Engine
    stateEngineTitle: 'संपूर्ण भारत के लिए एक साझा मंच',
    stateEngineSubtitle: 'स्टेट कॉन्फ़िगरेशन इंजन के माध्यम से प्रत्येक राज्य अपने नियम, स्लॉट अवधि और दस्तावेज़ तय कर सकता है, जबकि किसानों को एक सरल और एकसमान अनुभव मिलता है।',
    centralizedMode: 'केंद्रीकृत खरीद',
    hybridMode: 'हाइब्रिड खरीद',
    decentralizedMode: 'विकेंद्रीकृत खरीद',

    // Stats
    statStates: 'शामिल राज्य',
    statCenters: 'सक्रिय खरीद केंद्र',
    statFarmers: 'पंजीकृत किसान',
    statWaitTime: 'औसत प्रतीक्षा समय (8 घंटे से घटाकर)',

    // Smart Recommendation
    recommendedCenter: 'अनुशंसित खरीद केंद्र (स्मार्ट सुझाव)',
    recommendationReason: 'सुझाव का कारण',
    bookRecommended: 'सुझाया गया स्लॉट बुक करें',

    // Live Queue
    liveQueueTitle: 'लाइव मंडी कतार बोर्ड',
    currentlyServing: 'वर्तमान में सेवारत टोकन',
    yourToken: 'आपका टोकन',
    farmersAhead: 'आपसे आगे किसान',
    estimatedWaitTime: 'अनुमानित प्रतीक्षा समय',
    queueProgressBar: 'लाइव कतार प्रगति',
    lastUpdated: 'अंतिम अपडेट',
    stageWaiting: 'प्रतीक्षारत',
    stageGateEntry: 'गेट प्रवेश',
    stageWeighing: 'सकल वजन (वे-ब्रिज)',
    stageQualityCheck: 'गुणवत्ता व नमी जांच',
    stageCompleted: 'खरीद संपन्न एवं जे-फॉर्म जारी',
    stageNoShow: 'अनुपस्थित',

    // Farmer Dashboard
    goodMorning: 'नमस्ते',
    upcomingSlot: 'आपका आगामी स्लॉट',
    myCrop: 'मेरी पंजीकृत फसल',
    procurementProgress: 'खरीद प्रगति स्थिति',
    tokenNumber: 'टोकन संख्या',
    viewLiveQueue: 'लाइव कतार देखें',
    quintal: 'क्विंटल',
    viewAllBookings: 'सभी बुकिंग देखें',

    // Slot Booking Wizard
    bookingStep1: '1. फसल और मात्रा',
    bookingStep2: '2. खरीद केंद्र का चयन',
    bookingStep3: '3. दिनांक और समय स्लॉट',
    bookingStep4: '4. पुष्टि एवं टोकन',
    slotAvailable: 'उपलब्ध',
    slotFew: 'कुछ ही स्लॉट शेष',
    slotFull: 'भर चुका है',
    btnConfirmBooking: 'पुष्टि करें और डिजिटल टोकन बनाएं',

    // J-Form & Procurement Tracking
    jFormReceipt: 'डिजिटल जे-फॉर्म एवं खरीद रसीद',
    grossWeight: 'सकल वजन (गाड़ी सहित)',
    tareWeight: 'खाली गाड़ी का वजन',
    netWeight: 'शुद्ध फसल वजन',
    moistureContent: 'नमी प्रतिशत',
    mspRate: 'न्यूनतम समर्थन मूल्य (MSP)',
    totalPayout: 'कुल देय राशि',
    paymentStatus: 'भुगतान स्थिति',
    paymentPending: 'भुगतान प्रक्रियाधीन',
    paymentInitiated: 'डीबीटी ट्रांसफर शुरू हुआ',
    paymentProcessed: 'बैंक खाते में जमा हुआ',

    // Admin & Roles
    officerDashboard: 'मंडी अधिकारी नियंत्रण कक्ष',
    callNextFarmer: 'अगले किसान को बुलाएं',
    pauseQueue: 'कतार रोकें',
    resumeQueue: 'कतार पुनः शुरू करें',
    addEmergencySlot: 'आपातकालीन स्लॉट जोड़ें',
    todayFarmers: 'आज के कुल किसान',
    completed: 'संपन्न',
    waiting: 'प्रतीक्षारत',
    noShows: 'अनुपस्थित',
    mandiCapacity: 'मंडी क्षमता उपयोग',

    districtAdmin: 'जिला प्रशासन डैशबोर्ड',
    stateAdmin: 'राज्य खरीद प्रशासन',
    superAdmin: 'राष्ट्रीय सुपर एडमिन',
  },
};
