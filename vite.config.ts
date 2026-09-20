import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ⚠️ IMPORTANTE para o GitHub Pages: muda "github-analytics" abaixo
  // para o nome EXATO do teu repositório no GitHub (o que aparece no
  // URL, incluindo maiúsculas/minúsculas) — o site fica publicado em
  // https://TEU-UTILIZADOR.github.io/NOME-DO-REPOSITORIO/, não na
  // raiz do domínio.
  base: '/github-analytics/',
})
