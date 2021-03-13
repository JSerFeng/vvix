export declare const reactive: <T extends Record<any, any>>(target: T) => T;
export declare const toRaw: (target: Record<any, any>) => Record<any, any>;
export declare const markRaw: (target: Record<any, any>) => Record<any, any>;
export declare type UnwrapRef<T> = T extends Ref<any> ? T["value"] : T;
export declare class Ref<T> {
    private _isRef;
    private _value;
    constructor(value?: T);
    get value(): UnwrapRef<T>;
    set value(value: UnwrapRef<T>);
}
export declare function ref<T>(): Ref<T | null>;
export declare function ref<T>(value: T): Ref<T>;
