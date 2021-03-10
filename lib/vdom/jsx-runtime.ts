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
  props: {},
  children: VNodeChildren,
  'onCopy': (e: Event) => void,
  'onCut': (e: Event) => void,
  'onPaste': (e: Event) => void,
  'onCompositionEnd': (e: Event) => void,
  'onCompositionStart': (e: Event) => void,
  'onCompositionUpdate': (e: Event) => void,
  'onKeyDown': (e: KeyboardEvent) => void,
  'onKeyPress': (e: KeyboardEvent) => void,
  'onKeyUp': (e: KeyboardEvent) => void,
  'onFocus': (e: Event) => void,
  'onBlur': (e: Event) => void,
  'onChange': (e: Event) => void,
  'onInput': (e: InputEvent) => void,
  'onSubmit': (e: Event) => void,
  'onClick': (e: MouseEvent) => void,
  'onContextMenu': (e: Event) => void,
  'onDblClick': (e: Event) => void,
  'onDoubleClick': (e: Event) => void,
  'onDrag': (e: Event) => void,
  'onDragEnd': (e: Event) => void,
  'onDragEnter': (e: Event) => void,
  'onDragExit': (e: Event) => void,
  'onDragLeave': (e: Event) => void,
  'onDragOver': (e: Event) => void,
  'onDragStart': (e: Event) => void,
  'onDrop': (e: Event) => void,
  'onMouseDown': (e: MouseEvent) => void,
  'onMouseEnter': (e: MouseEvent) => void,
  'onMouseLeave': (e: MouseEvent) => void,
  'onMouseMove': (e: MouseEvent) => void,
  'onMouseOut': (e: MouseEvent) => void,
  'onMouseOver': (e: MouseEvent) => void,
  'onMouseUp': (e: MouseEvent) => void,
  'onSelect': (e: Event) => void,
  'onTouchCancel': (e: Event) => void,
  'onTouchEnd': (e: Event) => void,
  'onTouchMove': (e: Event) => void,
  'onTouchStart': (e: Event) => void,
  'onScroll': (e: Event) => void,
  'onWheel': (e: Event) => void,
  'onAbort': (e: Event) => void,
  'onCanPlay': (e: Event) => void,
  'onCanPlayThrough': (e: Event) => void,
  'onDurationChange': (e: Event) => void,
  'onEmptied': (e: Event) => void,
  'onEncrypted': (e: Event) => void,
  'onEnded': (e: Event) => void,
  'onLoadedData': (e: Event) => void,
  'onLoadedMetadata': (e: Event) => void,
  'onLoadStart': (e: Event) => void,
  'onPause': (e: Event) => void,
  'onPlay': (e: Event) => void,
  'onPlaying': (e: Event) => void,
  'onProgress': (e: Event) => void,
  'onRateChange': (e: Event) => void,
  'onSeeked': (e: Event) => void,
  'onSeeking': (e: Event) => void,
  'onStalled': (e: Event) => void,
  'onSuspend': (e: Event) => void,
  'onTimeUpdate': (e: Event) => void,
  'onVolumeChange': (e: Event) => void,
  'onWaiting': (e: Event) => void,
  'onLoad': (e: Event) => void,
  'onError': (e: Event) => void,
  'onAnimationStart': (e: Event) => void,
  'onAnimationEnd': (e: Event) => void,
  'onAnimationIteration': (e: Event) => void,
  'onTransitionEnd': (e: Event) => void,
}>
export interface VNodeData extends InternalProps {
  [K: string]: any
}
export type VNodeChildren = VNode[] | VNode | string | null

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
        _props: {
          children: [],
          ...data
        },
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
          return h(null, null, c)
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
        this.children = h(null, null, children)
      }
    } else {
      this.childFlags = ChildrenFlags.NoChildren
      this.children = null
    }
  }
}

export function h(type: VNodeType, data?: VNodeData | null, ...children: (VNode | Object)[]): VNode {
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

export const jsx = (type: VNodeType, data: VNodeData, key?: any) => {
  let { children } = data
  if (children === undefined) {
    children = []
  } else if (!Array.isArray(children)) {
    /**@ts-ignore */
    children = [children]
  }
  return h(type, { key, ...data }, ...children as VNode[])
}

export const jsxs = jsx