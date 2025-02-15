import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monkey, { cdn } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 29001,
  },
  plugins: [
    react(),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: 'ReadMark',
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: [
          // '*://*/*'
          'https://tieba.baidu.com/*'
        ],
        connect: [
          'localhost',
          'localhost:29000',
          'rm.mac.suamo.art',
          'rm.mac.suamo.art:8002'
        ],
        require: [
          // https://github.com/Tampermonkey/tampermonkey/issues/2215 All GM_xmlhttpRequest requests are serialized
          'https://raw.githubusercontent.com/Tampermonkey/utils/refs/heads/main/requires/gh_2215_make_GM_xhr_more_parallel_again.js',
        ]
      },
      build: {
        externalGlobals: {
          react: cdn.jsdelivr('React', 'umd/react.production.min.js'),
          'react-dom': cdn.jsdelivr(
            'ReactDOM',
            'umd/react-dom.production.min.js',
          ),
        },
      },
    }),
  ],
});
