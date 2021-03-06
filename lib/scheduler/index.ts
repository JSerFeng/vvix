import { Vdom } from "../vdom/vdom";

const updateQueue: WeakSet<() => Vdom> = new Set()

export const readyToUpdate = (fn: () => Vdom) => {
  updateQueue.add(fn)
}