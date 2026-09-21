import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, Star, GitBranch, CircleDot } from "lucide-react";
import type { GitHubEvent } from "../types/github";
import { useLanguage } from "../context/LanguageContext";
import type { TranslationTable } from "../lib/translations";

interface ActivityFeedProps {
  events: GitHubEvent[];
}

const LOCALES: Record<string, string> = { pt: "pt-PT", en: "en-US", fr: "fr-FR" };

// A API do GitHub tem mais de 15 tipos de evento possíveis — aqui só
// traduzimos os mais comuns para uma frase amigável; os restantes
// mostram um texto genérico em vez de desaparecerem da lista.
function describeEvent(
  event: GitHubEvent,
  t: TranslationTable
): { icon: typeof GitCommit; text: string } {
  switch (event.type) {
    case "PushEvent": {
      const count = event.payload.commits?.length ?? 0;
      return { icon: GitCommit, text: t.activity.push(count, event.repo.name) };
    }
    case "CreateEvent":
      return {
        icon: GitBranch,
        text:
          event.payload.ref_type === "repository"
            ? t.activity.createRepo(event.repo.name)
            : t.activity.createBranch(event.repo.name),
      };
    case "PullRequestEvent":
      return {
        icon: GitPullRequest,
        text:
          event.payload.action === "opened"
            ? t.activity.prOpened(event.repo.name)
            : t.activity.prUpdated(event.repo.name),
      };
    case "WatchEvent":
      return { icon: Star, text: t.activity.watch(event.repo.name) };
    case "IssuesEvent":
      return {
        icon: CircleDot,
        text:
          event.payload.action === "opened"
            ? t.activity.issueOpened(event.repo.name)
            : t.activity.issueUpdated(event.repo.name),
      };
    default:
      return { icon: GitCommit, text: t.activity.generic(event.repo.name) };
  }
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  const { t, language } = useLanguage();
  const relativeFormatter = new Intl.RelativeTimeFormat(LOCALES[language], { numeric: "auto" });

  function timeAgo(dateString: string): string {
    const diffMs = new Date(dateString).getTime() - Date.now();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    if (Math.abs(diffHours) < 24) return relativeFormatter.format(diffHours, "hour");
    const diffDays = Math.round(diffHours / 24);
    return relativeFormatter.format(diffDays, "day");
  }

  if (events.length === 0) {
    return <p className="activity-feed__empty">{t.activity.empty}</p>;
  }

  return (
    <ul className="activity-feed">
      {events.map((event, index) => {
        const { icon: Icon, text } = describeEvent(event, t);
        return (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
          >
            <span className="activity-feed__icon">
              <Icon size={15} strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="activity-feed__text">{text}</span>
            <span className="activity-feed__time">{timeAgo(event.created_at)}</span>
          </motion.li>
        );
      })}
    </ul>
  );
}
