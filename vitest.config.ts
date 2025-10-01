import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    include: ['**/*.test.{ts,tsx,js}'],
    exclude: ['node_modules', 'dist', 'build', '**/dist/**', '**/build/**'],
  },
});
