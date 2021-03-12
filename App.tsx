import { createApp } from "./lib/core";
import { reactive, ref, toRaw } from "./lib/reactivity";
import { expose, onMounted } from "lib/renderer";
import { FC } from "./lib/vdom";

interface Props {
  count: number;
}

const Child: FC<Props> = (props) => {
  expose({
    msg: "hello world",
  });

  return () => <h1>{props.count}</h1>;
};

const App: FC = () => {
  const data = reactive([
    {
      id: 0,
      msg: "lorem",
    },
    {
      id: 1,
      msg: "epsim",
    },
    {
      id: 2,
      msg: "update",
    },
  ]);

  const click = () => {
    data.reverse();
  };

  return () => (
    <ul onClick={click}>
      {data.map((item) => (
        <li key={item.id}>{item.msg}</li>
      ))}
    </ul>
  );
};

createApp(<App />).mount("#app");
export default App;
