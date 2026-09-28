"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi" | "mr";

export interface Translations {
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  getStarted: string;
  exploreTools: string;
  dashboard: string;
  calculator: string;
  affordability: string;
  budget: string;
  goals: string;
  stressTest: string;
  creditScore: string;
  aiAssistant: string;
  documents: string;
  admin: string;
  methodology: string;
  financialHealth: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  existingEmi: string;
  savings: string;
  disposableIncome: string;
  loanAmount: string;
  interestRate: string;
  tenureYears: string;
  tenureMonths: string;
  calculate: string;
  simulate: string;
  compare: string;
  status: string;
  withinCriteria: string;
  requiresReview: string;
  outsideCriteria: string;
  disclaimerText: string;
  demoMode: string;
  logout: string;
  login: string;
  signUp: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "FinAI",
    tagline: "AI-Powered Financial Health & Loan Intelligence Platform",
    heroHeadline: "Understand Your Finances. Plan Smarter.",
    heroSubtitle: "AI-powered financial insights, loan affordability analysis, EMI calculations, budgeting, and scenario planning — all in one place.",
    getStarted: "Get Started",
    exploreTools: "Explore Tools",
    dashboard: "Dashboard",
    calculator: "EMI Calculator",
    affordability: "Loan Affordability",
    budget: "Budget & Reserves",
    goals: "Financial Goals",
    stressTest: "Stress Testing",
    creditScore: "Credit Analyzer",
    aiAssistant: "AI Assistant",
    documents: "Doc Analyzer",
    admin: "Admin Console",
    methodology: "Methodology",
    financialHealth: "Financial Health",
    monthlyIncome: "Monthly Income",
    monthlyExpenses: "Monthly Expenses",
    existingEmi: "Existing EMI",
    savings: "Liquid Savings",
    disposableIncome: "Disposable Income",
    loanAmount: "Requested Loan Amount",
    interestRate: "Annual Interest Rate",
    tenureYears: "Tenure (Years)",
    tenureMonths: "Tenure (Months)",
    calculate: "Calculate",
    simulate: "Simulate Scenarios",
    compare: "Compare Offers",
    status: "Assessment Status",
    withinCriteria: "Estimated within configured criteria",
    requiresReview: "Requires review",
    outsideCriteria: "Outside configured criteria",
    disclaimerText: "FinAI provides estimates, calculations, and educational financial information based on user assumptions. It does not guarantee loan approval or represent any bank or underwriting authority.",
    demoMode: "Demo Mode Active",
    logout: "Sign Out",
    login: "Sign In",
    signUp: "Create Account",
  },
  hi: {
    appName: "FinAI (फिनएआई)",
    tagline: "एआई-संचालित वित्तीय स्वास्थ्य और ऋण बुद्धिमत्ता मंच",
    heroHeadline: "अपने वित्त को समझें। समझदारी से योजना बनाएं।",
    heroSubtitle: "एआई-संचालित वित्तीय अंतर्दृष्टि, ऋण वहन क्षमता विश्लेषण, ईएमआई गणना और परिदृश्य योजना — सब कुछ एक स्थान पर।",
    getStarted: "शुरू करें",
    exploreTools: "उपकरण देखें",
    dashboard: "डैशबोर्ड",
    calculator: "ईएमआई कैलकुलेटर",
    affordability: "ऋण वहन क्षमता",
    budget: "बजट और भंडार",
    goals: "वित्तीय लक्ष्य",
    stressTest: "तनाव परीक्षण",
    creditScore: "क्रेडिट स्कोर विश्लेषक",
    aiAssistant: "एआई सहायक",
    documents: "दस्तावेज़ विश्लेषक",
    admin: "एडमिन पैनल",
    methodology: "कार्यप्रणाली",
    financialHealth: "वित्तीय स्वास्थ्य",
    monthlyIncome: "मासिक आय",
    monthlyExpenses: "मासिक खर्च",
    existingEmi: "मौजूदा ईएमआई",
    savings: "बचत",
    disposableIncome: "बची हुई आय",
    loanAmount: "ऋण राशि",
    interestRate: "वार्षिक ब्याज दर",
    tenureYears: "अवधि (वर्ष)",
    tenureMonths: "अवधि (महीने)",
    calculate: "गणना करें",
    simulate: "सिम्युलेट करें",
    compare: "तुलना करें",
    status: "मूल्यांकन स्थिति",
    withinCriteria: "कॉन्फ़िगर मानदंडों के भीतर अनुमानित",
    requiresReview: "समीक्षा की आवश्यकता है",
    outsideCriteria: "मानदंडों से बाहर",
    disclaimerText: "फिनएआई केवल शैक्षिक और वित्तीय अनुमान प्रदान करता है। यह किसी भी बैंक के ऋण स्वीकृति की गारंटी नहीं देता है।",
    demoMode: "डेमो मोड सक्रिय",
    logout: "लॉग आउट",
    login: "लॉग इन",
    signUp: "खाता बनाएं",
  },
  mr: {
    appName: "FinAI (फिनएआय)",
    tagline: "एआय-चालित आर्थिक आरोग्य आणि कर्ज विश्लेषण प्लॅटफॉर्म",
    heroHeadline: "तुमचे आर्थिक नियोजन समजून घ्या. हुशारीने निर्णय घ्या.",
    heroSubtitle: "एआय-आधारित आर्थिक विश्लेषण, कर्ज परवडण्याची क्षमता, ईएमआय कॅल्क्युलेटर, बजेट आणि नियोजन एकाच ठिकाणी.",
    getStarted: "सुरू करा",
    exploreTools: "साधने पहा",
    dashboard: "डॅशबोर्ड",
    calculator: "ईएमआय कॅल्क्युलेटर",
    affordability: "कर्ज परवडणारी क्षमता",
    budget: "बजेट आणि राखीव निधी",
    goals: "आर्थिक उद्दिष्टे",
    stressTest: "ताण चाचणी",
    creditScore: "क्रेडिट स्कोर विश्लेषक",
    aiAssistant: "एआय सहाय्यक",
    documents: "कागदपत्र विश्लेषक",
    admin: "प्रशासक पॅनेल",
    methodology: "पद्धती आणि नियम",
    financialHealth: "आर्थिक आरोग्य",
    monthlyIncome: "मासिक उत्पन्न",
    monthlyExpenses: "मासिक खर्च",
    existingEmi: "सध्याचे ईएमआय",
    savings: "बचत",
    disposableIncome: "शिल्लक उत्पन्न",
    loanAmount: "कर्ज रक्कम",
    interestRate: "वार्षिक व्याज दर",
    tenureYears: "मुदत (वर्षे)",
    tenureMonths: "मुदत (महिने)",
    calculate: "गणना करा",
    simulate: "सिम्युलेशन करा",
    compare: "तुलना करा",
    status: "मूल्यांकन स्थिती",
    withinCriteria: "निकषांच्या आत अनुमानित",
    requiresReview: "पुनरावलोकन आवश्यक",
    outsideCriteria: "निकषांच्या बाहेर",
    disclaimerText: "फिनएआय शैक्षणिक आणि माहितीपर आर्थिक अंदाज पुरवते. हे कोणत्याही बँकेची कर्ज मंजुरी दर्शवत नाही.",
    demoMode: "डेमो मोड चालू",
    logout: "बाहेर पडा",
    login: "प्रवेश करा",
    signUp: "नोंदणी करा",
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("finai_language") as Language;
    if (saved && (saved === "en" || saved === "hi" || saved === "mr")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("finai_language", lang);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
