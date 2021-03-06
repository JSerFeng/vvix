import { mount } from "../renderer/mount";
import { Vdom } from "../vdom/vdom";

export interface FC<T = {}> {
  (props: T): () => Vdom
}

export const createApp = (app: FC) => {
  return {
    mount(mountName: string | Element | null) {
      if (!mountName) {
        console.warn("请指定一个挂在节点的id或者class或者dom节点");
        return
      }
      if (typeof mountName === "string") {
        mountName = document.querySelector(mountName)
        if (!mountName) {
          console.warn("无效的id或者class");
          return
        }
      }
      mountName.innerHTML = ""

      const vdomCreator = app({})
      const vdom = mount(vdomCreator())
      mountName.appendChild(vdom)
    }
  }
}