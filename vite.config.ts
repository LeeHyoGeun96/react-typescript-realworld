import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  // console.log(env.VITE_API_URL);
  if (mode === 'development') {
    return {
      plugins: [react()],
      server: {
        proxy: {
          '/api': {
            target: env.VITE_API_URL, // https://api.realworld.io/api 를 사용
            changeOrigin: true, // CORS 우회
            rewrite: (path) => path.replace(/^\/api/, ''), // 경로 수정
            secure: false, // HTTPS 인증서 문제 우회
          },
        },
      },
    };
  }
  return {
    plugins: [react()],
  };
});
