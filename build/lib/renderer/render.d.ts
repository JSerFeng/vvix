import { VNode, VNodeInstance } from "../vdom";
export declare type NodeOps<Node = any, TextNode = any, CommentNode = any, SvgEle = any> = {
    getElement(...args: any[]): Node | undefined;
    createElement(type: string): Node;
    createTextNode(text: string): TextNode;
    createSvgElement(tag: string): SvgEle;
    createComment(text: string): CommentNode;
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
export declare let _currentMountingFC: VNodeInstance | null;
export declare const baseNodeOps: NodeOps;
export declare function createRenderer(nodeOps: NodeOps): (vnode: VNode, container: Container) => void;
