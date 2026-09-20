import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, Star, GitBranch, CircleDot } from "lucide-react";
import type { GitHubEvent } from "../types/github";

interface ActivityFeedProps {
  events: GitHubEvent[];
}

const relativeFormatter = new Intl.RelativeTimeFormat("pt-PT", { numeric: "auto" });

// Transforma uma data em algo como "há 3 horas" / "há 2 dias".
function timeAgo(dateString: string): string {
  const diffMs = new Date(dateString).getTime() - Date.now();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (Math.abs(diffHours) < 24) return relativeFormatter.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  return relativeFormatter.format(diffDays, "day");
}

// A API do GitHub tem mais de 15 tipos de evento possíveis — aqui só
// traduzimos os mais comuns para uma frase amigável; os restantes
// mostram um texto genérico em vez de desaparecerem da lista.
function describeEvent(event: GitHubEvent): { icon: typeof GitCommit; text: string } {
  switch (event.type) {
    case "PushEvent": {
      const count = event.payload.commits?.length ?? 0;
      return {
        icon: GitCommit,
        text: `Enviou ${count} commit${count === 1 ? "" : "s"} para ${event.repo.name}`,
      };
    }
    case "CreateEvent":
      return {
        icon: GitBranch,
        text: `Criou ${event.payload.ref_type === "repository" ? "o repositório" : "uma branch em"} ${event.repo.name}`,
      };
    case "PullRequestEvent":
      return { icon: GitPullRequest, text: `${event.payload.action === "opened" ? "Abriu" : "Atualizou"} um pull request em ${event.repo.name}` };
    case "WatchEvent":
      return { icon: Star, text: `Marcou ${event.repo.name} com estrela` };
    case "IssuesEvent":
      return { icon: CircleDot, text: `${event.payload.action === "opened" ? "Abriu" : "Atualizou"} uma issue em ${event.repo.name}` };
    default:
      return { icon: GitCommit, text: `Atividade em ${event.repo.name}` };
  }
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  if (events.length === 0) {
    return <p className="activity-feed__empty">Sem atividade pública recente.</p>;
  }

  return (
    <ul className="activity-feed">
      {events.map((event, index) => {
        const { icon: Icon, text } = describeEvent(event);
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
