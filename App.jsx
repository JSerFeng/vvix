import { createApp } from "./lib/core";
import { reactive } from "./lib/reactivity";

const Child = (props) => () => <span>{props.count}</span>;

function App() {
  let state = reactive({
    count: 0,
  });

  return () => (
    <div
      style={{
        color: "red"
      }}
      onClick={() => {
        state.count++;
      }}
    >
      <Child count={state.count} />
      <div>fuck</div>
    </div>
  );
}

createApp(<App />).mount("#app");

export default App;
