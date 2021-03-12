import { createApp } from "../lib/core";
import { h } from "../lib/vdom";
import { nodeEnvOps, MockNode } from "./testNodeOps";

test("create vnode", () => {
  const App = () => () => h("span", null, "app child");
  const RootNode = new MockNode("root", "rootFlag");
  createApp(h(App), nodeEnvOps).mount("rootFlag");

  setTimeout(() => {
    expect(RootNode.children[0].type).toBe("span")
  })
});
