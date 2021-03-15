# vvix-cli

## 请不要在真实开发下使用 vvix，还未稳定 !!!!!!!!!!!!!!!!!!!!!!!!!

## 如果你实在喜欢这种写法，请使用[Vue3](https://github.com/vuejs/vue-next) !!!!!!!!!!!!!!!!!!!!!!!!!

## DO NOT USE IN REAL PRODUCT, IT'S STILL NOT STABLE!!!!!!!!!!!!!!!!!!!!

## If you really like this style, please use [Vue3](https://github.com/vuejs/vue-next) !!!!!!!!!!!!!!

##

轻量级玩具 响应式 JSX/TSX 框架

vvix 可以让你使用：

- ts 支持
- vue 响应式 api 大部分支持
- 更加 vue 的 react，更加 react 的 vue
- 和 vue3 类似的 diff 算法

vvix brings you:

- ts support
- most of "vue" reactive apis
- reactive react, jsx in vue
- more efficient diff algorithm than react

## 使用/Usage:

挂载 App 根组件到 id 为 root 的 dom 节点上

render App on the dom whose id is "root"

[demo 地址](https://codesandbox.io/s/eloquent-easley-us90x?file=/src/App.tsx)

```
import {createApp} from 'vvix'

const App = () => () =>
  <div>hello world</div>

createApp(<App />).mount("#root")
```

基础的计数器

Simple counter demo

[demo 地址](https://codesandbox.io/s/eloquent-easley-us90x?file=/src/Counter.tsx)

```
const Counter = () => {
  const counter = ref(0)
  const click = () => {
    counter.value++
  }
  return () => <div onClick={click}>
    counter: {counter.value}
  </div>
}

createApp(<Counter />).mount("#app")
```

组件的嵌套

parent and child components

[demo 地址](https://codesandbox.io/s/eloquent-easley-us90x?file=/src/MsgItem.tsx:49-166)

```
interface Props {
  title: string;
  content: string;
}

const enum Status {
  Success,
  Pending,
  Fail,
  Normal
}

const Item: FC<Props> = ({ title, content }) => () => (
  <div>
    <h1>{title}</h1>
    <p>{content}</p>
  </div>
);

const MsgItem = () => {
  const [status, data, retry] = useRequest<
    Array<{ id: number; title: string; content: string }>
  >();
  return () => (
    <>
      <button onClick={retry}>retry</button>
      {
        status.value === Status.Pending
        ? "loading..."
        : status.value === Status.Fail
          ? "oops, something wrong !"
          : data.value?.map((item) => (
            <Item
              key={item.id}
              title={item.title}
              content={item.content}
            />
          ))
      }
    </>
  );
};
```

组件传送门（让组件挂载在其它 dom 上）

portal(mount the component on another dom)

[demo 地址](https://codesandbox.io/s/eloquent-easley-us90x?file=/src/Modal.tsx:0-271)

```
import { createPortal } from "vvix";

const Portal = createPortal<{
  msg: string;
}>(({ msg }) => {
  return () => <div>{msg}</div>;
}, "#portal");

const App = () => {
  return () => (
    <div>
      <Portal msg="portal render success" />
    </div>
  );
};
```

[demo](https://codesandbox.io/s/eloquent-easley-us90x?file=/src/App.tsx)

## Api

### createApp

挂载根组件到 dom 上

mount root component on the dom

```
/*
  nodeOps: an plain object which includes some  platform apis, for example:
  {
    getElement(parent, child) {
      return parent.querySelector(child)
    },
    appendChild(parent, child) {
      parent.appendChild(child)
    },
    ...
  }
  if you just want to render it on the dom, just don't care the second parameter
*/

createApp(vnode: VNode, nodeOps?: NodeOps).mount(container: Dom | string)
```

### ref & reactive

```
ref(value?)
reactive(obj)

const count = ref(0);
count.value++
console.log(cont.value) // update render

const state = reactive({
  list: [],
  users: {}
})
state.list.push({ msg: hello }) // update render
```

### expose

```
import {expose, onMounted} from 'vvix'

const Child = () => {
  const count = ref(0)
  expose({
    count: count
  })
  return <div>child</div>
}
const Parent = () => {
  const childComponent = ref()
  onMounted

}
```

作者大学生佛系更新，欢迎提出好的 PR/issue 和 star ^\_^

I won't guarantee when will it be finished, welcome you PR, issue and Star ^\_^

github: https://github.com/JSerFeng/vvix
