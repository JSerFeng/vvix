import { createApp } from "./lib/core";
import { ref } from "./lib/reactivity";
import { expose, onMounted } from "lib/renderer";
import { FC } from "./lib/vdom";

const Child: FC<{ count?: number }> = (props) => {
  expose({
    msg: "hello world",
  });
  return () => <>{props.count}</>;
};

const App: FC = () => {
  const childRef = ref<{ msg: string }>();

  console.log(childRef.value);
  onMounted(() => {
    console.log(childRef.value);
  });

  return () => <Child ref={childRef} />;
};

createApp(<App />).mount("#app");
export default App;
