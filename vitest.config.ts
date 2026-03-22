/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    conditions: ['development'],
  },
  test: {
    // 测试环境
    environment: 'jsdom',
    
    // 全局设置文件
    setupFiles: ['./src/__tests__/setup.ts'],
    
    // 全局变量
    globals: true,
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
    },
    
    // 包含的测试文件
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    
    // 排除的文件
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    
    // 测试超时时间
    testTimeout: 10000,
    
    // 钩子超时时间
    hookTimeout: 10000,
  },
});