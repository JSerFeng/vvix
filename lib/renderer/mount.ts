import { ChildrenFlags, FC, VNode, VNodeChildren, VNodeFlags } from "../vdom/vdom";
import { patch } from "./patch";
import { Container } from "./render";

export function mount(vnode: VNode | string, container: Container) {
  if (typeof vnode === "string") {
    mountTextChild(container, vnode)
    return
  } 
  const { flags, childFlags, children } = vnode
  if (flags & VNodeFlags.FC) {
    mountFC(vnode, container)
  } else if (flags & VNodeFlags.Element) {
    mountElement(vnode, container)
  }

  /**mount children */
  if (!(childFlags & ChildrenFlags.NoChildren)) {
    if (childFlags & ChildrenFlags.Single) {
      mountSingleChild(vnode, children as VNode)
    } else if (childFlags & ChildrenFlags.Text) {
      mountTextChild(vnode.el!, children as string)
    } else if (childFlags & ChildrenFlags.Multiple) {
      mountMultipleChildren(vnode, children as VNode[])
    }
  }
}

/**@TODO should handle the ref prop */
const mountFC = (vnode: VNode, container: Container) => {
  const { type, data } = vnode
  vnode._instance._update = () => {
    if (vnode._instance._mounted) {
      const oldVNode = vnode._instance._vnode
      const newVNode = vnode._instance._render!()
      patch(newVNode, oldVNode, container)
      vnode._instance._vnode = newVNode
    } else { /**mount */
      const render = (vnode._instance._render = (type as FC)(data))
      const newVNode = vnode._instance._vnode = render()
      mount(newVNode, container)
      vnode.el = newVNode.el
      vnode._instance._mounted = true
      for (const cb of vnode._instance._onMount) {
        cb()
      }
    }
  }
  vnode._instance._update()
}

const mountElement = (vnode: VNode, container: Container) => {
  const { data } = vnode
  const el = document.createElement(vnode.type as string)
  for (const key in data) {
    switch (key) {
      case "className":
      case "class":
        el.className = data[key]
        break
      case "style":
        const styles = data["style"]
        for (const styleProp in styles) {
          /**@ts-ignore-next-line */
          el.style[styleProp] = styles[styleProp]
        }
        break
      default:
        /**事件 */
        if (key.startsWith("on")) {
          const eventName = key.split("on")[1].toLowerCase()
          const eventCallback = data[key]
          el.addEventListener(eventName, eventCallback)
        }
    }
  }
  vnode.el = el
  container.appendChild(el)
}

const mountTextChild = (container: Container, child: string) => {
  const textNode = document.createTextNode(child)
  container.appendChild(textNode)
}

const mountSingleChild = (parent: VNode, child: VNode) => {
  mount(child, parent.el!)
}

const mountMultipleChildren = (parent: VNode, children: VNode[]) => {
  for (const child of children) {
    mount(child, parent.el!)
  }
}

export const unmount = (vnode: VNode, container: Container) => {
  const { childFlags, flags, children } = vnode
  if (flags & VNodeFlags.Element) {
    container.removeChild(vnode.el!)
  } else if (flags & VNodeFlags.FC) {
    unmountFC(vnode, container)
  }
}

const unmountFC = (vnode: VNode, container: Container) => {
  const { childFlags, children } = vnode
  const el = vnode.el!
  if (childFlags & ChildrenFlags.Multiple) {
    for (const child of children as VNode[]) {
      if (child.flags & VNodeFlags.FC) {
        unmountFC(child, el)
      }
    }
  }

  let onUnmounted = vnode._instance._onUnmount
  if (onUnmounted.length) {
    for (const cb of onUnmounted) {
      cb()
    }
  }
  container.removeChild(el)
}