export interface LooseObj {
  [k: string]: any
}

export type VdomType = string

export const _warn = (msg: string) => {
  console.warn(msg)
}
export const _err = (msg: string, err: any) => {
  console.error(msg)
  console.error(err)
}