const typescript = require("@rollup/plugin-typescript");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const { babel } = require("@rollup/plugin-babel");
const terser = require("@rollup/plugin-terser");
const postcss = require("rollup-plugin-postcss");

module.exports = [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "cjs",
      exports: "auto",
    },
    plugins: [
      resolve(),
      commonjs(),
      postcss({
        extensions: [".css"],
        extract: true,
        minimize: true,
      }),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-env"],
      }),
      terser(),
    ],
  },
];
