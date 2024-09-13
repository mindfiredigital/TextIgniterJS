const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const css = require("rollup-plugin-css-only");
const { babel } = require("@rollup/plugin-babel");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const { dts } = require("rollup-plugin-dts");

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/rich-text-editor.js",
        format: "esm",
        sourcemap: true,
      },
      {
        file: "dist/rich-text-editor.min.js",
        format: "esm",
        plugins: [terser()],
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      babel({
        babelHelpers: "bundled",
        presets: [
          [
            "@babel/preset-env",
            {
              targets: ">0.2%, not dead, not op_mini all",
              modules: false,
              loose: true,
            },
          ],
        ],
      }),
      css({
        output: "dist/rich-text-editor.min.css",
      }),
    ],
  },
  {
    input: "dist/dts/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];

module.exports = config;
