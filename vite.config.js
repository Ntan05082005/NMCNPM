import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindPostcss from "@tailwindcss/postcss";import tailwindcss from 'tailwindcss'   

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindPostcss()],
})
