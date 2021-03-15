import { effect } from "../reactivity";
import { isDef, isSameVNode, isUndef, lis, shallowEqual, _warn } from "../shared";
import { ChildrenFlags, FC, VNode, VNodeChildren, VNodeFlags, VNodeInstance } from "../vdom";
import { queueJob } from "../scheduler";

export type NodeOps<Node = any, TextNode = any, CommentNode = any, SvgEle = any> = {
  getElement(...args: any[]): Node | undefined
  createElement(type: string): Node,
  createTextNode(text: string): TextNode,
  createSvgElement(tag: string): SvgEle,
  createComment(text: string): CommentNode,
  appendChild(parent: Node, el: Node): void,
  insertBefore(parent: Node, node: Node, refNode: Node): void,
  removeChild(parent: Node, el: Node): void,
  setAttribute(el: Node, key: any, value: any): void,
  setText(el: Node, text: string): void,
  patchData(el: Node, key: any, newVal: any, oldVal: any, flag?: any): void
}

export interface Container extends HTMLElement {
  vnode?: VNode | null
}

const DomSpecialKeys = /\[A-Z]|^(?:value|checked|selected|muted)$/
export let _currentMountingFC: VNodeInstance | null = null

export const baseNodeOps: NodeOps = {
  getElement(name) {
    return document.querySelector(name)
  },
  createElement(type: string) {
    return document.createElement(type)
  },
  createTextNode(text: string) {
    return document.createTextNode(text)
  },
  createComment(text: string) {
    return document.createComment(text)
  },
  createSvgElement(tag: string) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag)
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
    } else if (key !== "key" && key !== "children") {
      el.setAttribute(key, value)
    }
  },
  setText(el: Container, text: string) {
    return el.textContent = text
  },
  patchData(el: Container, key: string, newVal: any, oldVal: any, vnodeFlags?: VNodeFlags) {
    if (newVal === oldVal) return
    if (vnodeFlags && (vnodeFlags & VNodeFlags.Element) && (
      key === "children"
    )) {
      return
    }
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

export function createRenderer(nodeOps: NodeOps) {
  /**----------- Mount ------------- */
  function mount(vnode: VNode, container: Container, isSVG: boolean, refNode?: Container) {
    if (isUndef(vnode)) return
    const { flags } = vnode
    if (flags & VNodeFlags.FC) {
      mountFC(vnode, container, isSVG, refNode)
    } else if (flags & (VNodeFlags.Element | VNodeFlags.Svg)) {
      mountElement(vnode, container, isSVG, refNode)
    } else if (flags & VNodeFlags.Text) {
      mountTextChild(vnode, container, refNode)
    } else if (flags & VNodeFlags.Portal) {
      mountPortal(vnode)
    } else {
      mountFragment(vnode, container, isSVG, refNode)
    }
  }

  function mountChildren(
    childFlags: ChildrenFlags,
    children: VNodeChildren,
    vnode: VNode,
    container: Container,
    isSVG: boolean
  ) {
    if (childFlags & ChildrenFlags.NoChildren) {
      return
    }
    if (childFlags & ChildrenFlags.Single) {
      mount(children as VNode, container, isSVG)
    } else if (childFlags & ChildrenFlags.Multiple) {
      const el = vnode.el!
      for (const child of children as VNode[]) {
        mount(child, el, isSVG)
      }
    }
  }

  function mountPortal(vnode: VNode) {
    const el = vnode.el = typeof vnode.key === "string"
      ? nodeOps.getElement(vnode.key)
      : vnode.key
    const childVnode = vnode.children as VNode
    mount(childVnode, el, false)
  }

  function mountFC(vnode: VNode, container: Container, isSVG: boolean, refNode?: Container) {
    const { type } = vnode
    vnode._instance!._update = () => {
      if (vnode._instance!._mounted) {
        /**patch */
        const oldVNode = vnode._instance!._vnode

        const newVNode = vnode._instance!._render!()
        const refNode = oldVNode?.el?.nextSibling as Container
        patch(newVNode, oldVNode, container, isSVG, refNode)
        vnode._instance!._vnode = newVNode
      } else {
        /**mount */
        const newVNode = vnode._instance!._vnode = vnode._instance!._render!()
        mount(newVNode, container, isSVG, refNode)
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
    }, {
      scheduler: queueJob
    })
  }

  function mountElement(vnode: VNode, container: Container, isSVG: boolean, refNode?: Container) {
    const { data, childFlags, children, type } = vnode
    const el = (vnode.el = isSVG
      ? nodeOps.createSvgElement(type as string)
      : nodeOps.createElement(type as string))
    if (data.ref) {
      /**@ts-ignore */
      data.ref.value = el
    }

    for (const key in data) {
      nodeOps.patchData(el, key, data[key], null, VNodeFlags.Element)
    }
    if (refNode) {
      nodeOps.insertBefore(container, el, refNode)
    } else {
      nodeOps.appendChild(container, el)
    }

    /**mount children */
    mountChildren(childFlags, children, vnode, el, isSVG)
  }

  function mountTextChild(vnode: VNode, container: Container, refNode?: Container) {
    const textNode = nodeOps.createTextNode(vnode.children as string)
    vnode.el = textNode as any as Container
    if (refNode) {
      nodeOps.insertBefore(container, textNode, refNode)
    } else {
      nodeOps.appendChild(container, textNode)
    }
  }

  function mountFragment(vnode: VNode, container: Container, isSVG: boolean, refNode?: Container) {
    const { children } = vnode
    if (Array.isArray(children)) {
      (children as VNode[]).forEach(c => mount(c, container, isSVG, refNode))
    } else if (children) {
      mount(children as VNode, container, isSVG, refNode)
    }
    const anchor = nodeOps.createComment("__FRAGMENT_END__")
    vnode.el = anchor
    if (refNode) {
      nodeOps.insertBefore(container, anchor, refNode)
    } else {
      nodeOps.appendChild(container, anchor)
    }
  }

  function unmount(vnode: VNode, container: Container) {
    const { flags, children, el } = vnode
    if (flags & VNodeFlags.Element || flags & VNodeFlags.Text) {
      nodeOps.removeChild(container, vnode.el!)
    } else if (flags & VNodeFlags.FC) {
      unmountFC(vnode, container)
    } else if (flags & VNodeFlags.Fragment) {
      if (Array.isArray(children)) {
        children.forEach(c => unmount(c, container))
      } else if (children) {
        unmount(children as VNode, container)
      }
      nodeOps.removeChild(container, el)
    } else if (flags & VNodeFlags.Portal) {
      const el = vnode.el as Container
      unmount(vnode.children as VNode, el)
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
    vnode._instance = null
    nodeOps.removeChild(container, el)
  }

  /**----------- Update ------------- */
  function patch(
    newVNode: VNode | null | undefined,
    oldVNode: VNode | null | undefined,
    container: Container,
    isSVG: boolean,
    refNode?: Container
  ) {
    if (newVNode && oldVNode) {
      if (isSameVNode(newVNode, oldVNode)) {
        const flags = newVNode.flags
        if (flags & VNodeFlags.FC) {
          patchFC(newVNode, oldVNode)
        } else if (flags & VNodeFlags.Text) {
          patchTextVNode(newVNode, oldVNode)
        } else if (flags & VNodeFlags.Element) {
          patchElement(newVNode, oldVNode, isSVG)
        } else if (flags & VNodeFlags.Portal) {
          patchPortal(newVNode, oldVNode)
        } else {
          patchFragment(newVNode, oldVNode, container, isSVG)
        }
      } else {
        replaceVNode(newVNode, oldVNode, container, isSVG)
      }
    } else if (newVNode) {
      mount(newVNode, container, isSVG, refNode)
    } else if (oldVNode) {
      unmount(oldVNode, container)
    }
  }

  function patchFC(newVNode: VNode, oldVNode: VNode) {
    newVNode.el = oldVNode.el
    newVNode._instance = oldVNode._instance!
    if (bailout(newVNode, oldVNode)) {
      return
    }

    const newData = newVNode._instance!._props
    const oldData = oldVNode._instance!._props

    for (const key in newData) {
      if (newData[key] !== oldData[key]) {
        /**@ts-ignore */
        newVNode._instance._props[key] = newData[key]
      }
    }
    newVNode._instance!._update!()
  }

  function patchElement(newVNode: VNode, oldVNode: VNode, isSVG: boolean) {
    const el = (newVNode.el = oldVNode.el!)
    for (const key in newVNode.data) {
      nodeOps.patchData(el, key, newVNode.data[key], oldVNode.data[key], VNodeFlags.Element)
    }
    for (const key in oldVNode.data) {
      if (!newVNode.data[key]) {
        nodeOps.patchData(el, key, null, oldVNode.data[key], VNodeFlags.Element)
      }
    }
    patchChildren(newVNode, oldVNode, isSVG)
  }

  function patchTextVNode(newVNode: VNode, oldVNode: VNode) {
    const el = (newVNode.el = oldVNode.el)!
    if (newVNode.children !== oldVNode.children) {
      nodeOps.setText(el, newVNode.children as string)
    }
  }

  function patchFragment(newVNode: VNode, oldVNode: VNode, container: Container, isSVG: boolean) {
    const refNode = newVNode.el = oldVNode.el as Container
    patchChildren(newVNode, oldVNode, isSVG, container, refNode)
  }

  function patchPortal(newVNode: VNode, oldVNode: VNode) {
    const el = newVNode.el = oldVNode.el!
    patch(newVNode.children as VNode, oldVNode.children as VNode, el, false)
  }

  function replaceVNode(newVNode: VNode, oldVNode: VNode, container: Container, isSVG: boolean) {
    const refNode = oldVNode.el?.nextSibling as Container
    unmount(oldVNode, container)
    mount(newVNode, container, isSVG, refNode)
  }

  /**if the vnode is fragment, then it's el is the first child, it 
   * can't unmount correctly, so pass the really container if the
   * vnode is fragment
   */
  function patchChildren(newVNode: VNode, oldVNode: VNode, isSVG: boolean, container?: Container, refNode?: Container) {
    const { childFlags: newFlag, children: newChildren } = newVNode
    const { childFlags: oldFlag, children: oldChildren } = oldVNode

    /**el is string only when vnode is a portal */
    const el = container || oldVNode.el as Container

    if (newFlag & ChildrenFlags.NoChildren) {
      if (oldFlag & ChildrenFlags.Single) {
        unmount(oldChildren as VNode, el)
      } else if (oldFlag & ChildrenFlags.Multiple) {
        for (const child of (oldChildren as VNode[])) {
          unmount(child, el)
        }
      }
    } else if (newFlag & ChildrenFlags.Single) {
      if (oldFlag & ChildrenFlags.NoChildren) {
        mount(newChildren as VNode, el!, isSVG, refNode)
      } else if (oldFlag & ChildrenFlags.Single) {
        patch(newChildren as VNode, oldChildren as VNode, el!, isSVG, refNode)
      } else if (oldFlag & ChildrenFlags.Multiple) {
        for (const child of (oldChildren as VNode[])) {
          unmount(child, el!)
        }
        mount(newChildren as VNode, el!, isSVG, refNode)
      }
    } else if (newFlag & ChildrenFlags.Multiple) {
      if (oldFlag & ChildrenFlags.NoChildren) {
        for (const child of (newChildren as VNode[])) {
          mount(child, el!, isSVG, refNode)
        }
      } else if (oldFlag & ChildrenFlags.Single) {
        unmount(oldChildren as VNode, el!)
        for (const child of (newChildren as VNode[])) {
          mount(child, el!, isSVG, refNode)
        }
      } else if (oldFlag & ChildrenFlags.Multiple) {
        patchMultipleChildren(newChildren as VNode[], oldChildren as VNode[], el!, isSVG, refNode)
      }
    }
  }

  function patchMultipleChildren(
    nextChildren: VNode[],
    prevChildren: VNode[],
    container: Container,
    isSVG: boolean,
    refNode?: Container
  ) {
    let i = 0
    let nextEnd = nextChildren.length - 1
    let nextVNode = nextChildren[i]
    let prevEnd = prevChildren.length - 1
    let prevVNode = prevChildren[i]

    outer: {
      while (i <= nextEnd && i <= prevEnd) {
        if (nextVNode.key !== prevVNode.key) {
          break
        }
        patch(nextVNode, prevVNode, container, isSVG)
        i++
        if (i > nextEnd || i > prevEnd) {
          break outer
        }
        nextVNode = nextChildren[i]
        prevVNode = prevChildren[i]
      }
      nextVNode = nextChildren[nextEnd]
      prevVNode = prevChildren[prevEnd]
      while (i <= nextEnd && i <= prevEnd) {
        if (nextVNode.key !== prevVNode.key) {
          break
        }
        patch(nextVNode, prevVNode, container, isSVG)
        nextEnd--
        prevEnd--
        if (i > nextEnd || i > prevEnd) {
          break outer
        }
        nextVNode = nextChildren[nextEnd]
        prevVNode = prevChildren[prevEnd]
      }
    }

    if (i > nextEnd && i <= prevEnd) {
      for (let j = i; j <= prevEnd; j++) {
        unmount(prevChildren[j], container)
      }
    } else if (i > prevEnd) {
      const refNode = prevEnd + 1 >= prevChildren.length ? undefined : prevChildren[prevEnd + 1].el!
      for (let j = i; j <= nextEnd; j++) {
        mount(nextChildren[j], container, isSVG, refNode)
      }
    } else {
      let needMove = false
      let pos = 0
      let patchedNum = 0
      const nextLeftNum = nextEnd - i + 1
      const source = new Array(nextLeftNum).fill(-1)
      const indexMap: Record<any, any> = {}
      const prevKeyMap: Record<any, any> = {}
      for (let j = 0; j < nextLeftNum; j++) {
        indexMap[nextChildren[i + j].key] = j
      }
      for (let j = i; j <= prevEnd; j++) {
        prevVNode = prevChildren[j]
        prevKeyMap[prevVNode.key] = true
        if (patchedNum < nextLeftNum) {
          const idx = indexMap[prevVNode.key]
          if (isDef(idx)) {
            nextVNode = nextChildren[idx + i]
            patch(nextVNode, prevVNode, container, isSVG)
            patchedNum++
            source[idx] = j
            if (idx < pos) {
              needMove = true
            } else {
              pos = idx
            }
          } else { /**移除 */
            unmount(prevVNode, container)
          }
        } else {
          unmount(prevVNode, container)
        }
      }
      /**
       *        [ 0  1  2  3  4 ]
       * old      A  B  C  D  E
       *     
       *             i        j
       * new      A  C  B  F  D 
       * source [ 0  2  1 -1  3 ]
       * seq          [ 2     4 ] 
       *                      s
       */
      if (needMove) {
        const seq = lis(source)
        let s = seq.length - 1
        for (let j = nextEnd; j >= i; j--) {
          nextVNode = nextChildren[j]
          if (source[j] === -1) {
            const refNode = j + 1 < nextChildren.length ? nextChildren[j + 1].el! : undefined
            mount(nextVNode, container, isSVG, refNode)
          }
          if (j === seq[s]) { /** no need for moving */
            s--
          } else {
            const refNode = j + 1 < nextChildren.length ? nextChildren[j + 1].el! : undefined
            nodeOps.insertBefore(container, nextVNode.el, refNode)
          }
        }
      } else {
        for (let j = nextEnd; j >= i; j--) {
          nextVNode = nextChildren[j]
          if (!prevKeyMap[nextVNode.key]) {
            const _refNode = j + 1 >= nextChildren.length ? undefined : nextChildren[j + 1].el!
            mount(nextVNode, container, isSVG, _refNode || refNode)
          }
        }
      }
    }
  }

  function bailout(v1: VNode, v2: VNode): boolean {
    const propsA = v1._instance!._props
    const propsB = v2._instance!._props

    delete propsA.children
    delete propsB.children

    return shallowEqual(propsA, propsB)
  }

  return function renderer(vnode: VNode, container: Container) {
    const isSVG = !!(vnode.flags & VNodeFlags.Svg)
    const oldVNode = container.vnode
    patch(vnode, oldVNode, container, isSVG)
  }
}