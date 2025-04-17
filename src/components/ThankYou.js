import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ThankYou.css';

// Use the existing language context and resources from SurveyCarousel
const LanguageContext = React.createContext();
const useLanguage = () => React.useContext(LanguageContext);

// Language resources for ThankYou page
const resources = {
  en: {
    dir: 'ltr',
    title: "Thank You!",
    message: "Your responses have been submitted successfully.",
    contact: "A BYD Al-Futtaim sales representative will contact you shortly to discuss your car purchase options.",
    button: "Fill Another Form",
    switchLanguage: "التغيير إلى العربية"
  },
  ar: {
    dir: 'rtl',
    title: "شكرًا لك!",
    message: "تم إرسال إجاباتك بنجاح",
    contact: "سيتواصل معك أحد ممثلي مبيعات بي واي دي الفطيم قريبًا لمناقشة خيارات شراء السيارة.",
    button: "تعبئة نموذج آخر",
    switchLanguage: "Switch to English"
  }
};

function ThankYou() {
  // Access the language context
  const { language, toggleLanguage } = useLanguage();
  const t = resources[language];
  const isRTL = language === 'ar';
  
  // Apply the appropriate direction
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = resources[language].dir;
  }, [language]);

  return (
    <div className={`thank-you ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="thank-you-content">
        <h2>{t.title}</h2>
        <p>{t.message}</p>
        <p>{t.contact}</p>
        <Link to="/" className="start-over">
          {t.button}
        </Link>
      </div>
      
      <div className="language-toggle">
        <button onClick={toggleLanguage} className="language-button">
          {t.switchLanguage}
        </button>
      </div>
    </div>
  );
}

// Include the LanguageProvider component to match the SurveyCarousel approach
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = React.useState(() => {
    // Try to get language from localStorage if available, default to Arabic
    try {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      return savedLanguage || 'ar'; // Default to Arabic
    } catch (e) {
      return 'ar'; // Default to Arabic if localStorage is not available
    }
  });
  
  // Set the language direction on initial render
  React.useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = resources[language].dir;
  }, [language]);
  
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = resources[newLang].dir;
  };
  
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Use the same LanguageProvider wrapper pattern
export default function WrappedThankYou() {
  return (
    <LanguageProvider>
      <ThankYou />
    </LanguageProvider>
  );
}