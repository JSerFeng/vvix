import { VNode } from "../vdom"

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

export const lis = (arr: number[]): number[] => {
  const len = arr.length
  if (len === 0) return []
  if (len === 1) return [0]
  const res = new Array(len).fill(1)
  const ret: number[] = []

  let idx = -1
  for (let i = len - 1; i >= 0; i--) {
    const value1 = arr[i]
    for (let j = i + 1; j < len; j++) {
      const value2 = arr[j]
      if (value1 < value2) {
        res[i] = Math.max(res[i], 1 + res[j])
        if (idx === -1 || res[idx] < res[i]) {
          idx = i
        }
      }
    }
  }
  if (idx === -1) return []

  while (idx < len) {
    const currValue = res[idx]
    ret.push(idx++)
    while (res[idx] !== currValue - 1 && idx < len) {
      idx++
    }
  }
  return ret
}

export const isArray = (value: any) => {
  return Array.isArray(value)
}

export const isObject = (value: any): value is Object => {
  return typeof value === "object" && value !== null
}

export const isUndef = (value: any): value is undefined | null => {
  return value === undefined || value === null
}

export const isDef = (value: any): value is Object => {
  return value !== undefined && value !== null
}