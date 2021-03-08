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

export type VNodeType = string | VNode | FC

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

export enum VNodeFlags {
  Element = /*        */ 0b0000001,
  FC = /*             */ 0b0000010,
}
export enum ChildrenFlags {
  Multiple = /*       */ 0b0000001,
  Single = /*         */ 0b0000010,
  Text = /*           */ 0b0000100,
  NoChildren = /*     */ 0b0001000
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

  _instance: {
    _render: (() => VNode) | null
    _mounted: boolean
    _vnode: VNode | null,
    _update: (() => void) | null,
    _onMount: (() => void)[],
    _onUnmount: (() => void)[],
  } = {
      _render: null,
      _mounted: false,
      _vnode: null,
      _update: null,
      _onMount: [],
      _onUnmount: []
    }
  constructor(type: string | FC, data: VNodeData, children: VNodeChildren) {
    this.type = type
    if (typeof type === "function") {
      this.flags = VNodeFlags.FC
    } else {
      this.flags = VNodeFlags.Element
    }

    this.data = data
    const isChildrenArray = Array.isArray(children)

    /**确定children类型 */
    if (!children) {
      this.childFlags = ChildrenFlags.NoChildren
    } else if (typeof children === "string") {
      this.childFlags = ChildrenFlags.Text
    } else if (isChildrenArray) {
      /**是数组 */
      if ((children as VNode[]).length > 1) {
        this.childFlags = ChildrenFlags.Multiple
      } else if ((children as VNode[]).length === 0) {
        this.childFlags = ChildrenFlags.NoChildren
      } else {
        this.childFlags = ChildrenFlags.Single
      }
    } else if (typeof children === "object") {
      this.childFlags = ChildrenFlags.Single
    } else {
      this.childFlags = ChildrenFlags.NoChildren
      _err("子children类型只能是VNode[] | VNode | string", null)
    }

    this.children = this.childFlags & ChildrenFlags.NoChildren
      ? null
      : this.childFlags & (ChildrenFlags.Multiple | ChildrenFlags.Text)
        ? children
        : this.childFlags & ChildrenFlags.Single
          ? isChildrenArray
            ? (children as VNode[])[0] : children
          : null
  }
}

export function createVNode(type: string | FC, data: VNodeData, ...children: (VNode | string)[]): VNode {
  let _children: VNodeChildren = null
  if (children.length === 0) {
    _children = null
  } else if (children.length === 1) {
    _children = children[0]
  } else {
    _children = children as VNodeChildren
  }
  return new VNode(type, data || {}, _children)
}