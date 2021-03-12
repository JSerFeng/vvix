import { Container, createRenderer } from "../renderer/render";
import { VNode } from "../vdom";
import { NodeOps, baseNodeOps } from '../renderer'

export const createApp = (app: VNode, nodeOps?: NodeOps) => {
  if (!nodeOps) {
    nodeOps = baseNodeOps
  }
  const render = createRenderer(nodeOps)

  return {
    mount(container: string | Container | any) {
      if (!container) {
        console.warn("请指定一个挂在节点的id或者class或者dom节点");
        return
      }
      if (typeof container === "string") {
        container = nodeOps!.getElement(container) as HTMLElement
        if (!container) {
          console.warn("无效的id或者class");
          return
        }
      }
      render(app, container)
    }
  }
}