(function (exports) {
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
                  _props: data.props || {},
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
                      return createVNode(null, null, c);
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
                  this.children = createVNode(null, null, children);
              }
          }
          else {
              this.childFlags = exports.ChildrenFlags.NoChildren;
              this.children = null;
          }
      }
  }
  function createVNode(type, data, ...children) {
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

  const patch = (newVNode, oldVNode, container) => {
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
  const patchFC = (newVNode, oldVNode) => {
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
  };
  const patchElement = (newVNode, oldVNode, container) => {
      const el = (newVNode.el = oldVNode.el);
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
  const patchTextVNode = (newVNode, oldVNode) => {
      const el = (newVNode.el = oldVNode.el);
      if (newVNode.children !== oldVNode.children) {
          el.textContent = newVNode.children;
      }
  };
  const replaceVNode = (newVNode, oldVNode, container) => {
      container.removeChild(oldVNode.el);
      mount(newVNode, container);
  };
  const patchChildren = (newVNode, oldVNode, container) => {
      const { childFlags: newFlag, children: newChildren } = newVNode;
      const { childFlags: oldFlag, children: oldChildren, el } = oldVNode;
      if (newFlag & exports.ChildrenFlags.NoChildren) {
          if (oldFlag & exports.ChildrenFlags.Single) {
              el.removeChild(oldChildren.el);
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
  };
  const bailout = (v1, v2) => {
      const propsA = v1._instance._props;
      const propsB = v2._instance._props;
      return shallowEqual(propsA, propsB);
  };
  const lis = (arr) => {
      const len = arr.length;
      if (len === 0)
          return [];
      if (len === 1)
          return [0];
      const res = new Array(len).fill(1);
      const ret = [];
      let idx = -1;
      for (let i = len - 1; i >= 0; i--) {
          const value1 = arr[i];
          for (let j = i + 1; j < len; j++) {
              const value2 = arr[j];
              if (value1 < value2) {
                  res[i] = Math.max(res[i], 1 + res[j]);
                  if (idx === -1 || res[idx] < res[i]) {
                      idx = i;
                  }
              }
          }
      }
      if (idx === -1)
          return [];
      while (idx < len) {
          const currValue = res[idx];
          ret.push(idx++);
          while (res[idx] !== currValue - 1 && idx < len) {
              idx++;
          }
      }
      return ret;
  };

  exports._currentMountingFC = null;
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
  const mountFC = (vnode, container) => {
      const { type, _instance } = vnode;
      _instance._update = () => {
          if (_instance._mounted) {
              /**patch */
              const oldVNode = _instance._vnode;
              const newVNode = _instance._render();
              patch(newVNode, oldVNode, container);
              vnode._instance._vnode = newVNode;
          }
          else {
              /**mount */
              const newVNode = _instance._vnode = _instance._render();
              mount(newVNode, container);
              vnode.el = newVNode.el;
              vnode._instance._mounted = true;
              for (const cb of vnode._instance._onMount) {
                  cb();
              }
          }
      };
      exports._currentMountingFC = _instance;
      _instance._render = type(_instance._props);
      exports._currentMountingFC = null;
      effect(() => {
          _instance._update();
      });
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
  const mountTextChild = (vnode, container) => {
      const textNode = document.createTextNode(vnode.children);
      vnode.el = textNode;
      container.vnode = vnode;
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
      const { flags } = vnode;
      if (flags & exports.VNodeFlags.Element || flags & exports.VNodeFlags.Text) {
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
  const onMounted = (fn) => {
      if (!exports._currentMountingFC) {
          _warn("hook must be called inside a function component");
      }
      else {
          exports._currentMountingFC._onMount.push(fn);
      }
  };
  const onUnmounted = (fn) => {
      if (!exports._currentMountingFC) {
          _warn("hook must be called inside a function component");
      }
      else {
          exports._currentMountingFC._onUnmount.push(fn);
      }
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

  const updateQueue = new Set();
  const readyToUpdate = (fn) => {
      updateQueue.add(fn);
  };

  const Child = (data) => () => createVNode("span", {
      style: {
          "color": "blue"
      }
  }, "child" + data.count);
  function App() {
      let state = reactive({
          count: 0
      });
      onMounted(() => {
          console.log("onMounted");
      });
      console.log("start mount");
      const handleClick = () => {
          state.count++;
      };
      return () => createVNode("div", { onClick: handleClick }, createVNode(Child, {
          props: {
              count: state.count
          }
      }));
  }
  const main = createVNode(App, {});
  createApp(main).mount("#app");

  exports.VNode = VNode;
  exports.createApp = createApp;
  exports.createEffect = createEffect;
  exports.createVNode = createVNode;
  exports.effect = effect;
  exports.effectStack = effectStack;
  exports.lis = lis;
  exports.markRaw = markRaw;
  exports.mount = mount;
  exports.onMounted = onMounted;
  exports.onUnmounted = onUnmounted;
  exports.patch = patch;
  exports.reactive = reactive;
  exports.readyToUpdate = readyToUpdate;
  exports.render = render;
  exports.stop = stop;
  exports.toRaw = toRaw;
  exports.track = track;
  exports.trigger = trigger;
  exports.unmount = unmount;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
