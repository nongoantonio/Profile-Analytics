import { motion } from "framer-motion";
import { MapPin, Building2, Link as LinkIcon, Users, BookMarked, Star, Calendar } from "lucide-react";
import type { GitHubUser } from "../types/github";
import { useLanguage } from "../context/LanguageContext";

interface ProfileCardProps {
  user: GitHubUser;
  totalStars: number;
}

// "locale" muda consoante o idioma escolhido na interface — assim as
// datas ("janeiro de 2019" vs "January 2019" vs "janvier 2019") e a
// formatação de milhares (1.234 vs 1,234) seguem o idioma certo.
const LOCALES: Record<string, string> = { pt: "pt-PT", en: "en-US", fr: "fr-FR" };

export function ProfileCard({ user, totalStars }: ProfileCardProps) {
  const { t, language } = useLanguage();
  const locale = LOCALES[language];
  const dateFormatter = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" });
  const numberFormatter = new Intl.NumberFormat(locale);

  return (
    <motion.section
      className="profile-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <img src={user.avatar_url} alt={`Avatar de ${user.login}`} className="profile-card__avatar" />

      <div className="profile-card__identity">
        <h2>{user.name ?? user.login}</h2>
        <a href={user.html_url} target="_blank" rel="noreferrer" className="profile-card__handle">
          @{user.login}
        </a>
        {user.bio && <p className="profile-card__bio">{user.bio}</p>}

        <div className="profile-card__meta">
          {user.company && (
            <span>
              <Building2 size={14} strokeWidth={2} aria-hidden="true" /> {user.company}
            </span>
          )}
          {user.location && (
            <span>
              <MapPin size={14} strokeWidth={2} aria-hidden="true" /> {user.location}
            </span>
          )}
          {user.blog && (
            <a href={normalizeUrl(user.blog)} target="_blank" rel="noreferrer">
              <LinkIcon size={14} strokeWidth={2} aria-hidden="true" /> {user.blog}
            </a>
          )}
          <span>
            <Calendar size={14} strokeWidth={2} aria-hidden="true" /> {t.profile.since}{" "}
            {dateFormatter.format(new Date(user.created_at))}
          </span>
        </div>
      </div>

      <div className="profile-card__stats">
        <div className="stat">
          <Users size={16} strokeWidth={2} aria-hidden="true" />
          <strong>{numberFormatter.format(user.followers)}</strong>
          <span>{t.profile.followers}</span>
        </div>
        <div className="stat">
          <BookMarked size={16} strokeWidth={2} aria-hidden="true" />
          <strong>{numberFormatter.format(user.public_repos)}</strong>
          <span>{t.profile.repos}</span>
        </div>
        <div className="stat">
          <Star size={16} strokeWidth={2} aria-hidden="true" />
          <strong>{numberFormatter.format(totalStars)}</strong>
          <span>{t.profile.stars}</span>
        </div>
      </div>
    </motion.section>
  );
}

// "blog" na API do GitHub às vezes vem sem "https://" à frente
// (ex.: "meusite.com"), o que faria o link tentar abrir um caminho
// relativo do próprio site em vez do URL externo.
function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}
