/// <reference types="jest" />
import { createVNode } from '../lib/vdom'

test('create vnode', () => {
  const vnode = createVNode("div", {}, "hello")
  expect(vnode._isVNode).toBe(true)
})