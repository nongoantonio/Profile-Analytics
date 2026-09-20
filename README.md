# 🖥️ GitHub Profile Analytics

Escreve um username do GitHub e vê **linguagens mais usadas** (gráfico),
**repositórios em destaque**, e **atividade pública recente** — tudo
com a [API pública do GitHub](https://docs.github.com/en/rest),
gratuita e sem necessidade de conta.

Projeto de estudo em **React + TypeScript + Vite**, construído como
segundo projeto de portfólio (depois do
[Atlas Interativo](https://github.com/nongoantonio/explorador-de-paises)),
desta vez focado em **consumir uma API real de produção** — com todas
as dificuldades que isso traz e que uma API "de brincar" não tem:
limites de pedidos, erros 404 reais, dados que variam muito de
utilizador para utilizador.

---

## ⚠️ Sobre o limite de pedidos (lê isto primeiro)

A API do GitHub permite **60 pedidos por hora, por IP**, sem
autenticação. Cada pesquisa nesta app gasta **3 pedidos** (perfil,
repositórios, atividade), por isso dá para pesquisar cerca de **20
perfis por hora** antes de bateres no limite.

Por isso a barra de pesquisa **não é dinâmica** como no projeto do
Atlas — só pesquisa quando submetes (Enter ou botão), em vez de a
cada letra escrita. Com uma API local isso não custava nada; com uma
API real e limitada, filtrar a cada tecla desperdiçaria o limite em
segundos. É uma decisão de UX a partir de uma restrição técnica real,
não um acaso.

A app mostra sempre, no canto da pesquisa, quantos pedidos ainda
restam (lidos diretamente dos cabeçalhos `X-RateLimit-*` que o GitHub
devolve em toda a resposta) — e trata o erro 403 de limite atingido
de forma distinta de "utilizador não encontrado".

---

## 📦 Como correr o projeto localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`, escreve um username do GitHub (o teu
próprio é um bom teste) e clica em "Analisar".

| Comando           | O que faz                                               |
| ------------------ | -------------------------------------------------------- |
| `npm run dev`       | servidor de desenvolvimento com hot reload               |
| `npm run build`     | compila TypeScript e gera a versão de produção em `dist/` |
| `npm run preview`   | serve localmente a versão de produção já compilada       |

---

## 🚀 Publicação no GitHub Pages

Já vem preparado, tal como o projeto do Atlas:

1. Confirma que o nome em `vite.config.ts` (`base: '/github-analytics/'`)
   bate certo com o nome exato do teu repositório
2. O repositório tem de ser **público** (GitHub Pages no plano
   gratuito não publica repositórios privados)
3. **Settings → Pages → "Build and deployment" → Source: "GitHub Actions"**
4. `git push` para `main` — o workflow `.github/workflows/deploy.yml`
   trata do resto sozinho

---

## 🛠️ Tecnologias e o que cada uma ensina

| Tecnologia | Porquê está aqui |
| --- | --- |
| React 19 + TypeScript | tipagem de respostas de uma API real, mais "suja" que um JSON local |
| Vite | build e dev server |
| [Recharts](https://recharts.org/) | gráfico de linguagens (donut chart) |
| Framer Motion | animações de entrada nas secções e na lista de repositórios |
| lucide-react + react-icons | ícones (o logo do GitHub vem do react-icons, porque o lucide-react deixou de incluir ícones de marcas) |

---

## 📂 Estrutura do projeto

```
src/
├── components/
│   ├── SearchBar.tsx        # pesquisa por submissão (não dinâmica — ver secção acima)
│   ├── RateLimitBadge.tsx   # mostra pedidos restantes, lidos dos headers da resposta
│   ├── ProfileCard.tsx      # avatar, bio, seguidores, estrelas totais
│   ├── LanguageChart.tsx    # gráfico Recharts, carregado com lazy()
│   ├── RepoList.tsx         # repositórios mais populares (por estrelas, sem forks)
│   ├── ActivityFeed.tsx     # traduz eventos da API (PushEvent, etc.) em frases legíveis
│   └── SectionCard.tsx      # contentor genérico das secções do dashboard
├── hooks/
│   └── useGitHubProfile.ts  # orquestra os 3 pedidos e todo o estado (loading/erro/rate-limit)
├── lib/
│   ├── githubApi.ts         # única camada que fala com api.github.com
│   └── repoStats.ts         # agregações puras (linguagens, top repos, total de estrelas)
├── types/github.ts          # tipos das respostas da API
```

### Decisões de arquitetura que valem a pena notar

- **`githubApi.ts` é o único ficheiro que sabe URLs e cabeçalhos.** Os
  componentes só veem `GitHubUser`, `GitHubRepo`, `GitHubEvent` — se um
  dia a API mudar de formato, só se mexe aqui.
- **Erros com classes próprias** (`RateLimitError`, `UserNotFoundError`)
  em vez de strings soltas, para o hook conseguir decidir COMO reagir a
  cada erro, sem andar a comparar mensagens de texto.
- **Pedidos em paralelo com `Promise.all`** para repositórios e
  atividade (não dependem um do outro), mas o perfil pede-se primeiro
  e sozinho — se o utilizador não existir, falha logo, sem gastar mais
  2 pedidos à toa contra o limite de 60/hora.
- **`lazy()` no gráfico**: o Recharts é pesado; só é descarregado
  depois da primeira pesquisa ter sucesso.

---

## 🗺️ Próximos passos

- [ ] Campo opcional para um Personal Access Token (sobe o limite de
      60 para 5000 pedidos/hora) — guardado só em memória, nunca persistido
- [ ] Gráfico de commits por mês (precisa da API de estatísticas de
      contribuição, mais pesada)
- [ ] Comparar dois perfis lado a lado
- [ ] Cache em `sessionStorage` para não gastar pedidos ao pesquisar o mesmo perfil duas vezes

---

## 👤 Autor

**Nongo António** — [GitHub](https://github.com/nongoantonio) · [LinkedIn](https://www.linkedin.com/in/nongo-ant%C3%B3nio-9691603a3/)
