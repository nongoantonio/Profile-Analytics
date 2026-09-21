import { useCallback, useState } from "react";
import type { GitHubUser, GitHubRepo, GitHubEvent, RequestStatus, RateLimitInfo } from "../types/github";
import { fetchUser, fetchRepos, fetchPublicEvents, RateLimitError, UserNotFoundError } from "../lib/githubApi";

interface ProfileState {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  events: GitHubEvent[];
  status: RequestStatus;
  errorMessage: string | null;
  rateLimit: RateLimitInfo | null;
}

const initialState: ProfileState = {
  user: null,
  repos: [],
  events: [],
  status: "idle",
  errorMessage: null,
  rateLimit: null,
};

export function useGitHubProfile() {
  const [state, setState] = useState<ProfileState>(initialState);

  const search = useCallback(async (username: string) => {
    const trimmed = username.trim();
    if (!trimmed) return;

    setState((prev) => ({ ...prev, status: "loading", errorMessage: null }));

    try {
      // Pedimos o perfil primeiro: se o utilizador não existir, o erro
      // 404 chega logo aqui, sem gastarmos mais 2 pedidos à toa contra
      // o limite de 60/hora.
      const userResult = await fetchUser(trimmed);

      // Os outros dois pedidos podem correr em paralelo — não dependem
      // um do outro, por isso não há razão para esperar em série.
      const [reposResult, eventsResult] = await Promise.all([
        fetchRepos(trimmed),
        fetchPublicEvents(trimmed),
      ]);

      setState({
        user: userResult.data,
        repos: reposResult.data,
        events: eventsResult.data,
        status: "success",
        errorMessage: null,
        // Guardamos sempre o limite mais recente (o dos eventos, o
        // último pedido a terminar) para a barra de estado ficar atualizada.
        rateLimit: eventsResult.rateLimit ?? reposResult.rateLimit ?? userResult.rateLimit,
      });
    } catch (error) {
      if (error instanceof RateLimitError) {
        setState((prev) => ({
          ...prev,
          status: "rate-limited",
          errorMessage: null,
          rateLimit: { limit: 60, remaining: 0, resetAt: error.resetAt },
        }));
        return;
      }

      const message =
        error instanceof UserNotFoundError
          ? null // o texto traduzido para "utilizador não encontrado" vive na interface (t.errors.*), não aqui
          : error instanceof Error
            ? error.message
            : "Unexpected error.";

      setState((prev) => ({ ...prev, status: "error", errorMessage: message }));
    }
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  return { ...state, search, reset };
}
