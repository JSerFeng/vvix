import { createApp } from "./lib/core";
import { ref } from "./lib/reactivity";
import { FC } from "./lib/vdom";
interface Props {
  title: string;
  content: string;
}

const MsgShow: FC<Props> = ({ title, content }) => () => (
  <div>
    <h1>{title}</h1>
    <p>{content}</p>
  </div>
);

const App: FC = () => {
  const data = ref([
    { id: 0, title: "Johnson", content: "I love React" },
    { id: 1, title: "Author", content: "And I love Vue more" },
    { id: 2, title: "Jack", content: "But I hate webpack" },
  ]);

  const click = () => {
    data.value.reverse();
  };

  return () => (
    <>
      <ul onClick={click}>
        {data.value.map((item) => (
          <MsgShow key={item.id} {...item} />
        ))}
      </ul>
      <button>click me</button>
    </>
  );
};

createApp(<App />).mount("#app");
export default App;
