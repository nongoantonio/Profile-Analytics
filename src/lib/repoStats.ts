import type { GitHubRepo, LanguageSlice } from "../types/github";

// Conta quantos repositórios usam cada linguagem como principal, e
// devolve as N mais usadas — o resto agrupa-se em "Outras", para o
// gráfico não ficar com 20 fatias minúsculas ilegíveis.
export function summarizeLanguages(repos: GitHubRepo[], topN = 6): LanguageSlice[] {
  const counts = new Map<string, number>();

  for (const repo of repos) {
    // Repositórios sem linguagem definida (ex.: só com um README) são
    // ignorados — não fazem parte de "o que esta pessoa programa".
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }

  const sorted = [...counts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (sorted.length <= topN) return sorted;

  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN).reduce((sum, item) => sum + item.value, 0);
  return [...top, { name: "Outras", value: rest }];
}

// Devolve os repositórios mais populares (por número de estrelas),
// excluindo forks — o objetivo é destacar o trabalho ORIGINAL da
// pessoa, não projetos de outros que ela só copiou.
export function topRepositories(repos: GitHubRepo[], limit = 6): GitHubRepo[] {
  return [...repos]
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, limit);
}

export function totalStars(repos: GitHubRepo[]): number {
  return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
}
