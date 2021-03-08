import { VNode } from "lib/vdom"

export interface LooseObj {
  [k: string]: any
}

export const _warn = (msg: string) => {
  console.warn(msg)
}
export const _err = (msg: string, err: any) => {
  console.error(msg)
  console.error(err)
}

export const isSameVNode = (v1: VNode, v2: VNode) => v1.flags === v2.flags && v1.type === v2.type