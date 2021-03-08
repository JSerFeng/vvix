import { VNode } from "lib/vdom";
import { mount } from "./mount";
import { patch } from "./patch";

export interface Container extends HTMLElement {
  vnode?: VNode | null
}

export const render = (vnode: VNode, container: Container) => {
  const oldVNode = container.vnode
  if (oldVNode) {
    if (vnode) {
      patch(vnode, oldVNode, container)
      container.vnode = vnode
    } else {
      container.removeChild(oldVNode.el!)
      container.vnode = null
    }
  } else {
    mount(vnode, container)
    container.vnode = vnode
  }
}