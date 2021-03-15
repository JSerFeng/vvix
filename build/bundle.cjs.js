'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const _warn$1 = (msg) => {
    console.warn(msg);
};
const _err = (msg, err) => {
    console.error(msg);
    console.error(err);
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
const isArray = (value) => {
    return Array.isArray(value);
};
const isObject = (value) => {
    return typeof value === "object" && value !== null;
};
const isUndef = (value) => {
    return value === undefined || value === null;
};
const isDef = (value) => {
    return value !== undefined && value !== null;
};

const effectStack = [];
exports.activeEffect = null;
let pause = false;
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
        if (reactiveEffect.active && !pause) {
            if (!effectStack.includes(effect)) {
                effectStack.push(reactiveEffect);
                exports.activeEffect = effect;
                fn(...args);
                effectStack.pop();
                exports.activeEffect = null;
            }
        }
    };
    effect.lazy = option.lazy || false;
    effect.active = option.active || true;
    effect.raw = fn;
    effect.deps = [];
    effect.scheduler = (option.scheduler || null);
    return effect;
}
const trigger = (target, key) => {
    const depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    const deps = depsMap.get(key);
    if (!deps)
        return;
    deps.forEach(effect => {
        if (effect !== exports.activeEffect) {
            if (effect.scheduler) {
                effect.scheduler(effect);
            }
            else {
                effect();
            }
        }
    });
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
const pauseTracking = () => {
    pause = true;
};
const resetTracking = () => {
    pause = false;
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
        return isObject(val) && !val._isVNode ? reactive(val) : val;
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
const isRef = (ref) => {
    return ref && !!ref._isRef;
};
class Ref {
    constructor(value) {
        this._isRef = true;
        if (isUndef(value)) {
            this._value = null;
        }
        else {
            this._value = isObject(value) ? reactive(value) : value;
        }
    }
    get value() {
        track(this, "value");
        return this._value;
    }
    set value(value) {
        if (value !== this._value) {
            this._value = value;
            trigger(this, "value");
        }
    }
}
function ref(value) {
    if (isUndef(value)) {
        return new Ref();
    }
    if (isRef(value)) {
        return value;
    }
    return new Ref(value);
}

exports.VNodeFlags = void 0;
(function (VNodeFlags) {
    VNodeFlags[VNodeFlags["Element"] = 1] = "Element";
    VNodeFlags[VNodeFlags["FC"] = 2] = "FC";
    VNodeFlags[VNodeFlags["Text"] = 4] = "Text";
    VNodeFlags[VNodeFlags["Fragment"] = 8] = "Fragment";
    VNodeFlags[VNodeFlags["Portal"] = 16] = "Portal";
    VNodeFlags[VNodeFlags["Svg"] = 32] = "Svg";
})(exports.VNodeFlags || (exports.VNodeFlags = {}));
exports.ChildrenFlags = void 0;
(function (ChildrenFlags) {
    ChildrenFlags[ChildrenFlags["Multiple"] = 1] = "Multiple";
    ChildrenFlags[ChildrenFlags["Single"] = 2] = "Single";
    ChildrenFlags[ChildrenFlags["NoChildren"] = 8] = "NoChildren";
})(exports.ChildrenFlags || (exports.ChildrenFlags = {}));
const Fragment = Symbol("Fragment");
const Portal = Symbol("Portal");
class VNode {
    constructor(type, data, children, key) {
        this.data = {};
        this._isVNode = true;
        this.el = null;
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
            if (type === "svg") {
                this.flags = exports.VNodeFlags.Svg;
            }
            else {
                this.flags = exports.VNodeFlags.Element;
            }
        }
        else if (type === Fragment) {
            this.flags = exports.VNodeFlags.Fragment;
        }
        else if (type === Portal) {
            this.flags = exports.VNodeFlags.Portal;
        }
        else {
            this.flags = exports.VNodeFlags.Text;
        }
        if (isDef(key)) {
            this.key = key;
        }
        else if (isDef(data.key)) {
            this.key = data.key;
            delete data.key;
        }
        else {
            this.key = null;
        }
        this.data = data;
        const isChildrenArray = Array.isArray(children);
        /**确定children类型 */
        if (isChildrenArray) {
            /**是数组 */
            this.children = children.map(c => {
                if (!isObject(c)) {
                    /**@ts-ignore */
                    return h(null, null, c + "");
                }
                return c;
            });
            this.childFlags = exports.ChildrenFlags.Multiple;
        }
        else if (isObject(children)) {
            this.children = children;
            this.childFlags = exports.ChildrenFlags.Single;
        }
        else if (isDef(children)) {
            if (this.flags & exports.VNodeFlags.Text) {
                this.childFlags = exports.ChildrenFlags.NoChildren;
                /**@ts-ignore */
                this.children = children.toString();
            }
            else {
                this.childFlags = exports.ChildrenFlags.Single;
                /**@ts-ignore */
                this.children = h(null, null, children.toString());
            }
        }
        else {
            this.childFlags = exports.ChildrenFlags.NoChildren;
            this.children = null;
        }
    }
}
function createPortal(component, container) {
    const Fc = (props) => {
        if (typeof component === "function") {
            component = jsx(component, props);
        }
        return () => jsx(Portal, {
            children: component
        }, container);
    };
    return Fc;
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
    if (isArray(children)) {
        let needFlat = false;
        let arrToBeFlat = [];
        for (const c of children) {
            if (isArray(c)) {
                needFlat = true;
                arrToBeFlat = c;
                break;
            }
        }
        if (needFlat) {
            /**@ts-ignore check if key property exist*/
            const keyMap = {};
            for (const c of arrToBeFlat) {
                if (!isDef(c.key)) {
                    console.error("child in an array must have a key \n");
                }
                else if (c.key in keyMap) {
                    console.error("[key property] can not be the same \n" +
                        "duplicated key: \n" + c.key);
                    break;
                }
                else {
                    keyMap[c.key] = true;
                }
            }
            children = children.flat();
        }
    }
    return new VNode(type, data, children, key);
};
const jsxs = jsx;

const updateQueue = [];
let flushing = false;
const queueJob = (fn) => {
    if (!updateQueue.includes(fn)) {
        updateQueue.push(fn);
    }
    if (!flushing) {
        flushing = true;
        Promise.resolve().then(flushWork);
    }
};
const flushWork = () => {
    updateQueue.forEach(cb => cb());
    updateQueue.length = 0;
    flushing = false;
};

const DomSpecialKeys = /\[A-Z]|^(?:value|checked|selected|muted)$/;
exports._currentMountingFC = null;
const baseNodeOps = {
    getElement(name) {
        return document.querySelector(name);
    },
    createElement(type) {
        return document.createElement(type);
    },
    createTextNode(text) {
        return document.createTextNode(text);
    },
    createComment(text) {
        return document.createComment(text);
    },
    createSvgElement(tag) {
        return document.createElementNS('http://www.w3.org/2000/svg', tag);
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
        else if (key !== "key" && key !== "children") {
            el.setAttribute(key, value);
        }
    },
    setText(el, text) {
        return el.textContent = text;
    },
    patchData(el, key, newVal, oldVal, vnodeFlags) {
        if (newVal === oldVal)
            return;
        if (vnodeFlags && (vnodeFlags & exports.VNodeFlags.Element) && (key === "children")) {
            return;
        }
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
function createRenderer(nodeOps) {
    /**----------- Mount ------------- */
    function mount(vnode, container, isSVG, refNode) {
        if (isUndef(vnode))
            return;
        const { flags } = vnode;
        if (flags & exports.VNodeFlags.FC) {
            mountFC(vnode, container, isSVG, refNode);
        }
        else if (flags & (exports.VNodeFlags.Element | exports.VNodeFlags.Svg)) {
            mountElement(vnode, container, isSVG, refNode);
        }
        else if (flags & exports.VNodeFlags.Text) {
            mountTextChild(vnode, container, refNode);
        }
        else if (flags & exports.VNodeFlags.Portal) {
            mountPortal(vnode);
        }
        else {
            mountFragment(vnode, container, isSVG, refNode);
        }
    }
    function mountChildren(childFlags, children, vnode, container, isSVG) {
        if (childFlags & exports.ChildrenFlags.NoChildren) {
            return;
        }
        if (childFlags & exports.ChildrenFlags.Single) {
            mount(children, container, isSVG);
        }
        else if (childFlags & exports.ChildrenFlags.Multiple) {
            const el = vnode.el;
            for (const child of children) {
                mount(child, el, isSVG);
            }
        }
    }
    function mountPortal(vnode) {
        const el = vnode.el = typeof vnode.key === "string"
            ? nodeOps.getElement(vnode.key)
            : vnode.key;
        const childVnode = vnode.children;
        mount(childVnode, el, false);
    }
    function mountFC(vnode, container, isSVG, refNode) {
        const { type } = vnode;
        vnode._instance._update = () => {
            if (vnode._instance._mounted) {
                /**patch */
                const oldVNode = vnode._instance._vnode;
                const newVNode = vnode._instance._render();
                const refNode = oldVNode?.el?.nextSibling;
                patch(newVNode, oldVNode, container, isSVG, refNode);
                vnode._instance._vnode = newVNode;
            }
            else {
                /**mount */
                const newVNode = vnode._instance._vnode = vnode._instance._render();
                mount(newVNode, container, isSVG, refNode);
                vnode.el = newVNode.el;
                vnode._instance._mounted = true;
                for (const cb of vnode._instance._onMount) {
                    cb();
                }
            }
        };
        exports._currentMountingFC = vnode._instance;
        vnode._instance._render = type(vnode._instance._props);
        exports._currentMountingFC = null;
        effect(() => {
            vnode._instance._update();
        }, {
            scheduler: queueJob
        });
    }
    function mountElement(vnode, container, isSVG, refNode) {
        const { data, childFlags, children, type } = vnode;
        const el = (vnode.el = isSVG
            ? nodeOps.createSvgElement(type)
            : nodeOps.createElement(type));
        if (data.ref) {
            /**@ts-ignore */
            data.ref.value = el;
        }
        for (const key in data) {
            nodeOps.patchData(el, key, data[key], null, exports.VNodeFlags.Element);
        }
        if (refNode) {
            nodeOps.insertBefore(container, el, refNode);
        }
        else {
            nodeOps.appendChild(container, el);
        }
        /**mount children */
        mountChildren(childFlags, children, vnode, el, isSVG);
    }
    function mountTextChild(vnode, container, refNode) {
        const textNode = nodeOps.createTextNode(vnode.children);
        vnode.el = textNode;
        if (refNode) {
            nodeOps.insertBefore(container, textNode, refNode);
        }
        else {
            nodeOps.appendChild(container, textNode);
        }
    }
    function mountFragment(vnode, container, isSVG, refNode) {
        const { children } = vnode;
        if (Array.isArray(children)) {
            children.forEach(c => mount(c, container, isSVG, refNode));
        }
        else if (children) {
            mount(children, container, isSVG, refNode);
        }
        const anchor = nodeOps.createComment("__FRAGMENT_END__");
        vnode.el = anchor;
        if (refNode) {
            nodeOps.insertBefore(container, anchor, refNode);
        }
        else {
            nodeOps.appendChild(container, anchor);
        }
    }
    function unmount(vnode, container) {
        const { flags, children, el } = vnode;
        if (flags & exports.VNodeFlags.Element || flags & exports.VNodeFlags.Text) {
            nodeOps.removeChild(container, vnode.el);
        }
        else if (flags & exports.VNodeFlags.FC) {
            unmountFC(vnode, container);
        }
        else if (flags & exports.VNodeFlags.Fragment) {
            if (Array.isArray(children)) {
                children.forEach(c => unmount(c, container));
            }
            else if (children) {
                unmount(children, container);
            }
            nodeOps.removeChild(container, el);
        }
        else if (flags & exports.VNodeFlags.Portal) {
            const el = vnode.el;
            unmount(vnode.children, el);
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
        vnode._instance = null;
        nodeOps.removeChild(container, el);
    }
    /**----------- Update ------------- */
    function patch(newVNode, oldVNode, container, isSVG, refNode) {
        if (newVNode && oldVNode) {
            if (isSameVNode(newVNode, oldVNode)) {
                const flags = newVNode.flags;
                if (flags & exports.VNodeFlags.FC) {
                    patchFC(newVNode, oldVNode);
                }
                else if (flags & exports.VNodeFlags.Text) {
                    patchTextVNode(newVNode, oldVNode);
                }
                else if (flags & exports.VNodeFlags.Element) {
                    patchElement(newVNode, oldVNode, isSVG);
                }
                else if (flags & exports.VNodeFlags.Portal) {
                    patchPortal(newVNode, oldVNode);
                }
                else {
                    patchFragment(newVNode, oldVNode, container, isSVG);
                }
            }
            else {
                replaceVNode(newVNode, oldVNode, container, isSVG);
            }
        }
        else if (newVNode) {
            mount(newVNode, container, isSVG, refNode);
        }
        else if (oldVNode) {
            unmount(oldVNode, container);
        }
    }
    function patchFC(newVNode, oldVNode) {
        newVNode.el = oldVNode.el;
        newVNode._instance = oldVNode._instance;
        if (bailout(newVNode, oldVNode)) {
            return;
        }
        const newData = newVNode._instance._props;
        const oldData = oldVNode._instance._props;
        for (const key in newData) {
            if (newData[key] !== oldData[key]) {
                /**@ts-ignore */
                newVNode._instance._props[key] = newData[key];
            }
        }
        newVNode._instance._update();
    }
    function patchElement(newVNode, oldVNode, isSVG) {
        const el = (newVNode.el = oldVNode.el);
        for (const key in newVNode.data) {
            nodeOps.patchData(el, key, newVNode.data[key], oldVNode.data[key], exports.VNodeFlags.Element);
        }
        for (const key in oldVNode.data) {
            if (!newVNode.data[key]) {
                nodeOps.patchData(el, key, null, oldVNode.data[key], exports.VNodeFlags.Element);
            }
        }
        patchChildren(newVNode, oldVNode, isSVG);
    }
    function patchTextVNode(newVNode, oldVNode) {
        const el = (newVNode.el = oldVNode.el);
        if (newVNode.children !== oldVNode.children) {
            nodeOps.setText(el, newVNode.children);
        }
    }
    function patchFragment(newVNode, oldVNode, container, isSVG) {
        const refNode = newVNode.el = oldVNode.el;
        patchChildren(newVNode, oldVNode, isSVG, container, refNode);
    }
    function patchPortal(newVNode, oldVNode) {
        const el = newVNode.el = oldVNode.el;
        patch(newVNode.children, oldVNode.children, el, false);
    }
    function replaceVNode(newVNode, oldVNode, container, isSVG) {
        const refNode = oldVNode.el?.nextSibling;
        unmount(oldVNode, container);
        mount(newVNode, container, isSVG, refNode);
    }
    /**if the vnode is fragment, then it's el is the first child, it
     * can't unmount correctly, so pass the really container if the
     * vnode is fragment
     */
    function patchChildren(newVNode, oldVNode, isSVG, container, refNode) {
        const { childFlags: newFlag, children: newChildren } = newVNode;
        const { childFlags: oldFlag, children: oldChildren } = oldVNode;
        /**el is string only when vnode is a portal */
        const el = container || oldVNode.el;
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
                mount(newChildren, el, isSVG, refNode);
            }
            else if (oldFlag & exports.ChildrenFlags.Single) {
                patch(newChildren, oldChildren, el, isSVG, refNode);
            }
            else if (oldFlag & exports.ChildrenFlags.Multiple) {
                for (const child of oldChildren) {
                    unmount(child, el);
                }
                mount(newChildren, el, isSVG, refNode);
            }
        }
        else if (newFlag & exports.ChildrenFlags.Multiple) {
            if (oldFlag & exports.ChildrenFlags.NoChildren) {
                for (const child of newChildren) {
                    mount(child, el, isSVG, refNode);
                }
            }
            else if (oldFlag & exports.ChildrenFlags.Single) {
                unmount(oldChildren, el);
                for (const child of newChildren) {
                    mount(child, el, isSVG, refNode);
                }
            }
            else if (oldFlag & exports.ChildrenFlags.Multiple) {
                patchMultipleChildren(newChildren, oldChildren, el, isSVG, refNode);
            }
        }
    }
    function patchMultipleChildren(nextChildren, prevChildren, container, isSVG, refNode) {
        let i = 0;
        let nextEnd = nextChildren.length - 1;
        let nextVNode = nextChildren[i];
        let prevEnd = prevChildren.length - 1;
        let prevVNode = prevChildren[i];
        outer: {
            while (i <= nextEnd && i <= prevEnd) {
                if (nextVNode.key !== prevVNode.key) {
                    break;
                }
                patch(nextVNode, prevVNode, container, isSVG);
                i++;
                if (i > nextEnd || i > prevEnd) {
                    break outer;
                }
                nextVNode = nextChildren[i];
                prevVNode = prevChildren[i];
            }
            nextVNode = nextChildren[nextEnd];
            prevVNode = prevChildren[prevEnd];
            while (i <= nextEnd && i <= prevEnd) {
                if (nextVNode.key !== prevVNode.key) {
                    break;
                }
                patch(nextVNode, prevVNode, container, isSVG);
                nextEnd--;
                prevEnd--;
                if (i > nextEnd || i > prevEnd) {
                    break outer;
                }
                nextVNode = nextChildren[nextEnd];
                prevVNode = prevChildren[prevEnd];
            }
        }
        if (i > nextEnd && i <= prevEnd) {
            for (let j = i; j <= prevEnd; j++) {
                unmount(prevChildren[j], container);
            }
        }
        else if (i > prevEnd) {
            const refNode = prevEnd + 1 >= prevChildren.length ? undefined : prevChildren[prevEnd + 1].el;
            for (let j = i; j <= nextEnd; j++) {
                mount(nextChildren[j], container, isSVG, refNode);
            }
        }
        else {
            let needMove = false;
            let pos = 0;
            let patchedNum = 0;
            const nextLeftNum = nextEnd - i + 1;
            const source = new Array(nextLeftNum).fill(-1);
            const indexMap = {};
            const prevKeyMap = {};
            for (let j = 0; j < nextLeftNum; j++) {
                indexMap[nextChildren[i + j].key] = j;
            }
            for (let j = i; j <= prevEnd; j++) {
                prevVNode = prevChildren[j];
                prevKeyMap[prevVNode.key] = true;
                if (patchedNum < nextLeftNum) {
                    const idx = indexMap[prevVNode.key];
                    if (isDef(idx)) {
                        nextVNode = nextChildren[idx + i];
                        patch(nextVNode, prevVNode, container, isSVG);
                        patchedNum++;
                        source[idx] = j;
                        if (idx < pos) {
                            needMove = true;
                        }
                        else {
                            pos = idx;
                        }
                    }
                    else { /**移除 */
                        unmount(prevVNode, container);
                    }
                }
                else {
                    unmount(prevVNode, container);
                }
            }
            /**
             *        [ 0  1  2  3  4 ]
             * old      A  B  C  D  E
             *
             *             i        j
             * new      A  C  B  F  D
             * source [ 0  2  1 -1  3 ]
             * seq          [ 2     4 ]
             *                      s
             */
            if (needMove) {
                const seq = lis(source);
                let s = seq.length - 1;
                for (let j = nextEnd; j >= i; j--) {
                    nextVNode = nextChildren[j];
                    if (source[j] === -1) {
                        const refNode = j + 1 < nextChildren.length ? nextChildren[j + 1].el : undefined;
                        mount(nextVNode, container, isSVG, refNode);
                    }
                    if (j === seq[s]) { /** no need for moving */
                        s--;
                    }
                    else {
                        const refNode = j + 1 < nextChildren.length ? nextChildren[j + 1].el : undefined;
                        nodeOps.insertBefore(container, nextVNode.el, refNode);
                    }
                }
            }
            else {
                for (let j = nextEnd; j >= i; j--) {
                    nextVNode = nextChildren[j];
                    if (!prevKeyMap[nextVNode.key]) {
                        const _refNode = j + 1 >= nextChildren.length ? undefined : nextChildren[j + 1].el;
                        mount(nextVNode, container, isSVG, _refNode || refNode);
                    }
                }
            }
        }
    }
    function bailout(v1, v2) {
        const propsA = v1._instance._props;
        const propsB = v2._instance._props;
        delete propsA.children;
        delete propsB.children;
        return shallowEqual(propsA, propsB);
    }
    return function renderer(vnode, container) {
        const isSVG = !!(vnode.flags & exports.VNodeFlags.Svg);
        const oldVNode = container.vnode;
        patch(vnode, oldVNode, container, isSVG);
    };
}

const checkHookAvailable = () => {
    if (!exports._currentMountingFC) {
        /**@ts-ignore */
        _warn("hook must be called inside a function component");
        return false;
    }
    return true;
};
const onMounted = (fn) => {
    if (checkHookAvailable()) {
        exports._currentMountingFC._onMount.push(fn);
    }
};
const onUnmounted = (fn) => {
    if (checkHookAvailable()) {
        exports._currentMountingFC._onUnmount.push(fn);
    }
};
const expose = (value) => {
    if (checkHookAvailable()) {
        exports._currentMountingFC._props.ref && (exports._currentMountingFC._props.ref.value = value);
    }
};

const createApp = (app, nodeOps) => {
    if (!nodeOps) {
        nodeOps = baseNodeOps;
    }
    const render = createRenderer(nodeOps);
    return {
        mount(container) {
            if (!container) {
                console.warn("请指定一个挂在节点的id或者class或者dom节点");
                return;
            }
            if (typeof container === "string") {
                container = nodeOps.getElement(container);
                if (!container) {
                    console.warn("无效的id或者class");
                    return;
                }
            }
            render(app, container);
        }
    };
};

exports.Fragment = Fragment;
exports.Portal = Portal;
exports.Ref = Ref;
exports.VNode = VNode;
exports._err = _err;
exports._warn = _warn$1;
exports.baseNodeOps = baseNodeOps;
exports.checkHookAvailable = checkHookAvailable;
exports.createApp = createApp;
exports.createEffect = createEffect;
exports.createPortal = createPortal;
exports.createRenderer = createRenderer;
exports.effect = effect;
exports.effectStack = effectStack;
exports.expose = expose;
exports.h = h;
exports.isArray = isArray;
exports.isDef = isDef;
exports.isObject = isObject;
exports.isRef = isRef;
exports.isSameVNode = isSameVNode;
exports.isUndef = isUndef;
exports.jsx = jsx;
exports.jsxs = jsxs;
exports.lis = lis;
exports.markRaw = markRaw;
exports.onMounted = onMounted;
exports.onUnmounted = onUnmounted;
exports.pauseTracking = pauseTracking;
exports.reactive = reactive;
exports.ref = ref;
exports.resetTracking = resetTracking;
exports.shallowEqual = shallowEqual;
exports.stop = stop;
exports.toRaw = toRaw;
exports.track = track;
exports.trigger = trigger;
