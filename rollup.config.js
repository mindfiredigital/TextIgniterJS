const typescript = require("@rollup/plugin-typescript");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const { babel } = require("@rollup/plugin-babel");
const terser = require("@rollup/plugin-terser");
const postcss = require("rollup-plugin-postcss");
const { dts } = require("rollup-plugin-dts");

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
        extract: false,
        modules: true,
        inject: true,
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "./dist",
      }),
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-env"],
      }),
      terser(),
    ],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];