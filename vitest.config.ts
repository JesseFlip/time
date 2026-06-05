import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    exclude: ['tests/**/*.spec.ts', 'node_modules/**/*'],
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
