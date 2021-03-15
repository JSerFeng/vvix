import resolve from 'rollup-plugin-node-resolve'
import commonJsTransformer from 'rollup-plugin-commonjs'
import ts from 'rollup-plugin-typescript2'
import path from 'path'
import babel from 'rollup-plugin-babel';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

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
  input: "./lib/index.ts", 
  output: {
    file: "./build/bundle.js",
    format: "iife",
    name: "vvix",
  },
  plugins: [
    resolve(),
    commonJsTransformer(),
    tsPlugin,
    babel({
      "exclude": 'node_modules/**', // 只编译我们的源代码
    }),
    livereload(),
    serve({
      open: true, // 自动打开页面
      port: 3000,
      openPage: '/build/index.html', // 打开的页面
      contentBase: ''
    })
  ]
};