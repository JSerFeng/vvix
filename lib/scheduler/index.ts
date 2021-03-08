import { VNode } from "../vdom/vdom";

const updateQueue: WeakSet<() => VNode> = new Set()

export const readyToUpdate = (fn: () => VNode) => {
  updateQueue.add(fn)
}