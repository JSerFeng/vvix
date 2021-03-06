(function (exports) {
  'use strict';

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

  function App() {
    reactive({});
    return () => {
      return {
        _V__Flag: true,
        type: "div",
        props: {
          "class": "hhh",
          "style": {
            "color": "red"
          }
        },
        children: [
          "hello vix"
        ]
      };
    };
  }

  function mount(vdom) {
    const { type, props, children } = vdom;
    let node;
    if (typeof type === "string") {
      node = document.createElement(type);
    }
    else if (type._V__Flag) {
      node = mount(type);
    }
    else {
      node = document.createElement("div");
    }
    for (const key in props) {
      switch (key) {
        case "class":
        case "className":
          node.className = props[key];
          break;
        case "style":
          const styles = props[key];
          for (const key in styles) {
            node.style[key] = styles[key];
          }
          break;
        default:
          node.setAttribute(key, props[key]);
      }
    }
    if (children && children.length) {
      mountChildren(node, children);
    }
    return node;
  }
  const mountChildren = (parent, children) => {
    for (const child of children) {
      if (typeof child === "string") {
        const text = document.createTextNode(child);
        parent.appendChild(text);
      }
      else {
        parent.appendChild(mount(child));
      }
    }
  };

  const createApp = (app) => {
    return {
      mount(mountName) {
        if (!mountName) {
          console.warn("请指定一个挂在节点的id或者class或者dom节点");
          return;
        }
        if (typeof mountName === "string") {
          mountName = document.querySelector(mountName);
          if (!mountName) {
            console.warn("无效的id或者class");
            return;
          }
        }
        mountName.innerHTML = "";
        const vdomCreator = app({});
        const vdom = mount(vdomCreator());
        mountName.appendChild(vdom);
      }
    };
  };

  const patch = (curr, old) => {
  };
  const patchProps = (instance, newProps, oldProps) => {
    for (const key in newProps) {
      newProps[key];
      oldProps[key];
    }
  };

  const updateQueue = new Set();
  const readyToUpdate = (fn) => {
    updateQueue.add(fn);
  };

  class Vdom {
    constructor(type, props, children) {
      this._V__Flag = true;
      this.type = "";
      this.props = {};
      this.children = [];
      this.type = type;
      this.props = props;
      this.children = children;
    }
  }

  createApp(App).mount("#app");

  exports.Vdom = Vdom;
  exports.createApp = createApp;
  exports.mount = mount;
  exports.patch = patch;
  exports.patchProps = patchProps;
  exports.reactive = reactive;
  exports.readyToUpdate = readyToUpdate;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
