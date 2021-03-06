import resolve from 'rollup-plugin-node-resolve'
import commonJsTransformer from 'rollup-plugin-commonjs'
import ts from 'rollup-plugin-typescript2'

const extensions = [
  '.js',
  '.ts',
  '.tsx'
]

const tsPlugin = ts({
  tsconfig: path.resolve(__dirname, "./tsconfig.json"),
  extensions
})

export default {
  // 核心选项
  input: "./index.ts",     // 必须
  output: {  // 必须 (如果要输出多个，可以是一个数组)
    file: "bundle.js",
    format: "cjs"
  },
  extensions,
  plugins: [
    commonJsTransformer(),
    resolve(),
    tsPlugin
  ]
};