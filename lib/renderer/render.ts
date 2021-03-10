import { effect } from "index";
import { isSameVNode, shallowEqual, _warn } from "lib/shared";
import { ChildrenFlags, FC, VNode, VNodeFlags, VNodeInstance } from "lib/vdom";

type RenderOption<Node = any, TextNode = any> = {
  createElement(type: string): Node,
  createTextNode(text: string): TextNode,
  appendChild(parent: Node, el: Node): void,
  insertBefore(parent: Node, node: Node, refNode: Node): void,
  removeChild(parent: Node, el: Node): void,
  setAttribute(el: Node, key: any, value: any): void,
  setText(el: Node, text: string): void,
  patchData(el: Node, key: any, newVal: any, oldVal: any): void
}
export interface Container extends HTMLElement {
  vnode?: VNode | null
}

const DomSpecialKeys = /\[A-Z]|^(?:value|checked|selected|muted)$/
let _currentMountingFC: VNodeInstance | null = null

const baseNodeOps = {
  createElement(type: string) {
    return document.createElement(type)
  },
  createTextNode(text: string) {
    return document.createTextNode(text)
  },
  appendChild(parent: Container, el: Container) {
    return parent.appendChild(el)
  },
  insertBefore(parent: Container, node: Container, refNode: Container) {
    return parent.insertBefore(node, refNode)
  },
  removeChild(parent: Container, el: Container) {
    return parent.removeChild(el)
  },
  setAttribute(el: Container, key: string, value: any) {
    const DomSpecialKeys = /\[A-Z]|^(?:value|checked|selected|muted)$/
    if (DomSpecialKeys.test(key)) {
      /**@ts-ignore */
      el[key] = value
    } else {
      el.setAttribute(key, value)
    }
  },
  setText(el: Container, text: string) {
    return el.textContent = text
  },
  patchData(el: Container, key: string, newVal: any, oldVal: any) {
    if (newVal === oldVal) return
    switch (key) {
      case "style":
        if (newVal) {
          for (const property in newVal) {
            /**@ts-ignore */
            el.style[property] = newVal[property]
          }
        }
        if (oldVal) {
          for (const property in oldVal) {
            if (!newVal || newVal[property] !== oldVal[property]) {
              /**@ts-ignore */
              el.style[property] = ""
            }
          }
        }
        break
      case "class":
        el.className = newVal
        break
      default:
        if (key.startsWith("on")) {
          const eventName = key.split("on")[1].toLowerCase()
          if (newVal) {
            el.addEventListener(eventName, newVal)
          }
          if (oldVal) {
            el.removeEventListener(eventName, oldVal)
          }
        } else if (DomSpecialKeys.test(key)) {
          /**@ts-ignore */
          el[key] = newVal
        } else {
          el.setAttribute(key, newVal)
        }
    }
  }
}

export function createRenderer(nodeOps: RenderOption = baseNodeOps) {
  /**----------- Mount ------------- */
  function mount(vnode: VNode, container: Container) {
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
  function mountFC(vnode: VNode, container: Container) {
    const { type } = vnode
    vnode._instance!._update = () => {
      if (vnode._instance!._mounted) {
        /**patch */
        const oldVNode = vnode._instance!._vnode

        const newVNode = vnode._instance!._render!()

        patch(newVNode, oldVNode, container)
        vnode._instance!._vnode = newVNode
      } else {
        /**mount */
        const newVNode = vnode._instance!._vnode = vnode._instance!._render!()
        mount(newVNode, container)
        vnode.el = newVNode.el
        vnode._instance!._mounted = true
        for (const cb of vnode._instance!._onMount) {
          cb()
        }
      }
    }
    _currentMountingFC = vnode._instance
    vnode._instance!._render = (type as FC)(
      vnode._instance!._props
    )
    _currentMountingFC = null

    effect(() => {
      vnode._instance!._update!()
    })
  }

  function mountElement(vnode: VNode, container: Container) {
    const { data } = vnode
    const el = (vnode.el = nodeOps.createElement(vnode.type as string))
    for (const key in data) {
      nodeOps.patchData(el, key, data[key], null)
    }
    nodeOps.appendChild(container, el)
  }

  function mountTextChild(vnode: VNode, container: Container) {
    const textNode = nodeOps.createTextNode(vnode.children as string)
    vnode.el = textNode as any as Container
    /**@ts-ignore */
    nodeOps.appendChild(container, textNode)
  }

  function mountSingleChild(parent: VNode, child: VNode) {
    mount(child, parent.el!)
  }

  function mountMultipleChildren(parent: VNode, children: VNode[]) {
    for (const child of children) {
      mount(child, parent.el!)
    }
  }

  function unmount(vnode: VNode, container: Container) {
    const { flags } = vnode
    if (flags & VNodeFlags.Element || flags & VNodeFlags.Text) {
      nodeOps.removeChild(container, vnode.el!)
    } else if (flags & VNodeFlags.FC) {
      unmountFC(vnode, container)
    }
  }

  function unmountFC(vnode: VNode, container: Container) {
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

  /**----------- Update ------------- */
  function patch(
    newVNode: VNode | null,
    oldVNode: VNode | null,
    container: Container
  ) {
    if (newVNode && oldVNode) {
      if (isSameVNode(newVNode, oldVNode)) {
        const flags = newVNode.flags
        if (flags & VNodeFlags.FC) {
          patchFC(newVNode, oldVNode)
        } else if (flags & VNodeFlags.Text) {
          patchTextVNode(newVNode, oldVNode)
        } else {
          patchElement(newVNode, oldVNode, container)
        }
      } else {
        replaceVNode(newVNode, oldVNode, container)
      }
    } else if (newVNode) {
      mount(newVNode, container)
    } else if (oldVNode) {
      nodeOps.removeChild(container, oldVNode.el!)
    }
  }

  function patchFC(newVNode: VNode, oldVNode: VNode) {
    if (bailout(newVNode, oldVNode)) {
      return
    }

    const newData = newVNode._instance!._props
    const oldData = oldVNode._instance!._props
    newVNode._instance = oldVNode._instance!

    for (const key in newData) {
      if (newData[key] !== oldData[key]) {
        /**@ts-ignore */
        newVNode._instance._props[key] = newData[key]
      }
    }
    newVNode._instance!._update!()
  }

  function patchElement(newVNode: VNode, oldVNode: VNode, container: Container) {
    const el = (newVNode.el = oldVNode.el!)
    for (const key in newVNode.data) {
      nodeOps.patchData(el, key, newVNode.data[key], oldVNode.data[key])
    }
    for (const key in oldVNode.data) {
      if (!newVNode.data[key]) {
        nodeOps.patchData(el, key, null, oldVNode.data[key])
      }
    }
    patchChildren(newVNode, oldVNode)
  }

  function patchTextVNode(newVNode: VNode, oldVNode: VNode) {
    const el = (newVNode.el = oldVNode.el)!
    if (newVNode.children !== oldVNode.children) {
      nodeOps.setText(el, newVNode.children as string)
    }
  }

  function replaceVNode(newVNode: VNode, oldVNode: VNode, container: Container) {
    container.removeChild(oldVNode.el!)
    mount(newVNode, container)
  }

  function patchChildren(newVNode: VNode, oldVNode: VNode) {
    const { childFlags: newFlag, children: newChildren } = newVNode
    const { childFlags: oldFlag, children: oldChildren, el } = oldVNode
    if (newFlag & ChildrenFlags.NoChildren) {
      if (oldFlag & ChildrenFlags.Single) {
        unmount(oldChildren as VNode, el!)
      } else if (oldFlag & ChildrenFlags.Multiple) {
        for (const child of (oldChildren as VNode[])) {
          unmount(child, el!)
        }
      }
    } else if (newFlag & ChildrenFlags.Single) {
      if (oldFlag & ChildrenFlags.NoChildren) {
        mount(newChildren as VNode, el!)
      } else if (oldFlag & ChildrenFlags.Single) {
        patch(newChildren as VNode, oldChildren as VNode, el!)
      } else if (oldFlag & ChildrenFlags.Multiple) {
        for (const child of (oldChildren as VNode[])) {
          unmount(child, el!)
        }
        mount(newChildren as VNode, el!)
      }
    } else if (newFlag & ChildrenFlags.Multiple) {
      if (oldFlag & ChildrenFlags.NoChildren) {
        for (const child of (newChildren as VNode[])) {
          mount(child, el!)
        }
      } else if (oldFlag & ChildrenFlags.Single) {
        unmount(oldChildren as VNode, el!)
        for (const child of (newChildren as VNode[])) {
          mount(child, el!)
        }
      } else if (oldFlag & ChildrenFlags.Multiple) {
        for (const child of (oldChildren as VNode[])) {
          unmount(child, el!)
        }
        for (const child of (newChildren as VNode[])) {
          mount(child, el!)
        }
      }
    }
  }

  function bailout(v1: VNode, v2: VNode): boolean {
    const propsA = v1._instance!._props
    const propsB = v2._instance!._props

    return shallowEqual(propsA, propsB)
  }

  return function renderer(vnode: VNode, container: Container) {
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
}

export function onMounted(fn: () => any) {
  if (!_currentMountingFC) {
    _warn("hook must be called inside a function component")
  } else {
    _currentMountingFC._onMount.push(fn)
  }
}

export function onUnmounted(fn: () => any) {
  if (!_currentMountingFC) {
    _warn("hook must be called inside a function component")
  } else {
    _currentMountingFC._onUnmount.push(fn)
  }
}

export const render = createRenderer(baseNodeOps)