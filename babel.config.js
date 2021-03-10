// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: 'current' } },
    ],
    [
      '@babel/preset-typescript',
      { isTsx: true, jsxPragma: "h" }
    ],
  ],
  plugins: [
    "@babel/plugin-syntax-jsx"
  ]
};