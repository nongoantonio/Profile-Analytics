import { Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { LANGUAGES } from "../lib/translations";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher" role="group" aria-label="Idioma da interface">
      <Languages size={14} strokeWidth={2} aria-hidden="true" />
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={language === code ? "is-active" : ""}
          onClick={() => setLanguage(code)}
          aria-pressed={language === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
