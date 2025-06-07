import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // your Spring Boot backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});



// vite.config.js
// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': 'http://localhost:8080', // Spring Boot runs on 8080
//     },
//   },
// });


// import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite'
// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//   ],
// })