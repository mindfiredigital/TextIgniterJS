import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  noExternal: ['@mindfiredigital/textigniter'],
  dts: {
    compilerOptions: {
      composite: true,
      paths: {
        '*': ['*'],
      },
      lib: ['DOM', 'DOM.Iterable', 'ESNext'],
    },
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  injectStyle: true,
});
