import { VNode } from "./lib/vdom";
import { createApp } from "./lib/core";
import { onMounted } from "./lib/renderer";
import { reactive } from "./lib/reactivity";

const Child = (props: { count: number }) => () => <>{props.count}</>;

function App(): () => VNode {
  let state = reactive({
    count: 0,
  });

  onMounted(() => {
    console.log("onMounted");
  });

  const handleClick = () => {
    state.count++;
  };
  return () => (
    <div onClick={handleClick} style={{
      color: "red"
    }}>
      <Child count={state.count} />
    </div>
  );
}

createApp(<App />).mount("#app");
export default App;
