const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');
const postcss = require('rollup-plugin-postcss');
const { dts } = require('rollup-plugin-dts');
const copy = require('rollup-plugin-copy');

// Get command line arguments
const args = process.argv.slice(2);
const noDts = args.includes('--no-dts');

// Main JS bundle
const mainConfig = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    exports: 'auto',
  },
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      extensions: ['.css'],
      extract: true,
      minimize: true,
      inject: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      compilerOptions: {
        outDir: './dist',
        declarationDir: './dist',
      },
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env'],
    }),
    terser(),
    copy({
      targets: [{ src: 'src/assets/**/*', dest: 'dist/assets' }],
    }),
  ],
};

// Declaration files bundle
const dtsConfig = {
  input: 'src/index.ts',
  output: [{ file: 'dist/index.d.ts', format: 'es' }],
  plugins: [
    dts(),
    // Exclude CSS files from the declaration bundle
    {
      name: 'exclude-css',
      load(id) {
        if (id.endsWith('.css')) {
          return ''; // Ignore CSS files
        }
      },
    },
  ],
};

// Export configs based on flags
module.exports = noDts ? [mainConfig] : [mainConfig, dtsConfig];
