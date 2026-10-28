import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import react from '@vitejs/plugin-react';
import cauNoi from './scripts/cau-noi';

// Trang Lớp học thử (server/public/lop.html), một file như ws-editor.html. Dựng: npm run build:lop
export default defineConfig({
  base: './',
  plugins: [cauNoi(), react(), viteSingleFile()],
  publicDir: false,
  build: { outDir: '../server/public', emptyOutDir: true, minify: false, cssMinify: false, target: 'es2022', rollupOptions: { input: 'lop.html' } },
});
