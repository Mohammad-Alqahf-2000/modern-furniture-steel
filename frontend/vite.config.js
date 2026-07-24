// الكود في حال الاتصال المحلي قمنا بتعليقه 
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   server: {
//     port: 3000,
//     proxy: {
//       // توجيه طلبات API للسيرفر
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//         secure: false,
//       },
//       // ✅ توجيه طلبات الصور للسيرفر (هذا هو الجديد)
//       '/uploads': {
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });

// الكود في حال الاستضافة 
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      // توجيه طلبات API للسيرفر السحابي
      '/api': {
        target: 'https://modern-furniture-steel.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      // ✅ توجيه طلبات الصور للسيرفر السحابي (هذا هو الجديد)
      '/uploads': {
        target: 'https://modern-furniture-steel.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});