import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import cauNoi from './scripts/cau-noi';

// Bản dựng là MỘT file HTML (mở bằng bấm đúp được), font vẫn lấy từ thư mục fonts/ cạnh file.
export default defineConfig({
  base: './',
  plugins: [cauNoi(), viteSingleFile()],
  build: { outDir: 'dist', emptyOutDir: true, minify: false, cssMinify: false, target: 'es2022' },
});
