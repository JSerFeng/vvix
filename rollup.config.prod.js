import resolve from 'rollup-plugin-node-resolve'
import commonJsTransformer from 'rollup-plugin-commonjs'
import ts from 'rollup-plugin-typescript2'
import path from 'path'
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const extensions = [
  '.tsx',
  '.ts',
  '.js',
  '.jsx',
]

const tsPlugin = ts({
  tsconfig: path.resolve(__dirname, "./tsconfig.json"),
  extensions
})


const Global = `;const __DEV__ = false;`


export default {
  input: "./lib/index.ts",
  output: [{
    file: "./build/bundle.cjs.js",
    format: "cjs",
    name: "vvix",
    banner: Global
  }, {
    file: "./build/bundle.esm.js",
    format: "es",
    name: "vvix",
    banner: Global
  }],
  plugins: [
    resolve(),
    commonJsTransformer(),
    tsPlugin,
    babel({
      "exclude": 'node_modules/**', // 只编译我们的源代码
    }),
    terser()
  ]
};