import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),   
  ],
  server: {
    host: true,
    port: 5173,
    // strictPort: true
  },
  extend: {
  animation: {
    fadeInUp: "fadeInUp 0.8s ease-out forwards",
  },
  keyframes: {
    fadeInUp: {
      "0%": { opacity: 0, transform: "translateY(20px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
  },
}

})
