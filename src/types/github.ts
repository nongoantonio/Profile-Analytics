// Tipos que descrevem os dados que pedimos à API pública do GitHub
// (https://api.github.com). A API real devolve muitos mais campos —
// aqui só descrevemos os que a aplicação realmente usa.

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  company: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null; // linguagem PRINCIPAL do repositório (a API já nos dá isto, sem precisarmos de mais pedidos)
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean; // true se for um fork de outro repositório (não é código original do utilizador)
}

// A API de "eventos públicos" devolve tipos de evento variados
// (PushEvent, CreateEvent, WatchEvent, IssuesEvent, ...), cada um com
// uma forma de "payload" ligeiramente diferente. Aqui só tipamos os
// campos comuns a todos, que são os únicos que mostramos na interface.
export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
  payload: {
    commits?: { message: string }[];
    action?: string;
    ref_type?: string;
  };
}

// Estado de um pedido assíncrono — o mesmo padrão usado no projeto do Atlas.
export type RequestStatus = "idle" | "loading" | "success" | "error" | "rate-limited";

// Informação sobre o limite de pedidos da API do GitHub, extraída dos
// cabeçalhos da resposta (ver lib/githubApi.ts). É importante mostrar
// isto na interface porque, sem autenticação, o GitHub só permite
// 60 pedidos por hora, por IP — um limite fácil de atingir.
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetAt: Date;
}

// Resumo de linguagens agregado a partir dos repositórios do
// utilizador, pronto a desenhar no gráfico (Recharts espera um array
// de objetos simples, não um Map).
export interface LanguageSlice {
  name: string;
  value: number;
}
