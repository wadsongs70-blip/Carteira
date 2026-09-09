import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Se você publicar em GitHub Pages num repositório chamado "Carteira",
// o site fica em https://SEU_USUARIO.github.io/Carteira/ — por isso o base
// abaixo precisa bater com o nome exato do repositório (com as barras).
// Se usar Vercel/Netlify, pode deixar base: '/'.
export default defineConfig({
  plugins: [react()],
  base: '/Carteira/',
})
