import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/headless.ts',
  output: [
    {
      file: 'dist/headless.js',
      format: 'es', // ESM
    },
    {
      file: 'dist/headless.cjs',
      format: 'cjs', // CommonJS
      exports: 'auto',
    },
    {
      file: 'dist/headless.umd.js',
      format: 'umd', // For browser usage
      name: 'TextIgniterHeadless', // window.TextIgniterHeadless
    },
  ],
  plugins: [resolve(), commonjs(), typescript()],
};
