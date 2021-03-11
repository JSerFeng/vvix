import { NodeOps } from '../lib/renderer'

class MockNode {
  type: string
  parentNode: MockNode
  children: (MockNode | TextNode)[]
  textContent: string
  attrs: Record<any, any>
  constructor(type: string) {
    this.type = type
    this.textContent = ""
    this.children = []
    this.parentNode = null
    this.attrs = {}
  }
  appendChild(node: MockNode | TextNode) {
    this.children.push(node)
  }
  insertBefore(node: MockNode | TextNode, refNode: MockNode | TextNode) {
    const idx = this.children.indexOf(refNode)
    if (idx === -1) {
      throw `${node} is not the child of this node`
    }
    this.children.splice(idx, 0, node)
  }
  removeChild(node: MockNode | TextNode) {
    const idx = this.children.indexOf(node)
    if (idx === -1) {
      throw `${node} is not the child of this node`
    }
    this.children.splice(idx, 1)
  }
}

class TextNode {
  text: string
  constructor(value: string) {
    this.text = value
  }
}

export const nodeOps: NodeOps<MockNode> = {
  createElement(type) {
    return new MockNode(type)
  },
  createTextNode(text) {
    return new TextNode(text)
  },
  setText(node, text) {
    node.textContent = text
  },
  appendChild(parent, el) {
    parent.appendChild(el)
  },
  insertBefore(parent, node, refNode) {
    parent.insertBefore(node, refNode)
  },
  removeChild(parent, node) {
    parent.removeChild(node)
  },
  setAttribute(node, key, value) {
    node.attrs[key] = value
  },
  patchData(node, key, newVal) {
    node[key] = newVal
  }
}