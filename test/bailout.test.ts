/**
 * @jest-environment jsdom
 */
import { shallowEqual } from "../lib/shared"
import { createVNode, FC } from "../lib/vdom"
import { Container, mount, patch as patchImpl } from '../lib/renderer'

const patch = jest.fn(patchImpl)

document.body.innerHTML = '<div id="app"></div>'
test("shallow equal", () => {
  let foo: Record<any, any> = {
    a: 1,
    b: 2
  }
  let bar: Record<any, any> = {
    a: 1
  }
  expect(shallowEqual(foo, bar)).toBe(false)

  foo = {
    a: 1,
    b: 2
  }
  bar = {
    a: 1,
    b: 2
  }
  expect(shallowEqual(foo, bar)).toBe(true)

  foo = {
    a: {},
    b: 2
  }
  bar = {
    a: {},
    b: 2
  }
  expect(shallowEqual(foo, bar)).toBe(false)
})



test("bailout ", () => {
  const App: FC = (props) => () => createVNode("span", null, props.msg!)
  const vnode1 = createVNode(App, {
    props: {
      msg: "hello"
    }
  })
  const vnode2 = createVNode(App, {
    props: {
      msg: "hello"
    }
  })
  patch(vnode1, vnode2, document.getElementById("app") as Container)
  expect(patch).toBeCalledTimes(1)


  const vnode3 = createVNode(App, {
    props: {
      msg: "hello"
    }
  })
  const vnode4 = createVNode(App, {
    props: {
      msg: "world"
    }
  })
  mount(vnode3, document.getElementById("app") as Container)
  patch(vnode3, vnode4, document.getElementById("app") as Container)
  expect(patch).toBeCalledTimes(3)
})