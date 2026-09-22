import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // "./" (caminho relativo) em vez de um caminho fixo tipo
  // "/github-analytics/": esta app não usa nenhum sistema de rotas
  // (não há react-router, é uma única página), por isso não há razão
  // nenhuma para "prender" o base a uma subpasta específica.
  //
  // Com "./", os ficheiros (JS, CSS, favicon, etc.) são sempre
  // pedidos em relação ao próprio index.html, o que funciona tanto na
  // Vercel (site na raiz do domínio, ex.: teu-projeto.vercel.app)
  // como no GitHub Pages (site numa subpasta, ex.:
  // teu-utilizador.github.io/repositorio/) — sem precisar de escolher
  // um dos dois nem de editar isto ao trocar de sítio onde publicas.
  //
  // Foi também isto que estava a causar o favicon a não aparecer em
  // "npm run dev": o servidor de desenvolvimento do Vite serve os
  // ficheiros de public/ sempre na raiz (ex.: /favicon.svg), mas o
  // index.html, com o "base" antigo, andava a pedi-los com o prefixo
  // "/github-analytics/favicon.svg" — um caminho que nunca existiu.
  base: './',
})
