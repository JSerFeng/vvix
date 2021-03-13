import { Fn } from "../shared";
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
export declare const effectStack: Fn[];
export declare let activeEffect: Effect | null;
export declare function effect(fn: Fn, option?: Partial<Option>): Effect;
export declare function createEffect(fn: Fn, option: Partial<Option>): Effect;
export declare const trigger: (target: Record<any, any>, key: any) => void;
export declare const track: (target: Record<any, any>, key: any) => void;
export declare const stop: (effect: Effect) => void;
export declare const pauseTracking: () => void;
export declare const resetTracking: () => void;
export {};
