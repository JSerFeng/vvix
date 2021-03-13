declare module 'lib/vdom/jsx-runtime' {
	import { Ref } from 'lib/reactivity/index';
	import { Container } from 'lib/renderer/render';
	/** useRef */
	export interface FC<T = any> {
	    (props: T & VNodeData): () => VNode;
	}
	export type VNodeType = string | VNode | FC | null | Symbol; type InternalProps<T = any> = Partial<{
	    ref: Ref<T>;
	    parent: VNode | null;
	    dom: Element;
	    style: Partial<CSSStyleDeclaration>;
	    props: {};
	    children: VNodeChildren;
	    'onCopy': (e: Event) => void;
	    'onCut': (e: Event) => void;
	    'onPaste': (e: Event) => void;
	    'onCompositionEnd': (e: Event) => void;
	    'onCompositionStart': (e: Event) => void;
	    'onCompositionUpdate': (e: Event) => void;
	    'onKeyDown': (e: KeyboardEvent) => void;
	    'onKeyPress': (e: KeyboardEvent) => void;
	    'onKeyUp': (e: KeyboardEvent) => void;
	    'onFocus': (e: Event) => void;
	    'onBlur': (e: Event) => void;
	    'onChange': (e: Event) => void;
	    'onInput': (e: InputEvent) => void;
	    'onSubmit': (e: Event) => void;
	    'onClick': (e: MouseEvent) => void;
	    'onContextMenu': (e: Event) => void;
	    'onDblClick': (e: Event) => void;
	    'onDoubleClick': (e: Event) => void;
	    'onDrag': (e: Event) => void;
	    'onDragEnd': (e: Event) => void;
	    'onDragEnter': (e: Event) => void;
	    'onDragExit': (e: Event) => void;
	    'onDragLeave': (e: Event) => void;
	    'onDragOver': (e: Event) => void;
	    'onDragStart': (e: Event) => void;
	    'onDrop': (e: Event) => void;
	    'onMouseDown': (e: MouseEvent) => void;
	    'onMouseEnter': (e: MouseEvent) => void;
	    'onMouseLeave': (e: MouseEvent) => void;
	    'onMouseMove': (e: MouseEvent) => void;
	    'onMouseOut': (e: MouseEvent) => void;
	    'onMouseOver': (e: MouseEvent) => void;
	    'onMouseUp': (e: MouseEvent) => void;
	    'onSelect': (e: Event) => void;
	    'onTouchCancel': (e: Event) => void;
	    'onTouchEnd': (e: Event) => void;
	    'onTouchMove': (e: Event) => void;
	    'onTouchStart': (e: Event) => void;
	    'onScroll': (e: Event) => void;
	    'onWheel': (e: Event) => void;
	    'onAbort': (e: Event) => void;
	    'onCanPlay': (e: Event) => void;
	    'onCanPlayThrough': (e: Event) => void;
	    'onDurationChange': (e: Event) => void;
	    'onEmptied': (e: Event) => void;
	    'onEncrypted': (e: Event) => void;
	    'onEnded': (e: Event) => void;
	    'onLoadedData': (e: Event) => void;
	    'onLoadedMetadata': (e: Event) => void;
	    'onLoadStart': (e: Event) => void;
	    'onPause': (e: Event) => void;
	    'onPlay': (e: Event) => void;
	    'onPlaying': (e: Event) => void;
	    'onProgress': (e: Event) => void;
	    'onRateChange': (e: Event) => void;
	    'onSeeked': (e: Event) => void;
	    'onSeeking': (e: Event) => void;
	    'onStalled': (e: Event) => void;
	    'onSuspend': (e: Event) => void;
	    'onTimeUpdate': (e: Event) => void;
	    'onVolumeChange': (e: Event) => void;
	    'onWaiting': (e: Event) => void;
	    'onLoad': (e: Event) => void;
	    'onError': (e: Event) => void;
	    'onAnimationStart': (e: Event) => void;
	    'onAnimationEnd': (e: Event) => void;
	    'onAnimationIteration': (e: Event) => void;
	    'onTransitionEnd': (e: Event) => void;
	}>;
	export interface VNodeData extends InternalProps {
	    [K: string]: any;
	}
	export type VNodeChildren = VNode[] | VNode | string | null;
	export enum VNodeFlags {
	    Element = 1,
	    FC = 2,
	    Text = /**          */ 4,
	    Fragment = /**      */ 8
	}
	export enum ChildrenFlags {
	    Multiple = 1,
	    Single = 2,
	    NoChildren = 8
	}
	export interface VNodeInstance {
	    _props: VNodeData;
	    _render: (() => VNode) | null;
	    _mounted: boolean;
	    _vnode: VNode | null;
	    _update: (() => void) | null;
	    _onMount: (() => void)[];
	    _onUnmount: (() => void)[];
	}
	export const Fragment: unique symbol;
	export class VNode {
	    type: VNodeType;
	    data: VNodeData;
	    _isVNode: true;
	    el: Container | null;
	    flags: VNodeFlags;
	    children: VNodeChildren;
	    childFlags: ChildrenFlags;
	    key: any;
	    _instance: VNodeInstance | null;
	    constructor(type: VNodeType, data: VNodeData, children: VNodeChildren);
	}
	export function h(type: VNodeType, data?: VNodeData | null, ...children: (VNode | Object)[]): VNode;
	export const jsx: (type: VNodeType, data: VNodeData, key?: any) => VNode;
	export const jsxs: (type: VNodeType, data: VNodeData, key?: any) => VNode;
	interface JsxCommonProps {
	    className?: string;
	    class?: string;
	    style?: Partial<CSSStyleDeclaration>;
	    key?: any;
	    ref?: any;
	    onClick?: EventListener;
	    onInput?: EventListener;
	    onChange?: EventListener;
	    onKeyDown?: EventListener;
	    onKeyUp?: EventListener;
	    onMouseDown?: EventListener;
	    onMouseUp?: EventListener;
	    onMouseMove?: EventListener;
	    onBlur?: EventListener;
	    onFocus?: EventListener;
	}
	export namespace JSX {
	    interface IntrinsicElements {
	        div: JsxCommonProps;
	        span: JsxCommonProps;
	        ul: JsxCommonProps;
	        li: JsxCommonProps;
	        h1: JsxCommonProps;
	        h2: JsxCommonProps;
	        h3: JsxCommonProps;
	        h4: JsxCommonProps;
	        h5: JsxCommonProps;
	        h6: JsxCommonProps;
	        img: {
	            src: string;
	            alt: string;
	        } & JsxCommonProps;
	        button: JsxCommonProps;
	        input: {
	            value: any;
	            type: "text" | "password" | "button" | "radio" | "checkbox" | "file" | "color" | "date" | "reset" | "submit" | string;
	        } & JsxCommonProps;
	        [k: string]: JsxCommonProps & {
	            [k: string]: any;
	        };
	    }
	    interface ElementAttributesProperty {
	        className: string;
	    }
	}
	export {};

}
declare module 'lib/vdom/index' {
	export * from 'lib/vdom/jsx-runtime';

}
declare module 'lib/shared/index' {
	import { VNode } from 'lib/vdom/index';
	export interface LooseObj {
	    [k: string]: any;
	}
	export interface Fn {
	    (...args: any[]): any;
	}
	export const _warn: (msg: string) => void;
	export const _err: (msg: string, err: any) => void;
	export const isSameVNode: (v1: VNode, v2: VNode) => boolean;
	export const shallowEqual: (propsA: Record<any, any>, propsB: Record<any, any>) => boolean;
	export const lis: (arr: number[]) => number[];
	export const isArray: (value: any) => boolean;
	export const isObject: (value: any) => value is Object;
	export const isUndef: (value: any) => value is null | undefined;
	export const isDef: (value: any) => value is Object;

}
declare module 'lib/reactivity/effect' {
	import { Fn } from 'lib/shared/index';
	export interface Effect {
	    (...args: any[]): any;
	    lazy: boolean;
	    active: boolean;
	    _isEffect: true;
	    raw: Fn;
	    deps: Set<Effect>[];
	    scheduler: (job: Function) => void | null;
	}
	interface Option {
	    lazy: boolean;
	    active: boolean;
	    scheduler: (job: () => any) => void;
	}
	export const effectStack: Fn[];
	export let activeEffect: Effect | null;
	export function effect(fn: Fn, option?: Partial<Option>): Effect;
	export function createEffect(fn: Fn, option: Partial<Option>): Effect;
	export const trigger: (target: Record<any, any>, key: any) => void;
	export const track: (target: Record<any, any>, key: any) => void;
	export const stop: (effect: Effect) => void;
	export const pauseTracking: () => void;
	export const resetTracking: () => void;
	export {};

}
declare module 'lib/reactivity/reactive' {
	export const reactive: <T extends Record<any, any>>(target: T) => T;
	export const toRaw: (target: Record<any, any>) => Record<any, any>;
	export const markRaw: (target: Record<any, any>) => Record<any, any>;
	export type UnwrapRef<T> = T extends Ref<any> ? T["value"] : T;
	export class Ref<T> {
	    private _isRef;
	    private _value;
	    constructor(value?: T);
	    get value(): UnwrapRef<T>;
	    set value(value: UnwrapRef<T>);
	}
	export function ref<T>(): Ref<T | null>;
	export function ref<T>(value: T): Ref<T>;

}
declare module 'lib/reactivity/index' {
	export * from 'lib/reactivity/reactive';
	export * from 'lib/reactivity/effect';

}
declare module 'lib/scheduler/index' {
	export const queueJob: (fn: () => void) => void;

}
declare module 'lib/renderer/render' {
	import { VNode } from 'lib/vdom/index';
	export type NodeOps<Node = any, TextNode = any> = {
	    getElement(...args: any[]): Node | undefined;
	    createElement(type: string): Node;
	    createTextNode(text: string): TextNode;
	    appendChild(parent: Node, el: Node): void;
	    insertBefore(parent: Node, node: Node, refNode: Node): void;
	    removeChild(parent: Node, el: Node): void;
	    setAttribute(el: Node, key: any, value: any): void;
	    setText(el: Node, text: string): void;
	    patchData(el: Node, key: any, newVal: any, oldVal: any, flag?: any): void;
	};
	export interface Container extends HTMLElement {
	    vnode?: VNode | null;
	}
	export const baseNodeOps: NodeOps;
	export function createRenderer(nodeOps: NodeOps): (vnode: VNode, container: Container) => void;
	export const onMounted: (fn: () => any) => void;
	export const onUnmounted: (fn: () => any) => void;
	export const expose: (value: Record<any, any>) => void;
	export const checkHookAvailable: () => boolean;
	export const render: (vnode: VNode, container: Container) => void;

}
declare module 'lib/renderer/index' {
	export * from 'lib/renderer/render';

}
declare module 'lib/core/index' {
	import { Container } from 'lib/renderer/render';
	import { VNode } from 'lib/vdom/index';
	import { NodeOps } from 'lib/renderer/index';
	export const createApp: (app: VNode, nodeOps?: NodeOps<any, any> | undefined) => {
	    mount(container: string | Container | any): void;
	};

}
declare module 'lib/vdom/domAttributes' {
	export interface DomAttrs {
	    setInnerHTML?: string;
	    onCopy?: EventListener;
	    onCopyCapture?: EventListener;
	    onCut?: EventListener;
	    onCutCapture?: EventListener;
	    onPaste?: EventListener;
	    onPasteCapture?: EventListener;
	    onCompositionEnd?: EventListener;
	    onCompositionEndCapture?: EventListener;
	    onCompositionStart?: EventListener;
	    onCompositionStartCapture?: EventListener;
	    onCompositionUpdate?: EventListener;
	    onCompositionUpdateCapture?: EventListener;
	    onFocus?: EventListener;
	    onFocusCapture?: EventListener;
	    onBlur?: EventListener;
	    onBlurCapture?: EventListener;
	    onChange?: EventListener;
	    onChangeCapture?: EventListener;
	    onBeforeInput?: EventListener;
	    onBeforeInputCapture?: EventListener;
	    onInput?: EventListener;
	    onInputCapture?: EventListener;
	    onReset?: EventListener;
	    onResetCapture?: EventListener;
	    onSubmit?: EventListener;
	    onSubmitCapture?: EventListener;
	    onInvalid?: EventListener;
	    onInvalidCapture?: EventListener;
	    onLoad?: EventListener;
	    onLoadCapture?: EventListener;
	    onError?: EventListener;
	    onErrorCapture?: EventListener;
	    onKeyDown?: EventListener;
	    onKeyDownCapture?: EventListener;
	    onKeyPress?: EventListener;
	    onKeyPressCapture?: EventListener;
	    onKeyUp?: EventListener;
	    onKeyUpCapture?: EventListener;
	    onAbort?: EventListener;
	    onAbortCapture?: EventListener;
	    onCanPlay?: EventListener;
	    onCanPlayCapture?: EventListener;
	    onCanPlayThrough?: EventListener;
	    onCanPlayThroughCapture?: EventListener;
	    onDurationChange?: EventListener;
	    onDurationChangeCapture?: EventListener;
	    onEmptied?: EventListener;
	    onEmptiedCapture?: EventListener;
	    onEncrypted?: EventListener;
	    onEncryptedCapture?: EventListener;
	    onEnded?: EventListener;
	    onEndedCapture?: EventListener;
	    onLoadedData?: EventListener;
	    onLoadedDataCapture?: EventListener;
	    onLoadedMetadata?: EventListener;
	    onLoadedMetadataCapture?: EventListener;
	    onLoadStart?: EventListener;
	    onLoadStartCapture?: EventListener;
	    onPause?: EventListener;
	    onPauseCapture?: EventListener;
	    onPlay?: EventListener;
	    onPlayCapture?: EventListener;
	    onPlaying?: EventListener;
	    onPlayingCapture?: EventListener;
	    onProgress?: EventListener;
	    onProgressCapture?: EventListener;
	    onRateChange?: EventListener;
	    onRateChangeCapture?: EventListener;
	    onSeeked?: EventListener;
	    onSeekedCapture?: EventListener;
	    onSeeking?: EventListener;
	    onSeekingCapture?: EventListener;
	    onStalled?: EventListener;
	    onStalledCapture?: EventListener;
	    onSuspend?: EventListener;
	    onSuspendCapture?: EventListener;
	    onTimeUpdate?: EventListener;
	    onTimeUpdateCapture?: EventListener;
	    onVolumeChange?: EventListener;
	    onVolumeChangeCapture?: EventListener;
	    onWaiting?: EventListener;
	    onWaitingCapture?: EventListener;
	    onAuxClick?: EventListener;
	    onAuxClickCapture?: EventListener;
	    onClick?: EventListener;
	    onClickCapture?: EventListener;
	    onContextMenu?: EventListener;
	    onContextMenuCapture?: EventListener;
	    onDoubleClick?: EventListener;
	    onDoubleClickCapture?: EventListener;
	    onDrag?: EventListener;
	    onDragCapture?: EventListener;
	    onDragEnd?: EventListener;
	    onDragEndCapture?: EventListener;
	    onDragEnter?: EventListener;
	    onDragEnterCapture?: EventListener;
	    onDragExit?: EventListener;
	    onDragExitCapture?: EventListener;
	    onDragLeave?: EventListener;
	    onDragLeaveCapture?: EventListener;
	    onDragOver?: EventListener;
	    onDragOverCapture?: EventListener;
	    onDragStart?: EventListener;
	    onDragStartCapture?: EventListener;
	    onDrop?: EventListener;
	    onDropCapture?: EventListener;
	    onMouseDown?: EventListener;
	    onMouseDownCapture?: EventListener;
	    onMouseEnter?: EventListener;
	    onMouseLeave?: EventListener;
	    onMouseMove?: EventListener;
	    onMouseMoveCapture?: EventListener;
	    onMouseOut?: EventListener;
	    onMouseOutCapture?: EventListener;
	    onMouseOver?: EventListener;
	    onMouseOverCapture?: EventListener;
	    onMouseUp?: EventListener;
	    onMouseUpCapture?: EventListener;
	    onSelect?: EventListener;
	    onSelectCapture?: EventListener;
	    onTouchCancel?: EventListener;
	    onTouchCancelCapture?: EventListener;
	    onTouchEnd?: EventListener;
	    onTouchEndCapture?: EventListener;
	    onTouchMove?: EventListener;
	    onTouchMoveCapture?: EventListener;
	    onTouchStart?: EventListener;
	    onTouchStartCapture?: EventListener;
	    onPointerDown?: EventListener;
	    onPointerDownCapture?: EventListener;
	    onPointerMove?: EventListener;
	    onPointerMoveCapture?: EventListener;
	    onPointerUp?: EventListener;
	    onPointerUpCapture?: EventListener;
	    onPointerCancel?: EventListener;
	    onPointerCancelCapture?: EventListener;
	    onPointerEnter?: EventListener;
	    onPointerEnterCapture?: EventListener;
	    onPointerLeave?: EventListener;
	    onPointerLeaveCapture?: EventListener;
	    onPointerOver?: EventListener;
	    onPointerOverCapture?: EventListener;
	    onPointerOut?: EventListener;
	    onPointerOutCapture?: EventListener;
	    onGotPointerCapture?: EventListener;
	    onGotPointerCaptureCapture?: EventListener;
	    onLostPointerCapture?: EventListener;
	    onLostPointerCaptureCapture?: EventListener;
	    onScroll?: EventListener;
	    onScrollCapture?: EventListener;
	    onWheel?: EventListener;
	    onWheelCapture?: EventListener;
	    onAnimationStart?: EventListener;
	    onAnimationStartCapture?: EventListener;
	    onAnimationEnd?: EventListener;
	    onAnimationEndCapture?: EventListener;
	    onAnimationIteration?: EventListener;
	    onAnimationIterationCapture?: EventListener;
	    onTransitionEnd?: EventListener;
	    onTransitionEndCapture?: EventListener;
	}

}


declare module 'index' {
	export * from 'lib/core/index';
	export * from 'lib/reactivity/index';
	export * from 'lib/renderer/index';
	export * from 'lib/scheduler/index';
	export * from 'lib/vdom/index';
}
