import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd());
  // console.log(env.VITE_API_URL);
  if (mode === 'development') {
    return {
      plugins: [
        react(),
        {
          name: 'html-transform',
          transformIndexHtml(html) {
            if (process.env.NODE_ENV === 'development') {
              return html.replace(
                '</head>',
                `<script src="https://unpkg.com/react-scan/dist/auto.global.js"></script></head>`,
              );
            }
            return html;
          },
        },
      ],
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
      build: {
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // 디버깅을 위한 로그
              console.log('Processing:', id);

              // node_modules 분리
              if (id.includes('node_modules')) {
                return 'vendor';
              }

              // 라우트별 청크 분리
              if (id.includes('/routes/')) {
                const routeName = id.split('/routes/')[1].split('.')[0];
                // action과 컴포넌트를 같은 청크로 묶기
                if (
                  [
                    'login',
                    'register',
                    'editor',
                    'article',
                    'profile',
                    'settings',
                  ].includes(routeName)
                ) {
                  return `route-${routeName}`;
                }
              }

              // 그 외의 경우 기본 청크로
              return 'main';
            },
          },
        },
      },
    };
  }
  return {
    plugins: [react()],
  };
});
