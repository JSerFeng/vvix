import App from './App'
import { createApp } from './lib/core'
export * from './lib/core'
export * from './lib/reactive'
export * from './lib/renderer'
export * from './lib/scheduler'
export * from './lib/vdom'

createApp(App).mount("#app")