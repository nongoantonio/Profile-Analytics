// App.tsx decide O QUE mostrar consoante o estado (idle / loading /
// success / error / rate-limited) — toda a lógica de pedidos vive no
// hook useGitHubProfile, tal como no projeto do Atlas.
import { Suspense, lazy } from "react";
import { Code2, Star, Activity } from "lucide-react";
import { useGitHubProfile } from "./hooks/useGitHubProfile";
import { summarizeLanguages, topRepositories, totalStars } from "./lib/repoStats";
import { SearchBar } from "./components/SearchBar";
import { RateLimitBadge } from "./components/RateLimitBadge";
import { ProfileCard } from "./components/ProfileCard";
import { RepoList } from "./components/RepoList";
import { ActivityFeed } from "./components/ActivityFeed";
import { SectionCard } from "./components/SectionCard";
import { Loader } from "./components/Loader";
import { StateMessage } from "./components/StateMessage";
import "./App.css";

// O Recharts (usado só no gráfico de linguagens) é uma biblioteca
// relativamente pesada. Com "lazy", o código dela só é descarregado
// quando a primeira pesquisa tem sucesso — não faz parte do carregamento
// inicial da página, que fica mais rápido para quem ainda nem pesquisou nada.
const LanguageChart = lazy(() =>
  import("./components/LanguageChart").then((module) => ({ default: module.LanguageChart }))
);

function App() {
  const { user, repos, events, status, errorMessage, rateLimit, search } = useGitHubProfile();

  return (
    <div className="app">
      <header className="app__hero">
        <div className="app__hero-texture" aria-hidden="true" />
        <p className="app__eyebrow">$ github-analytics --user</p>
        <h1>Análise de perfis do GitHub</h1>
        <p className="app__subtitle">
          Escreve um username e vê linguagens, repositórios em destaque e atividade recente —
          tudo com a API pública do GitHub, sem conta nem chave.
        </p>
        <SearchBar onSearch={search} isLoading={status === "loading"} />
        <RateLimitBadge rateLimit={rateLimit} />
      </header>

      <main className="app__content">
        {status === "loading" && <Loader />}

        {status === "error" && (
          <StateMessage
            title="Não encontrámos esse perfil"
            description={errorMessage ?? "Verifica se o username está escrito corretamente."}
          />
        )}

        {status === "rate-limited" && rateLimit && (
          <StateMessage
            variant="rate-limit"
            title="Limite de pedidos atingido"
            description={`A API pública do GitHub permite 60 pedidos por hora sem autenticação. Tenta novamente às ${rateLimit.resetAt.toLocaleTimeString("pt-PT")}.`}
          />
        )}

        {status === "success" && user && (
          <div className="app__dashboard">
            <ProfileCard user={user} totalStars={totalStars(repos)} />

            <div className="app__grid">
              <SectionCard title="Linguagens mais usadas" icon={<Code2 size={17} strokeWidth={2} />}>
                <Suspense fallback={<div className="language-chart--empty"><p>A carregar gráfico...</p></div>}>
                  <LanguageChart data={summarizeLanguages(repos)} />
                </Suspense>
              </SectionCard>

              <SectionCard title="Atividade recente" icon={<Activity size={17} strokeWidth={2} />} delay={0.05}>
                <ActivityFeed events={events} />
              </SectionCard>
            </div>

            <SectionCard title="Repositórios em destaque" icon={<Star size={17} strokeWidth={2} />} delay={0.1}>
              <RepoList repos={topRepositories(repos)} />
            </SectionCard>
          </div>
        )}

        {status === "idle" && (
          <div className="app__empty-state">
            <p>Escreve um username do GitHub acima para começar — por exemplo, o teu próprio.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
