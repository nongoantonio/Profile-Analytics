import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Language, type TranslationTable } from "../lib/translations";

const STORAGE_KEY = "github-analytics:language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationTable;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Deteta um idioma inicial razoável: primeiro o que ficou guardado de
// uma visita anterior, depois o idioma do browser (se for um dos 3
// suportados), com português como último recurso.
function detectInitialLanguage(): Language {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "pt" || saved === "en" || saved === "fr") return saved;

  const browserLang = navigator.language.slice(0, 2);
  if (browserLang === "en" || browserLang === "fr") return browserLang;
  return "pt";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  function setLanguage(next: Language) {
    setLanguageState(next);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage tem de ser usado dentro de um <LanguageProvider>");
  }
  return context;
}
