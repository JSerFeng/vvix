import { effect } from "lib/reactivity";
import { _warn } from "lib/shared";
import { ChildrenFlags, FC, VNode, VNodeFlags, VNodeInstance } from "../vdom/vdom";
import { patch } from "./patch";
import { Container } from "./render";

export let _currentMountingFC: VNodeInstance | null = null

export function mount(vnode: VNode, container: Container) {
  const { flags, childFlags, children } = vnode
  if (flags & VNodeFlags.FC) {
    mountFC(vnode, container)
  } else if (flags & VNodeFlags.Element) {
    mountElement(vnode, container)
  } else {
    mountTextChild(vnode, container)
  }

  /**mount children */
  if (childFlags & ChildrenFlags.NoChildren) {
    return
  }
  if (childFlags & ChildrenFlags.Single) {
    mountSingleChild(vnode, children as VNode)
  } else if (childFlags & ChildrenFlags.Multiple) {
    mountMultipleChildren(vnode, children as VNode[])
  }
}

/**@TODO should handle the ref prop */
const mountFC = (vnode: VNode, container: Container) => {
  const { type, _instance } = vnode
  _instance!._update = () => {
    if (_instance!._mounted) {
      /**patch */
      const oldVNode = _instance!._vnode

      const newVNode = _instance!._render!()

      patch(newVNode, oldVNode, container)
      vnode._instance!._vnode = newVNode
    } else {
      /**mount */
      const newVNode = _instance!._vnode = _instance!._render!()
      mount(newVNode, container)
      vnode.el = newVNode.el
      vnode._instance!._mounted = true
      for (const cb of vnode._instance!._onMount) {
        cb()
      }
    }
  }
  _currentMountingFC = _instance
  _instance!._render = (type as FC)(
    _instance!._props
  )
  _currentMountingFC = null

  effect(() => {
    _instance!._update!()
  })
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

const mountTextChild = (vnode: VNode, container: Container) => {
  const textNode = document.createTextNode(vnode.children as string)
  vnode.el = textNode as any as Container
  container.vnode = vnode
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
  const { flags } = vnode
  if (flags & VNodeFlags.Element || flags & VNodeFlags.Text) {
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

  let onUnmounted = vnode._instance!._onUnmount
  if (onUnmounted.length) {
    for (const cb of onUnmounted) {
      cb()
    }
  }
  container.removeChild(el)
}

export const onMounted = (fn: () => any) => {
  if (!_currentMountingFC) {
    _warn("hook must be called inside a function component")
  } else {
    _currentMountingFC._onMount.push(fn)
  }
}
export const onUnmounted = (fn: () => any) => {
  if (!_currentMountingFC) {
    _warn("hook must be called inside a function component")
  } else {
    _currentMountingFC._onUnmount.push(fn)
  }
}