import path from 'path';

import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint({ exclude: ['/virtual:/**', 'node_modules/**'] })],
  test: {
    globals: true, // 따로 설정하지 않아도 jest의 전역 객체를 사용할 수 있게 해준다.
    environment: 'jsdom', // jsdom 환경에서 테스트를 실행한다.
    setupFiles: './src/utils/test/setupTests.js', // 테스트 실행 전에 실행할 파일을 설정한다.
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
