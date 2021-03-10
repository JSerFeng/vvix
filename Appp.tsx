import { h, VNode } from './lib/vdom'
import { createApp } from './lib/core'
import { onMounted } from './lib/renderer'
import { reactive } from './lib/reactivity'

const Child = (data: any) => () => h(
  "span",
  {
    style: {
      "color": "blue"
    }
  },
  data.count
)

function App(): () => VNode {
  let state = reactive({
    count: 0
  })
  
  onMounted(() => {
    console.log("onMounted");
  })

  const handleClick = () => {
    state.count++
  }
  return () => h(
    "div",
    { onClick: handleClick },
    h(
      Child,
      {
        props: {
          count: state.count
        }
      }
    )
  )
}

const main: VNode = <App />

createApp(main).mount("#app")

export default App