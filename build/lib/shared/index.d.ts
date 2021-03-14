import { VNode } from "../vdom";
export interface LooseObj {
    [k: string]: any;
}
export interface Fn {
    (...args: any[]): any;
}
export declare const _warn: (msg: string) => void;
export declare const _err: (msg: string, err: any) => void;
export declare const isSameVNode: (v1: VNode, v2: VNode) => boolean;
export declare const shallowEqual: (propsA: Record<any, any>, propsB: Record<any, any>) => boolean;
export declare const lis: (arr: number[]) => number[];
export declare const isArray: <T>(value: any) => value is T[];
export declare const isObject: (value: any) => value is Object;
export declare const isUndef: (value: any) => value is null | undefined;
export declare const isDef: (value: any) => value is Object;
