import React, { createContext, useContext, useState } from "react";

export type Language = "en" | "mr" | "hi";

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const TRANSLATIONS: Translations = {
  appName: {
    en: "CivicConnect Mumbai",
    mr: "नागरी संपर्क मुंबई",
    hi: "नागरिक कनेक्ट मुंबई",
  },
  tagline: {
    en: "BMC Civic Intelligence Network",
    mr: "बीएमसी नागरी माहिती नेटवर्क",
    hi: "बीएमसी नागरिक सूचना नेटवर्क",
  },
  home: {
    en: "Home",
    mr: "मुख्य पृष्ठ",
    hi: "मुख्य पृष्ठ",
  },
  grievances: {
    en: "Grievances",
    mr: "तक्रारी",
    hi: "शिकायतें",
  },
  wardMap: {
    en: "Ward Map",
    mr: "प्रभाग नकाशा",
    hi: "वार्ड मानचित्र",
  },
  wardOfficers: {
    en: "Ward Officers",
    mr: "प्रभाग अधिकारी",
    hi: "वार्ड अधिकारी",
  },
  fileGrievance: {
    en: "File Grievance",
    mr: "तक्रार नोंदवा",
    hi: "शिकायत दर्ज करें",
  },
  signIn: {
    en: "Sign In",
    mr: "साइन इन करा",
    hi: "साइन इन करें",
  },
  criticalNotice: {
    en: "CRITICAL NOTICE",
    mr: "महत्त्वाची सूचना",
    hi: "महत्वपूर्ण सूचना",
  },
  helpline: {
    en: "BMC Helpline 1916",
    mr: "बीएमसी हेल्पलाइन १९१६",
    hi: "बीएमसी हेल्पलाइन 1916",
  },
  slaTarget: {
    en: "Maharashtra Services Act SLA: 24h - 48h",
    mr: "महाराष्ट्र सेवा हक्क कायदा: २४तास - ४८तास",
    hi: "महाराष्ट्र सेवा अधिकार अधिनियम: 24घंटे - 48घंटे",
  },
  pothole: {
    en: "Pothole",
    mr: "खड्डा",
    hi: "गड्ढा",
  },
  garbage: {
    en: "Garbage Dump",
    mr: "कचरा",
    hi: "कचरा ढेर",
  },
  waterLeakage: {
    en: "Water Leakage",
    mr: "पाणी गळती",
    hi: "जल रिसाव",
  },
  drainage: {
    en: "Drainage",
    mr: "गटार/ड्रेनेज",
    hi: "जल निकासी",
  },
  streetlight: {
    en: "Streetlight",
    mr: "पथदिवा",
    hi: "स्ट्रीटलाइट",
  },
  contractorPenalties: {
    en: "Contractor SLA Penalties",
    mr: "कंत्राटदार एसएलए दंड",
    hi: "ठेकेदार एसएलए जुर्माना",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("civic_lang") as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("civic_lang", lang);
  };

  const t = (key: string): string => {
    if (TRANSLATIONS[key] && TRANSLATIONS[key][language]) {
      return TRANSLATIONS[key][language];
    }
    return TRANSLATIONS[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
