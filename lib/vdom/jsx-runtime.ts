import { Ref } from "../reactivity";
import { Container } from "../renderer/render";
import { isArray, isDef, isObject, _err } from "../shared";

export interface FC<T = any> {
  (props: T & VNodeData): () => VNode
}

export type VNodeType = string | VNode | FC | null | Symbol

type InternalProps<T = any> = Partial<{
  ref: Ref<T>,
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
  Text = /**          */ 0b00000100,
  Fragment = /**      */ 0b00001000,
  Portal = /**        */ 0b00010000,
  Svg = /**           */ 0b00100000
}

export enum ChildrenFlags {
  Multiple = /*       */ 0b00000001,
  Single = /*         */ 0b00000010,
  NoChildren = /*     */ 0b00001000
}

export interface VNodeInstance {
  _props: VNodeData,
  _render: (() => VNode) | null,
  _mounted: boolean,
  _vnode: VNode | null,
  _update: (() => void) | null,
  _onMount: (() => void)[],
  _onUnmount: (() => void)[],
}

export const Fragment = Symbol("Fragment")
export const Portal = Symbol("Portal")

export class VNode {
  type: VNodeType
  data: VNodeData = {}
  _isVNode: true = true
  el: Container | null = null
  flags: VNodeFlags
  children: VNodeChildren
  childFlags: ChildrenFlags
  key: any
  _instance: VNodeInstance | null = null
  constructor(type: VNodeType, data: VNodeData, children: VNodeChildren, key?: any) {
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
      if (type === "svg") {
        this.flags = VNodeFlags.Svg
      } else {
        this.flags = VNodeFlags.Element
      }
    } else if (type === Fragment) {
      this.flags = VNodeFlags.Fragment
    } else if (type === Portal) {
      this.flags = VNodeFlags.Portal
    } else {
      this.flags = VNodeFlags.Text
    }

    if (isDef(key)) {
      this.key = key
    } else if (isDef(data.key)) {
      this.key = data.key
      delete data.key
    } else {
      this.key = null
    }
    this.data = data

    const isChildrenArray = Array.isArray(children)

    /**??????children?????? */
    if (isChildrenArray) {
      /**????????? */
      this.children = (children as VNode[]).map(c => {
        if (!isObject(c)) {
          /**@ts-ignore */
          return h(null, null, c + "")
        }
        return c
      })

      this.childFlags = ChildrenFlags.Multiple
    } else if (isObject(children)) {
      this.children = children
      this.childFlags = ChildrenFlags.Single
    } else if (isDef(children)) {
      if (this.flags & VNodeFlags.Text) {
        this.childFlags = ChildrenFlags.NoChildren
        /**@ts-ignore */
        this.children = children.toString()
      } else {
        this.childFlags = ChildrenFlags.Single
        /**@ts-ignore */
        this.children = h(null, null, children.toString())
      }
    } else {
      this.childFlags = ChildrenFlags.NoChildren
      this.children = null
    }
  }
}


export function createPortal<Props>(component: FC<Props>, container: Container | string): FC<Props>;
export function createPortal(component: VNode, container: Container | string): FC;
export function createPortal(component: VNode | FC, container: Container | string) {
  const Fc: FC = (props) => {
    if (typeof component === "function") {
      component = jsx(component, props)
    }
    return () => jsx(Portal, {
      children: component as VNodeChildren
    }, container)
  }
  return Fc
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
  if (isArray(children)) {
    let needFlat = false
    let arrToBeFlat: VNode[] = []
    for (const c of children) {
      if (isArray(c)) {
        needFlat = true
        arrToBeFlat = c as VNode[]
        break
      }
    }
    if (needFlat) {
      /**@ts-ignore check if key property exist*/
      const keyMap: Record<any, any> = {}
      for (const c of arrToBeFlat) {
        if (!isDef(c.key)) {
          console.error("child in an array must have a key \n")
        } else if (c.key in keyMap) {
          console.error(
            "[key property] can not be the same \n" +
            "duplicated key: \n" + c.key
          )
          break
        } else {
          keyMap[c.key] = true
        }
      }
      children = children.flat()
    }
  }
  return new VNode(type, data, children as VNodeChildren, key)
}

export const jsxs = jsx


interface JsxCommonProps {
  className?: string
  class?: string
  style?: Partial<CSSStyleDeclaration>
  key?: any
  ref?: any

  onClick?: EventListener
  onInput?: EventListener
  onChange?: EventListener
  onKeyDown?: EventListener
  onKeyUp?: EventListener
  onMouseDown?: EventListener
  onMouseUp?: EventListener
  onMouseMove?: EventListener
  onBlur?: EventListener
  onFocus?: EventListener
}
export declare namespace JSX {
  interface IntrinsicElements {
    div: JsxCommonProps,
    span: JsxCommonProps,
    ul: JsxCommonProps,
    li: JsxCommonProps,
    h1: JsxCommonProps
    h2: JsxCommonProps
    h3: JsxCommonProps
    h4: JsxCommonProps
    h5: JsxCommonProps
    h6: JsxCommonProps
    img: { src: string, alt: string } & JsxCommonProps
    button: JsxCommonProps
    input: {
      value: any,
      type: "text" | "password" | "button" | "radio" | "checkbox" | "file" | "color" | "date" | "reset" | "submit" | string
    } & JsxCommonProps,
    [k: string]: JsxCommonProps & {
      [k: string]: any
    }
  }
  interface ElementAttributesProperty {
    className: string;
  }
}