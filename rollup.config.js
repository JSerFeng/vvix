import resolve from 'rollup-plugin-node-resolve'
import commonJsTransformer from 'rollup-plugin-commonjs'
import ts from 'rollup-plugin-typescript2'
import path from 'path'
import babel from 'rollup-plugin-babel';

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

export default {
  // 核心选项
  input: "./index.ts",     // 必须
  output: {  // 必须 (如果要输出多个，可以是一个数组)
    file: "./build/bundle.js",
    format: "iife",
    name: "vvix"
  },
  plugins: [
    tsPlugin,
    babel({
      "exclude": 'node_modules/**', // 只编译我们的源代码
    }),
    resolve(),
    commonJsTransformer(),
  ]
};