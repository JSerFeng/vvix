import { createApp, FC, Ref, ref } from "./lib";

interface Props {
  title: string;
  content: string;
}

const data = [
  {
    id: 0,
    title: "Better Call Saul",
    content:
      "The best TV Series EVER! Though it's a little bit " +
      " slow tempo at first. You mustn't miss it.",
  },
  {
    id: 1,
    title: "Breaking Bad",
    content:
      "The second best series, it's the best until I meet 《Better Call Saul》",
  },
  {
    id: 2,
    title: "The Walking Dead",
    content: "It's interesting at first, however...",
  },
];

const Msg: FC<Props> = ({ title, content }) => () => (
  <div class="msg">
    <h1>{title}</h1>
    <p>{content}</p>
  </div>
);

const App: FC = () => {
  const info = ref<typeof data>(data);

  return () => (
    <>
      <h1 class="title">vvix</h1>
      <div>
        vvix
        {info.value.map((msg) => (
          <Msg key={msg.id} title={msg.title} content={msg.content} />
        ))}
      </div>
    </>
  );
};

createApp(<App />).mount("#root");
