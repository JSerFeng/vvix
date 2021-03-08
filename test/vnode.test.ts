import { createVNode } from '../lib/vdom'

const App = () => () => createVNode("div", {})

test('create vnode', () => {
  const vnode = createVNode("div", null, "hello")
  expect(vnode._isVNode).toBe(true)
  expect(vnode.data).toBeDefined()
  expect(vnode._instance!).toBe(null)

  const fcVNode = createVNode(App, null)
  expect(fcVNode._instance!).toBeDefined()
  expect(fcVNode._instance!._mounted).toBe(false)
})