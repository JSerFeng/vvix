import { Vdom } from "../vdom/vdom";

export function mount(vdom: Vdom): Element {
  const { type, props, children } = vdom
  let node: Element
  if (typeof type === "string") {
    node = document.createElement(type)
  } else if (type._V__Flag) {
    node = mount(type)
  } else {
    node = document.createElement("div")
  }

  for (const key in props) {
    node!.setAttribute(key, props[key])
  }

  if (children && children.length) {
    for (const child of children) {
      node.appendChild(mount(child))
    }
  }

  return node
}