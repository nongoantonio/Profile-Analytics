import { useLanguage } from "../context/LanguageContext";

export function Loader() {
  const { t } = useLanguage();
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true" />
      <p>{t.loader.text}</p>
    </div>
  );
}
