var vvix = (function (exports) {
  'use strict';

  const effectStack = [];
  exports.activeEffect = null;
  function effect(fn, option = {
      lazy: false,
      active: true
  }) {
      const _effect = createEffect(fn, option);
      if (!_effect.lazy) {
          _effect();
      }
      return _effect;
  }
  function createEffect(fn, option) {
      const effect = function reactiveEffect(...args) {
          if (reactiveEffect.active) {
              try {
                  if (!effectStack.includes(effect)) {
                      effectStack.push(reactiveEffect);
                  }
                  exports.activeEffect = effect;
                  return fn(...args);
              }
              finally {
                  effectStack.pop();
                  exports.activeEffect = null;
              }
          }
      };
      effect.lazy = option.lazy || false;
      effect.active = option.active || true;
      effect.raw = fn;
      effect.deps = [];
      return effect;
  }
  const trigger = (target, key) => {
      const depsMap = targetMap.get(target);
      if (!depsMap)
          return;
      const deps = depsMap.get(key);
      if (!deps)
          return;
      deps.forEach(effect => effect());
  };
  const targetMap = new WeakMap();
  const track = (target, key) => {
      if (!exports.activeEffect)
          return;
      let depsMap = targetMap.get(target);
      if (!depsMap) {
          targetMap.set(target, depsMap = new Map());
      }
      let deps = depsMap.get(key);
      if (!deps) {
          depsMap.set(key, deps = new Set());
      }
      if (!deps.has(exports.activeEffect)) {
          deps.add(exports.activeEffect);
          exports.activeEffect.deps.push(deps);
      }
  };
  const stop = (effect) => {
      effect.active = false;
  };

  const raw2proxy = new WeakMap();
  const proxy2raw = new WeakMap();
  const baseHandler = {
      get(target, key, receiver) {
          if (key === "_mark")
              return true;
          if (key === "_raw")
              return target;
          const val = Reflect.get(target, key, receiver);
          track(target, key);
          return typeof val === "object" ? reactive(val) : val;
      },
      set(target, key, value, receiver) {
          const oldValue = target[key];
          const result = Reflect.set(target, key, value, receiver);
          if (value !== oldValue) {
              trigger(target, key);
          }
          return result;
      },
      has(target, key) {
          const result = Reflect.has(target, key);
          track(target, key);
          return result;
      },
      deleteProperty(target, key) {
          const result = Reflect.deleteProperty(target, key);
          trigger(target, key);
          return result;
      }
  };
  const reactive = (target) => {
      if (typeof target !== "object")
          return target;
      if (target._raw)
          return target;
      let observed;
      if (observed = raw2proxy.get(target)) {
          return observed;
      }
      observed = new Proxy(target, baseHandler);
      proxy2raw.set(observed, target);
      return observed;
  };
  const toRaw = (target) => {
      return proxy2raw.get(target) || target;
  };
  const markRaw = (target) => {
      target._raw = true;
      return target;
  };

  const _warn = (msg) => {
      console.warn(msg);
  };
  const isSameVNode = (v1, v2) => v1.flags === v2.flags && v1.type === v2.type;
  const shallowEqual = (propsA, propsB) => {
      if (Object.keys(propsA).length !== Object.keys(propsB).length)
          return false;
      for (const key in propsA) {
          if (!(key in propsB) || propsA[key] !== propsB[key]) {
              return false;
          }
      }
      return true;
  };

  /** useRef */
  exports.VNodeFlags = void 0;
  (function (VNodeFlags) {
      VNodeFlags[VNodeFlags["Element"] = 1] = "Element";
      VNodeFlags[VNodeFlags["FC"] = 2] = "FC";
      VNodeFlags[VNodeFlags["Text"] = 4] = "Text";
  })(exports.VNodeFlags || (exports.VNodeFlags = {}));
  exports.ChildrenFlags = void 0;
  (function (ChildrenFlags) {
      ChildrenFlags[ChildrenFlags["Multiple"] = 1] = "Multiple";
      ChildrenFlags[ChildrenFlags["Single"] = 2] = "Single";
      ChildrenFlags[ChildrenFlags["NoChildren"] = 8] = "NoChildren";
  })(exports.ChildrenFlags || (exports.ChildrenFlags = {}));
  class VNode {
      constructor(type, data, children) {
          this.data = {};
          this._isVNode = true;
          this.el = null;
          this.key = Symbol();
          this._instance = null;
          this.type = type;
          if (typeof type === "function") {
              this.flags = exports.VNodeFlags.FC;
              this._instance = {
                  _props: {
                      children: [],
                      ...data
                  },
                  _render: null,
                  _mounted: false,
                  _vnode: null,
                  _update: null,
                  _onMount: [],
                  _onUnmount: []
              };
          }
          else if (typeof type === "string") {
              this.flags = exports.VNodeFlags.Element;
          }
          else {
              this.flags = exports.VNodeFlags.Text;
          }
          this.data = data;
          const isChildrenArray = Array.isArray(children);
          /**确定children类型 */
          if (isChildrenArray) {
              /**是数组 */
              this.children = children.map(c => {
                  if (typeof c === 'string') {
                      return h(null, null, c);
                  }
                  return c;
              });
              this.childFlags = exports.ChildrenFlags.Multiple;
          }
          else if (typeof children === "object" && children !== null) {
              this.children = children;
              this.childFlags = exports.ChildrenFlags.Single;
          }
          else if (typeof children === "string") {
              if (this.flags & exports.VNodeFlags.Text) {
                  this.childFlags = exports.ChildrenFlags.NoChildren;
                  this.children = children;
              }
              else {
                  this.childFlags = exports.ChildrenFlags.Single;
                  this.children = h(null, null, children);
              }
          }
          else {
              this.childFlags = exports.ChildrenFlags.NoChildren;
              this.children = null;
          }
      }
  }
  function h(type, data, ...children) {
      let _children = null;
      if (children.length === 0) {
          _children = null;
      }
      else if (children.length === 1) {
          /**@ts-ignore */
          _children = children[0];
          if (typeof _children !== "object") {
              _children = _children + "";
          }
      }
      else {
          _children = children;
      }
      return new VNode(type, data || {}, _children);
  }
  const jsx = (type, data, key) => {
      let { children } = data;
      if (children === undefined) {
          children = [];
      }
      else if (!Array.isArray(children)) {
          /**@ts-ignore */
          children = [children];
      }
      return h(type, { key, ...data }, ...children);
  };
  const jsxs = jsx;

  const DomSpecialKeys = /\[A-Z]|^(?:value|checked|selected|muted)$/;
  let _currentMountingFC = null;
  const baseNodeOps = {
      createElement(type) {
          return document.createElement(type);
      },
      createTextNode(text) {
          return document.createTextNode(text);
      },
      appendChild(parent, el) {
          return parent.appendChild(el);
      },
      insertBefore(parent, node, refNode) {
          return parent.insertBefore(node, refNode);
      },
      removeChild(parent, el) {
          return parent.removeChild(el);
      },
      setAttribute(el, key, value) {
          const DomSpecialKeys = /\[A-Z]|^(?:value|checked|selected|muted)$/;
          if (DomSpecialKeys.test(key)) {
              /**@ts-ignore */
              el[key] = value;
          }
          else {
              el.setAttribute(key, value);
          }
      },
      setText(el, text) {
          return el.textContent = text;
      },
      patchData(el, key, newVal, oldVal) {
          if (newVal === oldVal)
              return;
          switch (key) {
              case "style":
                  if (newVal) {
                      for (const property in newVal) {
                          /**@ts-ignore */
                          el.style[property] = newVal[property];
                      }
                  }
                  if (oldVal) {
                      for (const property in oldVal) {
                          if (!newVal || newVal[property] !== oldVal[property]) {
                              /**@ts-ignore */
                              el.style[property] = "";
                          }
                      }
                  }
                  break;
              case "class":
                  el.className = newVal;
                  break;
              default:
                  if (key.startsWith("on")) {
                      const eventName = key.split("on")[1].toLowerCase();
                      if (newVal) {
                          el.addEventListener(eventName, newVal);
                      }
                      if (oldVal) {
                          el.removeEventListener(eventName, oldVal);
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
      }
  };
  function createRenderer(nodeOps = baseNodeOps) {
      /**----------- Mount ------------- */
      function mount(vnode, container) {
          const { flags, childFlags, children } = vnode;
          if (flags & exports.VNodeFlags.FC) {
              mountFC(vnode, container);
          }
          else if (flags & exports.VNodeFlags.Element) {
              mountElement(vnode, container);
          }
          else {
              mountTextChild(vnode, container);
          }
          /**mount children */
          if (childFlags & exports.ChildrenFlags.NoChildren) {
              return;
          }
          if (childFlags & exports.ChildrenFlags.Single) {
              mountSingleChild(vnode, children);
          }
          else if (childFlags & exports.ChildrenFlags.Multiple) {
              mountMultipleChildren(vnode, children);
          }
      }
      /**@TODO should handle the ref prop */
      function mountFC(vnode, container) {
          const { type } = vnode;
          vnode._instance._update = () => {
              if (vnode._instance._mounted) {
                  /**patch */
                  const oldVNode = vnode._instance._vnode;
                  const newVNode = vnode._instance._render();
                  patch(newVNode, oldVNode, container);
                  vnode._instance._vnode = newVNode;
              }
              else {
                  /**mount */
                  const newVNode = vnode._instance._vnode = vnode._instance._render();
                  mount(newVNode, container);
                  vnode.el = newVNode.el;
                  vnode._instance._mounted = true;
                  for (const cb of vnode._instance._onMount) {
                      cb();
                  }
              }
          };
          _currentMountingFC = vnode._instance;
          vnode._instance._render = type(vnode._instance._props);
          _currentMountingFC = null;
          effect(() => {
              vnode._instance._update();
          });
      }
      function mountElement(vnode, container) {
          const { data } = vnode;
          const el = (vnode.el = nodeOps.createElement(vnode.type));
          for (const key in data) {
              nodeOps.patchData(el, key, data[key], null);
          }
          nodeOps.appendChild(container, el);
      }
      function mountTextChild(vnode, container) {
          const textNode = nodeOps.createTextNode(vnode.children);
          vnode.el = textNode;
          /**@ts-ignore */
          nodeOps.appendChild(container, textNode);
      }
      function mountSingleChild(parent, child) {
          mount(child, parent.el);
      }
      function mountMultipleChildren(parent, children) {
          for (const child of children) {
              mount(child, parent.el);
          }
      }
      function unmount(vnode, container) {
          const { flags } = vnode;
          if (flags & exports.VNodeFlags.Element || flags & exports.VNodeFlags.Text) {
              nodeOps.removeChild(container, vnode.el);
          }
          else if (flags & exports.VNodeFlags.FC) {
              unmountFC(vnode, container);
          }
      }
      function unmountFC(vnode, container) {
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
      }
      /**----------- Update ------------- */
      function patch(newVNode, oldVNode, container) {
          if (newVNode && oldVNode) {
              if (isSameVNode(newVNode, oldVNode)) {
                  const flags = newVNode.flags;
                  if (flags & exports.VNodeFlags.FC) {
                      patchFC(newVNode, oldVNode);
                  }
                  else if (flags & exports.VNodeFlags.Text) {
                      patchTextVNode(newVNode, oldVNode);
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
              nodeOps.removeChild(container, oldVNode.el);
          }
      }
      function patchFC(newVNode, oldVNode) {
          if (bailout(newVNode, oldVNode)) {
              return;
          }
          const newData = newVNode._instance._props;
          const oldData = oldVNode._instance._props;
          newVNode._instance = oldVNode._instance;
          for (const key in newData) {
              if (newData[key] !== oldData[key]) {
                  /**@ts-ignore */
                  newVNode._instance._props[key] = newData[key];
              }
          }
          newVNode._instance._update();
      }
      function patchElement(newVNode, oldVNode, container) {
          const el = (newVNode.el = oldVNode.el);
          for (const key in newVNode.data) {
              nodeOps.patchData(el, key, newVNode.data[key], oldVNode.data[key]);
          }
          for (const key in oldVNode.data) {
              if (!newVNode.data[key]) {
                  nodeOps.patchData(el, key, null, oldVNode.data[key]);
              }
          }
          patchChildren(newVNode, oldVNode);
      }
      function patchTextVNode(newVNode, oldVNode) {
          const el = (newVNode.el = oldVNode.el);
          if (newVNode.children !== oldVNode.children) {
              nodeOps.setText(el, newVNode.children);
          }
      }
      function replaceVNode(newVNode, oldVNode, container) {
          container.removeChild(oldVNode.el);
          mount(newVNode, container);
      }
      function patchChildren(newVNode, oldVNode) {
          const { childFlags: newFlag, children: newChildren } = newVNode;
          const { childFlags: oldFlag, children: oldChildren, el } = oldVNode;
          if (newFlag & exports.ChildrenFlags.NoChildren) {
              if (oldFlag & exports.ChildrenFlags.Single) {
                  unmount(oldChildren, el);
              }
              else if (oldFlag & exports.ChildrenFlags.Multiple) {
                  for (const child of oldChildren) {
                      unmount(child, el);
                  }
              }
          }
          else if (newFlag & exports.ChildrenFlags.Single) {
              if (oldFlag & exports.ChildrenFlags.NoChildren) {
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
      }
      function bailout(v1, v2) {
          const propsA = v1._instance._props;
          const propsB = v2._instance._props;
          return shallowEqual(propsA, propsB);
      }
      return function renderer(vnode, container) {
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
  }
  function onMounted(fn) {
      if (!_currentMountingFC) {
          _warn("hook must be called inside a function component");
      }
      else {
          _currentMountingFC._onMount.push(fn);
      }
  }
  function onUnmounted(fn) {
      if (!_currentMountingFC) {
          _warn("hook must be called inside a function component");
      }
      else {
          _currentMountingFC._onUnmount.push(fn);
      }
  }
  const render = createRenderer(baseNodeOps);

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
              const render = createRenderer();
              render(app, container);
          }
      };
  };

  const updateQueue = new Set();
  const readyToUpdate = (fn) => {
      updateQueue.add(fn);
  };

  const Child = props => () => jsx("span", {
    children: props.count
  });

  function App() {
    let state = reactive({
      count: 0
    });
    return () => jsxs("div", {
      style: {
        color: "red"
      },
      onClick: () => {
        state.count++;
      },
      children: [jsx(Child, {
        count: state.count
      }), jsx("div", {
        children: "fuck"
      })]
    });
  }

  createApp(jsx(App, {})).mount("#app");

  exports.VNode = VNode;
  exports.createApp = createApp;
  exports.createEffect = createEffect;
  exports.createRenderer = createRenderer;
  exports.effect = effect;
  exports.effectStack = effectStack;
  exports.h = h;
  exports.jsx = jsx;
  exports.jsxs = jsxs;
  exports.markRaw = markRaw;
  exports.onMounted = onMounted;
  exports.onUnmounted = onUnmounted;
  exports.reactive = reactive;
  exports.readyToUpdate = readyToUpdate;
  exports.render = render;
  exports.stop = stop;
  exports.toRaw = toRaw;
  exports.track = track;
  exports.trigger = trigger;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
