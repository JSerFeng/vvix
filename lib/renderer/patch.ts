import { isSameVNode } from "lib/shared";
import { ChildrenFlags, FC, VNode, VNodeData, VNodeFlags } from "../vdom";
import { mount, unmount } from "./mount";
import { Container } from "./render";

export const patch = (
  newVNode: VNode | null,
  oldVNode: VNode | null,
  container: Container
) => {
  if (newVNode && oldVNode) {
    if (isSameVNode(newVNode, oldVNode)) {
      const flags = newVNode.flags
      if (flags & VNodeFlags.FC) {
        patchFC(newVNode, oldVNode, container)
      } else {
        patchElement(newVNode, oldVNode, container)
      }
    } else {
      replaceVNode(newVNode, oldVNode, container)
    }
  } else if (newVNode) {
    mount(newVNode, container)
  } else if (oldVNode) {
    container.removeChild(oldVNode.el!)
  }
}

const DomSpecialKeys = /\[A-Z]|^(?:value|checked|selected|muted)$/

const patchProp = (
  el: Container,
  key: string,
  newVal: any | null,
  oldVal: any | null,
) => {
  switch (key) {
    case "style":
      if (newVal) {
        for (const property in newVal) {
          /**@ts-ignore */
          el.style[property] = newVal[property]
        }
      }
      break
    case "class":
      el.className = newVal
      break
    default:
      if (key.startsWith("on")) {
        const eventName = key.split("on")[1].toLowerCase()
        if (newVal !== oldVal) {
          if (newVal) {
            el.addEventListener(eventName, newVal)
          }
          if (oldVal) {
            el.removeEventListener(eventName, oldVal)
          }
        }
      } else if (DomSpecialKeys.test(key)) {
        /**@ts-ignore */
        el[key] = newVal
      } else {
        el.setAttribute(key, newVal)
      }
  }
}

const patchFC = (newVNode: VNode, oldVNode: VNode, container: Container) => {
  newVNode._instance = oldVNode._instance
  newVNode._instance._update!()
}

const patchElement = (newVNode: VNode, oldVNode: VNode, container: Container) => {
  const el = newVNode.el = oldVNode.el!
  for (const key in newVNode.data) {
    patchProp(el, key, newVNode.data[key], oldVNode.data[key])
  }
  for (const key in oldVNode.data) {
    if (!newVNode.data[key]) {
      patchProp(el, key, null, oldVNode.data[key])
    }
  }
  patchChildren(newVNode, oldVNode, container)
}

const replaceVNode = (newVNode: VNode, oldVNode: VNode, container: Container) => {
  container.removeChild(oldVNode.el!)
  mount(newVNode, container)
}

const patchChildren = (newVNode: VNode, oldVNode: VNode, container: Container) => {
  const { childFlags: newFlag, children: newChildren } = newVNode
  const { childFlags: oldFlag, children: oldChildren, el } = oldVNode
  if (newFlag & ChildrenFlags.NoChildren || newFlag & ChildrenFlags.Text) {
    if (oldFlag & ChildrenFlags.Text) {
      el!.textContent = ""
    } else if (oldFlag & ChildrenFlags.Single) {
      el!.removeChild((oldChildren as VNode).el!)
    } else if (oldFlag & ChildrenFlags.Multiple) {
      for (const child of (oldChildren as VNode[])) {
        unmount(child, el!)
      }
    }
    if (newFlag & ChildrenFlags.Text) {
      el!.textContent = newChildren as string
    }
  } else if (newFlag & ChildrenFlags.Single) {
    if (oldFlag & ChildrenFlags.NoChildren) {
      mount(newChildren as VNode, el!)
    } else if (oldFlag & ChildrenFlags.Text) {
      el!.textContent = ""
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
    } else if (oldFlag & ChildrenFlags.Text) {
      el!.textContent = ""
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