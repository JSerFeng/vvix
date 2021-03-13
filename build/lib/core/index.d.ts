import { Container } from "../renderer/render";
import { VNode } from "../vdom";
import { NodeOps } from '../renderer';
export declare const createApp: (app: VNode, nodeOps?: NodeOps<any, any> | undefined) => {
    mount(container: string | Container | any): void;
};
