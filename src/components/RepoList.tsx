import { motion } from "framer-motion";
import { Star, GitFork } from "lucide-react";
import type { GitHubRepo } from "../types/github";

interface RepoListProps {
  repos: GitHubRepo[];
}

// Cores de referência para os "pontos" de linguagem, seguindo (de
// forma aproximada) as cores que o próprio GitHub usa — ajuda ao
// reconhecimento imediato para quem já conhece a plataforma.
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  C: "#555555",
  Shell: "#89e051",
};

const numberFormatter = new Intl.NumberFormat("pt-PT");

export function RepoList({ repos }: RepoListProps) {
  if (repos.length === 0) {
    return <p className="repo-list__empty">Este perfil ainda não tem repositórios públicos originais.</p>;
  }

  return (
    <ul className="repo-list">
      {repos.map((repo, index) => (
        <motion.li
          key={repo.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
        >
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-card">
            <div className="repo-card__header">
              <span className="repo-card__name">{repo.name}</span>
              <span className="repo-card__stars">
                <Star size={14} strokeWidth={2} aria-hidden="true" />
                {numberFormatter.format(repo.stargazers_count)}
              </span>
            </div>

            {repo.description && <p className="repo-card__description">{repo.description}</p>}

            <div className="repo-card__footer">
              {repo.language && (
                <span className="repo-card__language">
                  <span
                    className="repo-card__language-dot"
                    style={{ background: LANGUAGE_COLORS[repo.language] ?? "#8b94a3" }}
                  />
                  {repo.language}
                </span>
              )}
              {repo.forks_count > 0 && (
                <span>
                  <GitFork size={13} strokeWidth={2} aria-hidden="true" /> {repo.forks_count}
                </span>
              )}
            </div>
          </a>
        </motion.li>
      ))}
    </ul>
  );
}
