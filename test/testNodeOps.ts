import { NodeOps } from '../lib/renderer'

let id = 0
export class MockNode {
  id: any
  type: string
  parentNode: MockNode | null
  children: MockNode[]
  textContent: string
  attrs: Record<any, any>
  constructor(type: string, _id?: any) {
    this.id = _id || id++
    this.type = type
    this.textContent = ""
    this.children = []
    this.parentNode = null
    this.attrs = {}
    MockNode.Nodes.push(this)
  }
  appendChild(node: MockNode) {
    this.children.push(node)
  }
  insertBefore(node: MockNode, refNode: MockNode) {
    const idx = this.children.indexOf(refNode)
    if (idx === -1) {
      throw `${node} is not the child of this node`
    }
    this.children.splice(idx, 0, node)
  }
  removeChild(node: MockNode) {
    const idx = this.children.indexOf(node)
    if (idx === -1) {
      throw `${node} is not the child of this node`
    }
    this.children.splice(idx, 1)
  }
  static findNode(id: any) {
    return MockNode.Nodes.find(node => node.id === id)
  }
  static Nodes: MockNode[] = []
}

export const nodeEnvOps: NodeOps<MockNode> = {
  getElement(name: any) {
    return MockNode.findNode(name)
  },
  createElement(type: any) {
    return new MockNode(type)
  },
  createTextNode(text: string) {
    const node = new MockNode("text")
    node.textContent = text
    return node
  },
  setText(node: MockNode, text: string) {
    node.textContent = text
  },
  appendChild(parent: MockNode, el: MockNode) {
    parent.appendChild(el)
  },
  insertBefore(parent: MockNode, node: MockNode, refNode: MockNode) {
    parent.insertBefore(node, refNode)
  },
  removeChild(parent: MockNode, node: MockNode) {
    parent.removeChild(node)
  },
  setAttribute(node: MockNode, key: any, value: any) {
    node.attrs[key] = value
  },
  patchData(node: MockNode, key: any, newVal: any) {
    node.attrs[key] = newVal
  }
}