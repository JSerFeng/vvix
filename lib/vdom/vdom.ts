import { Container } from "lib/renderer/render";
import { _err } from "../shared";

/** useRef */
class VNodeReference<T> {
  current: T | null = null
  constructor(value?: T) {
    this.current = value || null
  }
}

export interface FC<T = any> {
  (props?: T): () => VNode
}

export type VNodeType = string | VNode | FC | null

type InternalProps<T = unknown> = Partial<{
  ref: VNodeReference<T>,
  parent: VNode | null,
  dom: Element,
  style: Partial<CSSStyleDeclaration>,
  onClick: (e: MouseEvent) => void,
  onChange: (e: Event) => void,
  onInput: (e: InputEvent) => void
  props: {},
  children: VNode[]
}>
export interface VNodeData extends InternalProps {
  [K: string]: any
}
export type VNodeChildren = VNode[] | VNode | string | null

const None = 0

export enum VNodeFlags {
  Element = /*        */ 0b00000001,
  FC = /*             */ 0b00000010,
  Text = /**          */ 0b00000100
}
export enum ChildrenFlags {
  Multiple = /*       */ 0b00000001,
  Single = /*         */ 0b00000010,
  NoChildren = /*     */ 0b00001000
}

export interface VNodeInstance {
  _props: Record<any, any>,
  _render: (() => VNode) | null,
  _mounted: boolean,
  _vnode: VNode | null,
  _update: (() => void) | null,
  _onMount: (() => void)[],
  _onUnmount: (() => void)[],
}
export class VNode {
  type: VNodeType
  data: VNodeData = {}
  _isVNode: true = true
  el: Container | null = null
  flags: VNodeFlags
  children: VNodeChildren
  childFlags: ChildrenFlags
  key: any = Symbol()
  _instance: VNodeInstance | null = null
  constructor(type: VNodeType, data: VNodeData, children: VNodeChildren) {
    this.type = type
    if (typeof type === "function") {
      this.flags = VNodeFlags.FC
      this._instance = {
        _props: data.props || {},
        _render: null,
        _mounted: false,
        _vnode: null,
        _update: null,
        _onMount: [],
        _onUnmount: []
      }
    } else if (typeof type === "string") {
      this.flags = VNodeFlags.Element
    } else {
      this.flags = VNodeFlags.Text
    }

    this.data = data
    const isChildrenArray = Array.isArray(children)

    /**确定children类型 */
    if (isChildrenArray) {
      /**是数组 */
      this.children = (children as VNode[]).map(c => {
        if (typeof c === 'string') {
          return createVNode(null, null, c)
        }
        return c
      })
      this.childFlags = ChildrenFlags.Multiple
    } else if (typeof children === "object" && children !== null) {
      this.children = children
      this.childFlags = ChildrenFlags.Single
    } else if (typeof children === "string") {
      if (this.flags & VNodeFlags.Text) {
        this.childFlags = ChildrenFlags.NoChildren
        this.children = children
      } else {
        this.childFlags = ChildrenFlags.Single
        this.children = createVNode(null, null, children)
      }
    } else {
      this.childFlags = ChildrenFlags.NoChildren
      this.children = null
    }
  }
}

export function createVNode(type: VNodeType, data: VNodeData | null, ...children: (VNode | Object)[]): VNode {
  let _children: VNodeChildren = null
  if (children.length === 0) {
    _children = null
  } else if (children.length === 1) {
    /**@ts-ignore */
    _children = children[0]
    if (typeof _children !== "object") {
      _children = _children + ""
    }
  } else {
    _children = children as VNodeChildren
  }

  return new VNode(type, data || {}, _children)
}