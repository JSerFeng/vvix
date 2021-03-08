import { createVNode, VNode } from './lib/vdom'
import { createApp } from './lib/core'
import { Container } from './lib/renderer'

const update = () => {
  const app = document.querySelector("#app") as Container
  app.vnode!._instance._update!()
}

function App(): () => VNode {
  let color = "red"
  let children: (VNode | string)[] = [
    createVNode("button", {
      onClick() {
        children.push(
          createVNode(
            "h1",
            {},
            "h1 added"
          )
        )
        update()
      }
    }, "增加一个"),
    createVNode("button", {
      onClick() {
        children.pop()
        update()
      }
    }, "删除一个"),
  ]
  const clickHandler = () => {
    color = color === "red" ? "green" : "red"
  }
  return () => {
    return createVNode(
      "div",
      {
        style: {
          color
        },
        onClick: clickHandler
      },
      ...children
    )
  }
}

const main: VNode = createVNode(
  App,
  {},
)

createApp(main).mount("#app")

export default App