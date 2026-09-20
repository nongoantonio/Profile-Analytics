// Camada de acesso à API do GitHub — o único ficheiro que sabe os
// URLs, os cabeçalhos e como interpretar os limites de utilização.
import type { GitHubUser, GitHubRepo, GitHubEvent, RateLimitInfo } from "../types/github";

const BASE_URL = "https://api.github.com";

// Erro próprio para quando o GitHub responde com 403 por excesso de
// pedidos — permite aos componentes tratar este caso de forma
// diferente de "utilizador não encontrado" ou de um erro de rede.
export class RateLimitError extends Error {
  resetAt: Date;
  constructor(resetAt: Date) {
    super("Limite de pedidos à API do GitHub atingido.");
    this.name = "RateLimitError";
    this.resetAt = resetAt;
  }
}

export class UserNotFoundError extends Error {
  constructor(username: string) {
    super(`Não existe nenhum utilizador do GitHub chamado "${username}".`);
    this.name = "UserNotFoundError";
  }
}

// Lê os cabeçalhos "X-RateLimit-*" que o GitHub envia em TODAS as
// respostas (mesmo nas bem sucedidas) — é assim que conseguimos
// mostrar "quantos pedidos ainda tens disponíveis" na interface, sem
// precisar de um pedido extra só para isso.
function readRateLimit(response: Response): RateLimitInfo | null {
  const limit = response.headers.get("x-ratelimit-limit");
  const remaining = response.headers.get("x-ratelimit-remaining");
  const reset = response.headers.get("x-ratelimit-reset");
  if (!limit || !remaining || !reset) return null;

  return {
    limit: Number(limit),
    remaining: Number(remaining),
    // O cabeçalho vem em segundos desde 1970 (Unix timestamp); o
    // JavaScript trabalha em milissegundos, por isso multiplicamos por 1000.
    resetAt: new Date(Number(reset) * 1000),
  };
}

// Função central: faz o pedido, trata erros comuns (404, 403 por
// limite) de forma consistente, e devolve tanto os dados como a
// informação do limite de pedidos.
async function githubFetch<T>(path: string): Promise<{ data: T; rateLimit: RateLimitInfo | null }> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
  });

  const rateLimit = readRateLimit(response);

  if (response.status === 403 && rateLimit && rateLimit.remaining === 0) {
    throw new RateLimitError(rateLimit.resetAt);
  }

  if (response.status === 404) {
    // Extraímos o username do próprio path para a mensagem de erro
    // ficar específica (ex.: "/users/xpto" -> "xpto").
    const username = path.split("/").filter(Boolean)[1] ?? path;
    throw new UserNotFoundError(username);
  }

  if (!response.ok) {
    throw new Error(`Erro ao contactar a API do GitHub (código ${response.status}).`);
  }

  const data = (await response.json()) as T;
  return { data, rateLimit };
}

export function fetchUser(username: string) {
  return githubFetch<GitHubUser>(`/users/${encodeURIComponent(username)}`);
}

export function fetchRepos(username: string) {
  // "per_page=100" traz até 100 repositórios num único pedido (o
  // máximo permitido) — evita termos de paginar para a maioria dos
  // perfis. "sort=updated" põe os mais recentemente atualizados primeiro.
  return githubFetch<GitHubRepo[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`
  );
}

export function fetchPublicEvents(username: string) {
  return githubFetch<GitHubEvent[]>(
    `/users/${encodeURIComponent(username)}/events/public?per_page=15`
  );
}
