import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

// Language translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    market: 'Market',
    equipmentRental: 'Equipment Rental',
    community: 'Community',
    contact: 'Contact',
    login: 'Login',
    searchPlaceholder: 'Search crops or equip',
    
    // Landing Page
    heroTitle: 'Direct connection between farmers & buyers. Fair prices. No middlemen.',
    heroSubtitle: 'Empowering farmers, supporting buyers.',
    farmerButton: 'I am a Farmer 👨‍🌾',
    buyerButton: 'I am a Buyer 🛒',
    equipmentButton: 'Rent Equipment 🚜',
    farmerDescription: 'I am a Farmer: Sell crops directly, access fair prices, and rent machinery at affordable rates.',
    buyerDescription: 'I am a Buyer: Buy fresh produce, bid transparently, and support local farmers.',
    
    // Benefits
    whyAgriConnect: 'Why AgriConnect?',
    forFarmers: 'For Farmers',
    forFarmersDesc: 'Sell directly to buyers, get better prices, avoid middlemen.',
    forBuyers: 'For Buyers',
    forBuyersDesc: 'Buy fresh produce, transparent pricing, support farmers.',
    forCommunity: 'For Community',
    forCommunityDesc: 'Farmers can collaborate, share equipment, and support each other.',
    
    // How it works
    howItWorks: 'How It Works',
    step1: 'Step 1',
    step1Desc: 'Farmer lists crops.',
    step2: 'Step 2',
    step2Desc: 'Buyers place bids.',
    step3: 'Step 3',
    step3Desc: 'Deal is finalized.',
    step4: 'Step 4',
    step4Desc: 'Rent or borrow equipment from nearby farmers.',
    
    // Area Selector
    setYourArea: 'Set Your Area',
    areaSubtitle: 'Choose the distance around your location to find buyers, sellers, and rentals.',
    location: 'Location',
    autoDetectLocation: 'Auto-detect Current Location',
    detectingLocation: 'Detecting Location...',
    or: 'or',
    manualLocationPlaceholder: 'Enter your location manually (e.g., Mumbai, Maharashtra)',
    setLocation: 'Set Location',
    change: 'Change',
    searchRadius: 'Search Radius',
    currentSettings: 'Current Settings',
    locationLabel: 'Location:',
    radiusLabel: 'Radius:',
    areaFilterNote: '✓ This area will be used to filter listings across all pages',
    
    // Equipment Rental
    equipmentRental: 'Equipment Rental',
    equipmentSubtitle: 'Rent farm equipment. Pay with money or barter options.',
    addEquipment: 'Add Equipment',
    showBarterOnly: 'Show only barter-available equipment',
    requestRental: 'Request Rental',
    rent: 'Rent:',
    barter: 'Barter:',
    barterAvailable: 'Available (produce/services)',
    barterNotAvailable: 'Not available',
    noEquipmentFound: 'No equipment found',
    loading: 'Loading...',
    
    // Add Equipment Modal
    addEquipmentTitle: 'Add Equipment',
    equipmentName: 'Equipment Name',
    equipmentNamePlaceholder: 'e.g., Tractor, Rotavator, Irrigation Pump',
    contactNumber: 'Contact Number',
    contactPlaceholder: '+91 98765 43210',
    rentalPrice: 'Rental Price (per day)',
    pricePlaceholder: '1500',
    addressLocation: 'Address/Location',
    locationPlaceholder: 'City, State',
    barterAvailable: 'Barter available (produce/services)',
    equipmentPhoto: 'Equipment Photo',
    clickToUpload: 'Click to upload photo',
    fileFormat: 'PNG, JPG up to 5MB',
    cancel: 'Cancel',
    addEquipmentButton: 'Add Equipment',
    
    // Farmer Dashboard
    myListings: 'My Listings',
    sell: 'Sell',
    setLocationPrompt: 'Set your location to see nearby buyers and equipment',
    goToHomePage: 'Go to the Home page to set your area radius',
    noListingsYet: 'No listings yet. Use Sell to add one.',
    
    // Common
    required: 'Required',
    error: 'Error',
    success: 'Success',
    close: 'Close',
    submit: 'Submit',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No'
  },
  
  hi: {
    // Navigation
    home: 'होम',
    market: 'बाजार',
    equipmentRental: 'उपकरण किराया',
    community: 'समुदाय',
    contact: 'संपर्क',
    login: 'लॉगिन',
    searchPlaceholder: 'फसल या उपकरण खोजें',
    
    // Landing Page
    heroTitle: 'किसानों और खरीदारों के बीच सीधा संपर्क। उचित मूल्य। बिचौलियों के बिना।',
    heroSubtitle: 'किसानों को सशक्त बनाना, खरीदारों का समर्थन करना।',
    farmerButton: 'मैं एक किसान हूं 👨‍🌾',
    buyerButton: 'मैं एक खरीदार हूं 🛒',
    equipmentButton: 'उपकरण किराया 🚜',
    farmerDescription: 'मैं एक किसान हूं: फसलों को सीधे बेचें, उचित मूल्य प्राप्त करें, और किफायती दरों पर मशीनरी किराए पर लें।',
    buyerDescription: 'मैं एक खरीदार हूं: ताजी उपज खरीदें, पारदर्शी बोली लगाएं, और स्थानीय किसानों का समर्थन करें।',
    
    // Benefits
    whyAgriConnect: 'AgriConnect क्यों?',
    forFarmers: 'किसानों के लिए',
    forFarmersDesc: 'खरीदारों को सीधे बेचें, बेहतर मूल्य प्राप्त करें, बिचौलियों से बचें।',
    forBuyers: 'खरीदारों के लिए',
    forBuyersDesc: 'ताजी उपज खरीदें, पारदर्शी मूल्य निर्धारण, किसानों का समर्थन करें।',
    forCommunity: 'समुदाय के लिए',
    forCommunityDesc: 'किसान सहयोग कर सकते हैं, उपकरण साझा कर सकते हैं, और एक-दूसरे का समर्थन कर सकते हैं।',
    
    // How it works
    howItWorks: 'यह कैसे काम करता है',
    step1: 'चरण 1',
    step1Desc: 'किसान फसलों की सूची बनाता है।',
    step2: 'चरण 2',
    step2Desc: 'खरीदार बोली लगाते हैं।',
    step3: 'चरण 3',
    step3Desc: 'सौदा पूरा होता है।',
    step4: 'चरण 4',
    step4Desc: 'पास के किसानों से उपकरण किराए पर लें या उधार लें।',
    
    // Area Selector
    setYourArea: 'अपना क्षेत्र सेट करें',
    areaSubtitle: 'खरीदारों, विक्रेताओं और किराए के लिए अपने स्थान के आसपास की दूरी चुनें।',
    location: 'स्थान',
    autoDetectLocation: 'वर्तमान स्थान का स्वचालित पता लगाएं',
    detectingLocation: 'स्थान का पता लगाया जा रहा है...',
    or: 'या',
    manualLocationPlaceholder: 'अपना स्थान मैन्युअल रूप से दर्ज करें (जैसे, मुंबई, महाराष्ट्र)',
    setLocation: 'स्थान सेट करें',
    change: 'बदलें',
    searchRadius: 'खोज त्रिज्या',
    currentSettings: 'वर्तमान सेटिंग्स',
    locationLabel: 'स्थान:',
    radiusLabel: 'त्रिज्या:',
    areaFilterNote: '✓ यह क्षेत्र सभी पृष्ठों पर सूचियों को फ़िल्टर करने के लिए उपयोग किया जाएगा',
    
    // Equipment Rental
    equipmentRental: 'उपकरण किराया',
    equipmentSubtitle: 'कृषि उपकरण किराए पर लें। पैसे या वस्तु विनिमय विकल्पों से भुगतान करें।',
    addEquipment: 'उपकरण जोड़ें',
    showBarterOnly: 'केवल वस्तु विनिमय उपलब्ध उपकरण दिखाएं',
    requestRental: 'किराया अनुरोध',
    rent: 'किराया:',
    barter: 'वस्तु विनिमय:',
    barterAvailable: 'उपलब्ध (उत्पाद/सेवाएं)',
    barterNotAvailable: 'उपलब्ध नहीं',
    noEquipmentFound: 'कोई उपकरण नहीं मिला',
    loading: 'लोड हो रहा है...',
    
    // Add Equipment Modal
    addEquipmentTitle: 'उपकरण जोड़ें',
    equipmentName: 'उपकरण का नाम',
    equipmentNamePlaceholder: 'जैसे, ट्रैक्टर, रोटावेटर, सिंचाई पंप',
    contactNumber: 'संपर्क नंबर',
    contactPlaceholder: '+91 98765 43210',
    rentalPrice: 'किराया मूल्य (प्रति दिन)',
    pricePlaceholder: '1500',
    addressLocation: 'पता/स्थान',
    locationPlaceholder: 'शहर, राज्य',
    barterAvailable: 'वस्तु विनिमय उपलब्ध (उत्पाद/सेवाएं)',
    equipmentPhoto: 'उपकरण फोटो',
    clickToUpload: 'फोटो अपलोड करने के लिए क्लिक करें',
    fileFormat: 'PNG, JPG 5MB तक',
    cancel: 'रद्द करें',
    addEquipmentButton: 'उपकरण जोड़ें',
    
    // Farmer Dashboard
    myListings: 'मेरी सूचियां',
    sell: 'बेचें',
    setLocationPrompt: 'पास के खरीदारों और उपकरणों को देखने के लिए अपना स्थान सेट करें',
    goToHomePage: 'अपना क्षेत्र त्रिज्या सेट करने के लिए होम पेज पर जाएं',
    noListingsYet: 'अभी तक कोई सूची नहीं। जोड़ने के लिए बेचें का उपयोग करें।',
    
    // Common
    required: 'आवश्यक',
    error: 'त्रुटि',
    success: 'सफलता',
    close: 'बंद करें',
    submit: 'जमा करें',
    save: 'सहेजें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    confirm: 'पुष्टि करें',
    yes: 'हां',
    no: 'नहीं'
  }
}

// Provider component
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Load saved language from localStorage or default to English
    return localStorage.getItem('app_language') || 'en'
  })

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('app_language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en')
  }

  const t = (key) => {
    return translations[language][key] || key
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isHindi: language === 'hi'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export default LanguageContext
