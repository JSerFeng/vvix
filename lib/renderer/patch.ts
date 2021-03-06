import { Vdom, VdomProps } from "../vdom/vdom";

export const patch = (
  curr: Vdom,
  old: Vdom,
) => {
  
}

export const patchProps = (
  instance: Vdom,
  newProps: VdomProps,
  oldProps: VdomProps,
) => {
  for (const key in newProps) {
    const next = newProps[key]
    const prev = oldProps[key]
    if (next !== prev) {
      
    }
  }
}