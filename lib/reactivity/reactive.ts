import { isObject, isUndef } from "../shared"
import { track, trigger } from "./effect"

const raw2proxy = new WeakMap<Record<any, any>, Record<any, any>>()
const proxy2raw = new WeakMap<Record<any, any>, Record<any, any>>()

const baseHandler: ProxyHandler<any> = {
  get(target, key, receiver) {
    if (key === "_mark") return true
    if (key === "_raw") return target
    const val = Reflect.get(target, key, receiver)
    track(target, key)
    return isObject(val) && !val._isVNode ? reactive(val) : val
  },
  set(target, key, value, receiver) {
    const oldValue = target[key]
    const result = Reflect.set(target, key, value, receiver)
    if (value !== oldValue) {
      trigger(target, key)
    }
    return result
  },
  has(target, key) {
    const result = Reflect.has(target, key)
    track(target, key)
    return result
  },
  deleteProperty(target, key) {
    const result = Reflect.deleteProperty(target, key)
    trigger(target, key)
    return result
  }
}

export const reactive = <T extends Record<any, any>>(target: T): T => {
  if (typeof target !== "object") return target
  if (target._raw) return target
  let observed: Record<any, any> | undefined
  if (observed = raw2proxy.get(target)) {
    return observed
  }
  observed = new Proxy(target, baseHandler)
  proxy2raw.set(observed as Record<any, any>, target)
  return observed as Record<any, any>
}

export const toRaw = (target: Record<any, any>) => {
  return proxy2raw.get(target) || target
}

export const markRaw = (target: Record<any, any>) => {
  target._raw = true
  return target
}


export type UnwrapRef<T> = T extends Ref<any>
  ? T["value"]
  : T

export const isRef = <T>(ref: Ref<T> | any): ref is Ref<T> => {
  return ref && !!ref._isRef
}
export class Ref<T> {
  private _isRef: true
  private _value: UnwrapRef<T>

  constructor(value?: T) {
    this._isRef = true
    if (isUndef(value)) {
      this._value = null as UnwrapRef<T>
    } else {
      this._value = isObject(value) ? reactive(value) as UnwrapRef<T> : value as UnwrapRef<T>
    }
  }

  get value() {
    track(this, "value")
    return this._value
  }

  set value(value) {
    if (value !== this._value) {
      this._value = value
      trigger(this, "value")
    }
  }
}

export function ref<T = null>(): Ref<T | null>
export function ref<T = null>(value: T): Ref<T>
export function ref<T = null>(value?: T): Ref<T> {
  if (isUndef(value)) {
    return new Ref<T>()
  }
  if (isRef<T>(value)) {
    return value
  }
  return new Ref(value)
}