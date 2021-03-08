(function (exports) {
  'use strict';

  const _err = (msg, err) => {
      console.error(msg);
      console.error(err);
  };
  const isSameVNode = (v1, v2) => v1.flags === v2.flags && v1.type === v2.type;

  exports.VNodeFlags = void 0;
  (function (VNodeFlags) {
      VNodeFlags[VNodeFlags["Element"] = 1] = "Element";
      VNodeFlags[VNodeFlags["FC"] = 2] = "FC";
  })(exports.VNodeFlags || (exports.VNodeFlags = {}));
  exports.ChildrenFlags = void 0;
  (function (ChildrenFlags) {
      ChildrenFlags[ChildrenFlags["Multiple"] = 1] = "Multiple";
      ChildrenFlags[ChildrenFlags["Single"] = 2] = "Single";
      ChildrenFlags[ChildrenFlags["Text"] = 4] = "Text";
      ChildrenFlags[ChildrenFlags["NoChildren"] = 8] = "NoChildren";
  })(exports.ChildrenFlags || (exports.ChildrenFlags = {}));
  class VNode {
      constructor(type, data, children) {
          this.data = {};
          this._isVNode = true;
          this.el = null;
          this.key = Symbol();
          this._instance = {
              _render: null,
              _mounted: false,
              _vnode: null,
              _update: null,
              _onMount: [],
              _onUnmount: []
          };
          this.type = type;
          if (typeof type === "function") {
              this.flags = exports.VNodeFlags.FC;
          }
          else {
              this.flags = exports.VNodeFlags.Element;
          }
          this.data = data;
          const isChildrenArray = Array.isArray(children);
          /**确定children类型 */
          if (!children) {
              this.childFlags = exports.ChildrenFlags.NoChildren;
          }
          else if (typeof children === "string") {
              this.childFlags = exports.ChildrenFlags.Text;
          }
          else if (isChildrenArray) {
              /**是数组 */
              if (children.length > 1) {
                  this.childFlags = exports.ChildrenFlags.Multiple;
              }
              else if (children.length === 0) {
                  this.childFlags = exports.ChildrenFlags.NoChildren;
              }
              else {
                  this.childFlags = exports.ChildrenFlags.Single;
              }
          }
          else if (typeof children === "object") {
              this.childFlags = exports.ChildrenFlags.Single;
          }
          else {
              this.childFlags = exports.ChildrenFlags.NoChildren;
              _err("子children类型只能是VNode[] | VNode | string", null);
          }
          this.children = this.childFlags & exports.ChildrenFlags.NoChildren
              ? null
              : this.childFlags & (exports.ChildrenFlags.Multiple | exports.ChildrenFlags.Text)
                  ? children
                  : this.childFlags & exports.ChildrenFlags.Single
                      ? isChildrenArray
                          ? children[0] : children
                      : null;
      }
  }
  function createVNode(type, data, ...children) {
      let _children = null;
      if (children.length === 0) {
          _children = null;
      }
      else if (children.length === 1) {
          _children = children[0];
      }
      else {
          _children = children;
      }
      return new VNode(type, data || {}, _children);
  }

  const patch = (newVNode, oldVNode, container) => {
      if (newVNode && oldVNode) {
          if (isSameVNode(newVNode, oldVNode)) {
              const flags = newVNode.flags;
              if (flags & exports.VNodeFlags.FC) {
                  patchFC(newVNode, oldVNode);
              }
              else {
                  patchElement(newVNode, oldVNode);
              }
          }
          else {
              replaceVNode(newVNode, oldVNode, container);
          }
      }
      else if (newVNode) {
          mount(newVNode, container);
      }
      else if (oldVNode) {
          container.removeChild(oldVNode.el);
      }
  };
  const DomSpecialKeys = /\[A-Z]|^(?:value|checked|selected|muted)$/;
  const patchProp = (el, key, newVal, oldVal) => {
      switch (key) {
          case "style":
              if (newVal) {
                  for (const property in newVal) {
                      /**@ts-ignore */
                      el.style[property] = newVal[property];
                  }
              }
              break;
          case "class":
              el.className = newVal;
              break;
          default:
              if (key.startsWith("on")) {
                  const eventName = key.split("on")[1].toLowerCase();
                  if (newVal !== oldVal) {
                      if (newVal) {
                          el.addEventListener(eventName, newVal);
                      }
                      if (oldVal) {
                          el.removeEventListener(eventName, oldVal);
                      }
                  }
              }
              else if (DomSpecialKeys.test(key)) {
                  /**@ts-ignore */
                  el[key] = newVal;
              }
              else {
                  el.setAttribute(key, newVal);
              }
      }
  };
  const patchFC = (newVNode, oldVNode, container) => {
      newVNode._instance = oldVNode._instance;
      newVNode._instance._update();
  };
  const patchElement = (newVNode, oldVNode, container) => {
      const el = newVNode.el = oldVNode.el;
      for (const key in newVNode.data) {
          patchProp(el, key, newVNode.data[key], oldVNode.data[key]);
      }
      for (const key in oldVNode.data) {
          if (!newVNode.data[key]) {
              patchProp(el, key, null, oldVNode.data[key]);
          }
      }
      patchChildren(newVNode, oldVNode);
  };
  const replaceVNode = (newVNode, oldVNode, container) => {
      container.removeChild(oldVNode.el);
      mount(newVNode, container);
  };
  const patchChildren = (newVNode, oldVNode, container) => {
      const { childFlags: newFlag, children: newChildren } = newVNode;
      const { childFlags: oldFlag, children: oldChildren, el } = oldVNode;
      if (newFlag & exports.ChildrenFlags.NoChildren || newFlag & exports.ChildrenFlags.Text) {
          if (oldFlag & exports.ChildrenFlags.Text) {
              el.textContent = "";
          }
          else if (oldFlag & exports.ChildrenFlags.Single) {
              el.removeChild(oldChildren.el);
          }
          else if (oldFlag & exports.ChildrenFlags.Multiple) {
              for (const child of oldChildren) {
                  unmount(child, el);
              }
          }
          if (newFlag & exports.ChildrenFlags.Text) {
              el.textContent = newChildren;
          }
      }
      else if (newFlag & exports.ChildrenFlags.Single) {
          if (oldFlag & exports.ChildrenFlags.NoChildren) {
              mount(newChildren, el);
          }
          else if (oldFlag & exports.ChildrenFlags.Text) {
              el.textContent = "";
              mount(newChildren, el);
          }
          else if (oldFlag & exports.ChildrenFlags.Single) {
              patch(newChildren, oldChildren, el);
          }
          else if (oldFlag & exports.ChildrenFlags.Multiple) {
              for (const child of oldChildren) {
                  unmount(child, el);
              }
              mount(newChildren, el);
          }
      }
      else if (newFlag & exports.ChildrenFlags.Multiple) {
          if (oldFlag & exports.ChildrenFlags.NoChildren) {
              for (const child of newChildren) {
                  mount(child, el);
              }
          }
          else if (oldFlag & exports.ChildrenFlags.Text) {
              el.textContent = "";
              for (const child of newChildren) {
                  mount(child, el);
              }
          }
          else if (oldFlag & exports.ChildrenFlags.Single) {
              unmount(oldChildren, el);
              for (const child of newChildren) {
                  mount(child, el);
              }
          }
          else if (oldFlag & exports.ChildrenFlags.Multiple) {
              for (const child of oldChildren) {
                  unmount(child, el);
              }
              for (const child of newChildren) {
                  mount(child, el);
              }
          }
      }
  };

  function mount(vnode, container) {
      if (typeof vnode === "string") {
          mountTextChild(container, vnode);
          return;
      }
      const { flags, childFlags, children } = vnode;
      if (flags & exports.VNodeFlags.FC) {
          mountFC(vnode, container);
      }
      else if (flags & exports.VNodeFlags.Element) {
          mountElement(vnode, container);
      }
      /**mount children */
      if (!(childFlags & exports.ChildrenFlags.NoChildren)) {
          if (childFlags & exports.ChildrenFlags.Single) {
              mountSingleChild(vnode, children);
          }
          else if (childFlags & exports.ChildrenFlags.Text) {
              mountTextChild(vnode.el, children);
          }
          else if (childFlags & exports.ChildrenFlags.Multiple) {
              mountMultipleChildren(vnode, children);
          }
      }
  }
  /**@TODO should handle the ref prop */
  const mountFC = (vnode, container) => {
      const { type, data } = vnode;
      vnode._instance._update = () => {
          if (vnode._instance._mounted) {
              const oldVNode = vnode._instance._vnode;
              const newVNode = vnode._instance._render();
              patch(newVNode, oldVNode, container);
              vnode._instance._vnode = newVNode;
          }
          else { /**mount */
              const render = (vnode._instance._render = type(data));
              const newVNode = vnode._instance._vnode = render();
              mount(newVNode, container);
              vnode.el = newVNode.el;
              vnode._instance._mounted = true;
              for (const cb of vnode._instance._onMount) {
                  cb();
              }
          }
      };
      vnode._instance._update();
  };
  const mountElement = (vnode, container) => {
      const { data } = vnode;
      const el = document.createElement(vnode.type);
      for (const key in data) {
          switch (key) {
              case "className":
              case "class":
                  el.className = data[key];
                  break;
              case "style":
                  const styles = data["style"];
                  for (const styleProp in styles) {
                      /**@ts-ignore-next-line */
                      el.style[styleProp] = styles[styleProp];
                  }
                  break;
              default:
                  /**事件 */
                  if (key.startsWith("on")) {
                      const eventName = key.split("on")[1].toLowerCase();
                      const eventCallback = data[key];
                      el.addEventListener(eventName, eventCallback);
                  }
          }
      }
      vnode.el = el;
      container.appendChild(el);
  };
  const mountTextChild = (container, child) => {
      const textNode = document.createTextNode(child);
      container.appendChild(textNode);
  };
  const mountSingleChild = (parent, child) => {
      mount(child, parent.el);
  };
  const mountMultipleChildren = (parent, children) => {
      for (const child of children) {
          mount(child, parent.el);
      }
  };
  const unmount = (vnode, container) => {
      const { childFlags, flags, children } = vnode;
      if (flags & exports.VNodeFlags.Element) {
          container.removeChild(vnode.el);
      }
      else if (flags & exports.VNodeFlags.FC) {
          unmountFC(vnode, container);
      }
  };
  const unmountFC = (vnode, container) => {
      const { childFlags, children } = vnode;
      const el = vnode.el;
      if (childFlags & exports.ChildrenFlags.Multiple) {
          for (const child of children) {
              if (child.flags & exports.VNodeFlags.FC) {
                  unmountFC(child, el);
              }
          }
      }
      let onUnmounted = vnode._instance._onUnmount;
      if (onUnmounted.length) {
          for (const cb of onUnmounted) {
              cb();
          }
      }
      container.removeChild(el);
  };

  const render = (vnode, container) => {
      const oldVNode = container.vnode;
      if (oldVNode) {
          if (vnode) {
              patch(vnode, oldVNode, container);
              container.vnode = vnode;
          }
          else {
              container.removeChild(oldVNode.el);
              container.vnode = null;
          }
      }
      else {
          mount(vnode, container);
          container.vnode = vnode;
      }
  };

  const createApp = (app) => {
      return {
          mount(container) {
              if (!container) {
                  console.warn("请指定一个挂在节点的id或者class或者dom节点");
                  return;
              }
              if (typeof container === "string") {
                  container = document.querySelector(container);
                  if (!container) {
                      console.warn("无效的id或者class");
                      return;
                  }
              }
              container.innerHTML = "";
              render(app, container);
          }
      };
  };

  const baseHandler = {
      get(target, key, receiver) {
          const val = Reflect.get(target, key, receiver);
          return val;
      },
      set(target, key, value, receiver) {
          return Reflect.set(target, key, value, receiver);
      }
  };
  const reactive = (target) => {
      return new Proxy(target, baseHandler);
  };

  const updateQueue = new Set();
  const readyToUpdate = (fn) => {
      updateQueue.add(fn);
  };

  const update = () => {
      const app = document.querySelector("#app");
      app.vnode._instance._update();
  };
  function App() {
      let color = "red";
      let children = [
          createVNode("button", {
              onClick() {
                  children.push(createVNode("h1", {}, "h1 added"));
                  update();
              }
          }, "增加一个"),
          createVNode("button", {
              onClick() {
                  children.pop();
                  update();
              }
          }, "删除一个"),
      ];
      const clickHandler = () => {
          color = color === "red" ? "green" : "red";
      };
      return () => {
          return createVNode("div", {
              style: {
                  color
              },
              onClick: clickHandler
          }, ...children);
      };
  }
  const main = createVNode(App, {});
  createApp(main).mount("#app");

  exports.VNode = VNode;
  exports.createApp = createApp;
  exports.createVNode = createVNode;
  exports.mount = mount;
  exports.patch = patch;
  exports.reactive = reactive;
  exports.readyToUpdate = readyToUpdate;
  exports.render = render;
  exports.unmount = unmount;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
