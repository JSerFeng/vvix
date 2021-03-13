import { VNode } from "../vdom";
export declare type NodeOps<Node = any, TextNode = any> = {
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
export declare const baseNodeOps: NodeOps;
export declare function createRenderer(nodeOps: NodeOps): (vnode: VNode, container: Container) => void;
export declare const onMounted: (fn: () => any) => void;
export declare const onUnmounted: (fn: () => any) => void;
export declare const expose: (value: Record<any, any>) => void;
export declare const checkHookAvailable: () => boolean;
export declare const render: (vnode: VNode, container: Container) => void;
