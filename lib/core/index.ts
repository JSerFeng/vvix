import { Container, createRenderer } from "lib/renderer/render";
import { VNode } from "../vdom";
import { NodeOps, baseNodeOps } from '../renderer'

export const createApp = (app: VNode, nodeOps?: NodeOps) => {
  const render = createRenderer(nodeOps || baseNodeOps)

  return {
    mount(container: string | Container | null) {
      if (!container) {
        console.warn("请指定一个挂在节点的id或者class或者dom节点");
        return
      }
      if (typeof container === "string") {
        container = document.querySelector(container) as HTMLElement
        if (!container) {
          console.warn("无效的id或者class");
          return
        }
      }
      container.innerHTML = ""
      render(app, container)
    }
  }
}