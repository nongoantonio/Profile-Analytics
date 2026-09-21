// Mostra de forma discreta quantos pedidos ainda restam antes do
// limite de 60/hora (sem autenticação) da API do GitHub — um detalhe
// de UX que a maioria das apps esconde, mas que aqui faz sentido
// mostrar: é literalmente o tema técnico principal deste projeto.
import { Gauge } from "lucide-react";
import type { RateLimitInfo } from "../types/github";
import { useLanguage } from "../context/LanguageContext";

export function RateLimitBadge({ rateLimit }: { rateLimit: RateLimitInfo | null }) {
  const { t } = useLanguage();
  if (!rateLimit) return null;

  const isLow = rateLimit.remaining <= 10;

  return (
    <div className={"rate-limit-badge" + (isLow ? " is-low" : "")}>
      <Gauge size={14} strokeWidth={2.2} aria-hidden="true" />
      <span>
        {rateLimit.remaining}/{rateLimit.limit} {t.rateLimit.remaining}
      </span>
    </div>
  );
}
