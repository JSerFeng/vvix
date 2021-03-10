import { VNode } from "lib/vdom"

export interface LooseObj {
  [k: string]: any
}

export interface Fn {
  (...args: any[]): any
}

export const _warn = (msg: string) => {
  console.warn(msg)
}
export const _err = (msg: string, err: any) => {
  console.error(msg)
  console.error(err)
}

export const isSameVNode = (v1: VNode, v2: VNode) => v1.flags === v2.flags && v1.type === v2.type

export const shallowEqual = (propsA: Record<any, any>, propsB: Record<any, any>): boolean => {
  if (Object.keys(propsA).length !== Object.keys(propsB).length)
    return false

  for (const key in propsA) {
    if (!(key in propsB) || propsA[key] !== propsB[key]) {
      return false
    }
  }

  return true
}