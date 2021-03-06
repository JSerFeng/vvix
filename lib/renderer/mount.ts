import { Vdom } from "../vdom/vdom";

export function mount(vdom: Vdom): HTMLElement {
  const { type, props, children } = vdom
  let node: HTMLElement
  if (typeof type === "string") {
    node = document.createElement(type)
  } else if (type._V__Flag) {
    node = mount(type)
  } else {
    node = document.createElement("div")
  }

  for (const key in props) {
    switch (key) {
      case "class":
      case "className":
        node.className = props[key]
        break
      case "style":
        const styles = props[key]!
        for (const key in styles) {
          node.style[key] = styles[key]
        }
        break
      default:
        node!.setAttribute(key, props[key])
    }
  }

  if (children && children.length) {
    mountChildren(node, children)
  }

  return node
}

const mountChildren = (parent: HTMLElement, children: (Vdom | "string")[]) => {
  for (const child of children) {
    if (typeof child === "string") {
      const text = document.createTextNode(child)
      parent.appendChild(text)
    } else {
      parent.appendChild(mount(child))
    }
  }
}