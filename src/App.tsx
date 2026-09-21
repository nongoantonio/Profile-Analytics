// App.tsx decide O QUE mostrar consoante o estado (idle / loading /
// success / error / rate-limited) — toda a lógica de pedidos vive no
// hook useGitHubProfile.
import { Suspense, lazy } from "react";
import { Code2, Star, Activity } from "lucide-react";
import { useGitHubProfile } from "./hooks/useGitHubProfile";
import { useLanguage } from "./context/LanguageContext";
import { summarizeLanguages, topRepositories, totalStars } from "./lib/repoStats";
import { Logo } from "./components/Logo";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { ContributionGraphBackground } from "./components/ContributionGraphBackground";
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
  const { t } = useLanguage();

  return (
    <div className="app">
      <header className="app__hero">
        <ContributionGraphBackground />
        <div className="app__hero-texture" aria-hidden="true" />

        <div className="app__hero-topbar">
          <Logo size={36} />
          <LanguageSwitcher />
        </div>

        <p className="app__eyebrow">{t.hero.eyebrow}</p>
        <h1>{t.hero.title}</h1>
        <SearchBar onSearch={search} isLoading={status === "loading"} />
        <RateLimitBadge rateLimit={rateLimit} />
      </header>

      <main className="app__content">
        {status === "loading" && <Loader />}

        {status === "error" && (
          <StateMessage title={t.errors.notFoundTitle} description={errorMessage ?? t.errors.notFoundFallback} />
        )}

        {status === "rate-limited" && rateLimit && (
          <StateMessage
            variant="rate-limit"
            title={t.errors.rateLimitTitle}
            description={t.errors.rateLimitDescription(rateLimit.resetAt.toLocaleTimeString())}
          />
        )}

        {status === "success" && user && (
          <div className="app__dashboard">
            <ProfileCard user={user} totalStars={totalStars(repos)} />

            <div className="app__grid">
              <SectionCard title={t.sections.languages} icon={<Code2 size={17} strokeWidth={2} />}>
                <Suspense fallback={<div className="language-chart--empty"><p>...</p></div>}>
                  <LanguageChart data={summarizeLanguages(repos)} />
                </Suspense>
              </SectionCard>

              <SectionCard title={t.sections.activity} icon={<Activity size={17} strokeWidth={2} />} delay={0.05}>
                <ActivityFeed events={events} />
              </SectionCard>
            </div>

            <SectionCard title={t.sections.repos} icon={<Star size={17} strokeWidth={2} />} delay={0.1}>
              <RepoList repos={topRepositories(repos)} />
            </SectionCard>
          </div>
        )}

        {status === "idle" && (
          <div className="app__empty-state">
            <p>{t.empty.idle}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
