import { createApp, ref, Ref, FC } from "./lib";

interface Props {
  title: string;
  content: string;
}

const enum Status {
  Success,
  Pending,
  Fail,
  Normal,
}

const fakeData = [
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

function useRequest<T>(): [Ref<Status>, Ref<T | null>, () => void] {
  const status = ref(Status.Normal);
  const data = ref<T>();
  let timer: number | null = null;
  const request = () => {
    if (timer) {
      clearTimeout(timer);
    }
    status.value = Status.Pending;
    timer = (setTimeout(() => {
      status.value =  Status.Success
      data.value = fakeData as any;
    }, 1000) as any) as number;
  };
  request();
  return [status, data, request];
}

const Item: FC<Props> = ({ title, content }) => () => (
  <div>
    <h1>{title}</h1>
    <p>{content}</p>
  </div>
);

const Fail: FC<{ msg: string }> = ({ msg }) => () => <h1>fail: {msg}</h1>;

const MsgItem = () => {
  const [status, data, retry] = useRequest<
    Array<{ id: number; title: string; content: string }>
  >();
  return () => (
    <>
      <button onClick={retry}>retry</button>
      {status.value === Status.Pending ? (
        "loading..."
      ) : status.value === Status.Fail ? (
        <Fail msg={"oops, something wrong !"} />
      ) : (
        data.value?.map((item) => (
          <Item key={item.id} title={item.title} content={item.content} />
        ))
      )}
    </>
  );
};

const Child = () => () => <h1>child</h1>;
const App: FC = () => {
  return () => (
    <div>
      <MsgItem />
      <Child />
    </div>
  );
};

createApp(<App />).mount("#app");
