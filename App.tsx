import { ref, FC, createApp } from "./lib";

interface Props {
  title: string;
  content: string;
}

const Msg: FC<Props> = ({ title, content }) => {
  return () => (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
};

const App: FC = () => {
  const info = ref([
    {
      title: "Breaking Bad",
      content: "My favorite video, you mustn't miss it !!",
    },
    {
      title: "The Walking Dead",
      content:
        'A little bit, how to say, "slow", but the first ' +
        "several seasons are really great",
    },
  ]);
  return () => (
    <div>
      {info.value.map((c) => (
        <Msg key={1} title={c.title} content={c.content} />
      ))}
    </div>
  );
};

createApp(<App />).mount("#root");
