import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  noExternal: ['@mindfiredigital/textigniter'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  injectStyle: true,
});
