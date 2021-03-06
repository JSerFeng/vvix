import { reactive } from './lib/reactive'
import { Vdom } from './lib/vdom'

function App(): () => Vdom {
  const state = reactive({})

  return () => {
    return {
      _V__Flag: true,
      type: "div",
      props: {
        "class": "hhh"
      },
      children: []
    }
  }
}

export default App