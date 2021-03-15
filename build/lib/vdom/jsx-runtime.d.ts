import { Ref } from "../reactivity";
import { Container } from "../renderer/render";
export interface FC<T = any> {
    (props: T & VNodeData): () => VNode;
}
export declare type VNodeType = string | VNode | FC | null | Symbol;
declare type InternalProps<T = any> = Partial<{
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
export declare type VNodeChildren = VNode[] | VNode | string | null;
export declare enum VNodeFlags {
    Element = 1,
    FC = 2,
    Text = /**          */ 4,
    Fragment = /**      */ 8,
    Portal = /**        */ 16,
    Svg = /**           */ 32
}
export declare enum ChildrenFlags {
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
export declare const Fragment: unique symbol;
export declare const Portal: unique symbol;
export declare class VNode {
    type: VNodeType;
    data: VNodeData;
    _isVNode: true;
    el: Container | null;
    flags: VNodeFlags;
    children: VNodeChildren;
    childFlags: ChildrenFlags;
    key: any;
    _instance: VNodeInstance | null;
    constructor(type: VNodeType, data: VNodeData, children: VNodeChildren, key?: any);
}
export declare function createPortal<Props>(component: FC<Props>, container: Container | string): FC<Props>;
export declare function createPortal(component: VNode, container: Container | string): FC;
export declare function h(type: VNodeType, data?: VNodeData | null, ...children: (VNode | Object)[]): VNode;
export declare const jsx: (type: VNodeType, data: VNodeData, key?: any) => VNode;
export declare const jsxs: (type: VNodeType, data: VNodeData, key?: any) => VNode;
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
export declare namespace JSX {
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
