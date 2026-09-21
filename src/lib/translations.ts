// Sistema de traduções simples, feito à mão (sem biblioteca externa
// tipo react-i18next) — para uma app deste tamanho, um objeto com as
// 3 línguas chega perfeitamente bem e evita mais uma dependência.
//
// Estrutura: cada chave de nível superior é uma "secção" da interface
// (hero, search, profile, ...), para ser fácil encontrar o texto certo
// a mudar sem precisar de percorrer um ficheiro gigante e plano.
export type Language = "pt" | "en" | "fr";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

// Definimos o formato à mão (em vez de deixar o TypeScript inferi-lo
// do objeto "pt" com "typeof translations.pt") — isso é importante,
// porque inferir a partir de um objeto concreto prende cada campo ao
// TEXTO EXATO desse idioma (ex.: o título só podia ser literalmente
// "Análise de perfis do GitHub"), o que impede os outros idiomas de
// terem textos diferentes. Com uma interface explícita, cada campo é
// só "string" ou "função que devolve string" — qualquer idioma serve.
export interface TranslationTable {
  hero: { eyebrow: string; title: string; subtitle: string };
  search: { placeholder: string; button: string; buttonLoading: string };
  rateLimit: { remaining: string };
  loader: { text: string };
  empty: { idle: string };
  errors: {
    notFoundTitle: string;
    notFoundFallback: string;
    rateLimitTitle: string;
    rateLimitDescription: (time: string) => string;
  };
  profile: { followers: string; repos: string; stars: string; since: string };
  sections: { languages: string; activity: string; repos: string };
  languageChart: { empty: string; tooltipSuffix: string };
  repoList: { empty: string };
  activity: {
    empty: string;
    push: (count: number, repo: string) => string;
    createRepo: (repo: string) => string;
    createBranch: (repo: string) => string;
    prOpened: (repo: string) => string;
    prUpdated: (repo: string) => string;
    watch: (repo: string) => string;
    issueOpened: (repo: string) => string;
    issueUpdated: (repo: string) => string;
    generic: (repo: string) => string;
  };
}

export const translations: Record<Language, TranslationTable> = {
  pt: {
    hero: {
      eyebrow: "$ github-analytics --user",
      title: "Análise de perfis do GitHub",
      subtitle:
        "Escreve um username e vê linguagens, repositórios em destaque e atividade recente — tudo com a API pública do GitHub, sem conta nem chave.",
    },
    search: {
      placeholder: "Introduz o teu username",
      button: "Analisar",
      buttonLoading: "A procurar...",
    },
    rateLimit: {
      remaining: "pedidos restantes",
    },
    loader: {
      text: "A analisar perfil...",
    },
    empty: {
      idle: "Escreve um username do GitHub acima para começar — por exemplo, o teu próprio.",
    },
    errors: {
      notFoundTitle: "Não encontrámos esse perfil",
      notFoundFallback: "Verifica se o username está escrito corretamente.",
      rateLimitTitle: "Limite de pedidos atingido",
      rateLimitDescription: (time: string) =>
        `A API pública do GitHub permite 60 pedidos por hora sem autenticação. Tenta novamente às ${time}.`,
    },
    profile: {
      followers: "seguidores",
      repos: "repositórios",
      stars: "estrelas",
      since: "desde",
    },
    sections: {
      languages: "Linguagens mais usadas",
      activity: "Atividade recente",
      repos: "Repositórios em destaque",
    },
    languageChart: {
      empty: "Sem dados de linguagem suficientes para desenhar o gráfico.",
      tooltipSuffix: "repositórios",
    },
    repoList: {
      empty: "Este perfil ainda não tem repositórios públicos originais.",
    },
    activity: {
      empty: "Sem atividade pública recente.",
      push: (count: number, repo: string) =>
        `Enviou ${count} commit${count === 1 ? "" : "s"} para ${repo}`,
      createRepo: (repo: string) => `Criou o repositório ${repo}`,
      createBranch: (repo: string) => `Criou uma branch em ${repo}`,
      prOpened: (repo: string) => `Abriu um pull request em ${repo}`,
      prUpdated: (repo: string) => `Atualizou um pull request em ${repo}`,
      watch: (repo: string) => `Marcou ${repo} com estrela`,
      issueOpened: (repo: string) => `Abriu uma issue em ${repo}`,
      issueUpdated: (repo: string) => `Atualizou uma issue em ${repo}`,
      generic: (repo: string) => `Atividade em ${repo}`,
    },
  },
  en: {
    hero: {
      eyebrow: "$ github-analytics --user",
      title: "GitHub profile analytics",
      subtitle:
        "Type a username to see top languages, featured repositories and recent activity — powered entirely by the public GitHub API, no account or key needed.",
    },
    search: {
      placeholder: "Enter your username",
      button: "Analyze",
      buttonLoading: "Searching...",
    },
    rateLimit: {
      remaining: "requests left",
    },
    loader: {
      text: "Analyzing profile...",
    },
    empty: {
      idle: "Type a GitHub username above to get started — your own is a good test.",
    },
    errors: {
      notFoundTitle: "We couldn't find that profile",
      notFoundFallback: "Check whether the username is spelled correctly.",
      rateLimitTitle: "Rate limit reached",
      rateLimitDescription: (time: string) =>
        `The public GitHub API allows 60 unauthenticated requests per hour. Try again at ${time}.`,
    },
    profile: {
      followers: "followers",
      repos: "repositories",
      stars: "stars",
      since: "since",
    },
    sections: {
      languages: "Top languages",
      activity: "Recent activity",
      repos: "Featured repositories",
    },
    languageChart: {
      empty: "Not enough language data to draw a chart.",
      tooltipSuffix: "repositories",
    },
    repoList: {
      empty: "This profile has no original public repositories yet.",
    },
    activity: {
      empty: "No recent public activity.",
      push: (count: number, repo: string) => `Pushed ${count} commit${count === 1 ? "" : "s"} to ${repo}`,
      createRepo: (repo: string) => `Created the repository ${repo}`,
      createBranch: (repo: string) => `Created a branch in ${repo}`,
      prOpened: (repo: string) => `Opened a pull request in ${repo}`,
      prUpdated: (repo: string) => `Updated a pull request in ${repo}`,
      watch: (repo: string) => `Starred ${repo}`,
      issueOpened: (repo: string) => `Opened an issue in ${repo}`,
      issueUpdated: (repo: string) => `Updated an issue in ${repo}`,
      generic: (repo: string) => `Activity in ${repo}`,
    },
  },
  fr: {
    hero: {
      eyebrow: "$ github-analytics --user",
      title: "Analyse de profils GitHub",
      subtitle:
        "Saisis un nom d'utilisateur pour voir les langages, les dépôts en vedette et l'activité récente — via l'API publique de GitHub, sans compte ni clé.",
    },
    search: {
      placeholder: "Saisis ton nom d'utilisateur",
      button: "Analyser",
      buttonLoading: "Recherche...",
    },
    rateLimit: {
      remaining: "requêtes restantes",
    },
    loader: {
      text: "Analyse du profil...",
    },
    empty: {
      idle: "Saisis un nom d'utilisateur GitHub ci-dessus pour commencer — le tien est un bon test.",
    },
    errors: {
      notFoundTitle: "Profil introuvable",
      notFoundFallback: "Vérifie que le nom d'utilisateur est correctement orthographié.",
      rateLimitTitle: "Limite de requêtes atteinte",
      rateLimitDescription: (time: string) =>
        `L'API publique de GitHub autorise 60 requêtes par heure sans authentification. Réessaie à ${time}.`,
    },
    profile: {
      followers: "abonnés",
      repos: "dépôts",
      stars: "étoiles",
      since: "depuis",
    },
    sections: {
      languages: "Langages les plus utilisés",
      activity: "Activité récente",
      repos: "Dépôts en vedette",
    },
    languageChart: {
      empty: "Pas assez de données de langage pour tracer un graphique.",
      tooltipSuffix: "dépôts",
    },
    repoList: {
      empty: "Ce profil n'a pas encore de dépôts publics originaux.",
    },
    activity: {
      empty: "Aucune activité publique récente.",
      push: (count: number, repo: string) => `A poussé ${count} commit${count === 1 ? "" : "s"} vers ${repo}`,
      createRepo: (repo: string) => `A créé le dépôt ${repo}`,
      createBranch: (repo: string) => `A créé une branche dans ${repo}`,
      prOpened: (repo: string) => `A ouvert une pull request dans ${repo}`,
      prUpdated: (repo: string) => `A mis à jour une pull request dans ${repo}`,
      watch: (repo: string) => `A mis une étoile à ${repo}`,
      issueOpened: (repo: string) => `A ouvert une issue dans ${repo}`,
      issueUpdated: (repo: string) => `A mis à jour une issue dans ${repo}`,
      generic: (repo: string) => `Activité dans ${repo}`,
    },
  },
};
