const updateQueue: Function[] = []

let flushing = false

export const queueJob = (fn: () => void) => {
  if (!updateQueue.includes(fn)) {
    updateQueue.push(fn)
  }
  if (!flushing) {
    flushing = true
    Promise.resolve().then(flushWork)
  }
}

const flushWork = () => {
  updateQueue.forEach(cb => cb())
  updateQueue.length = 0
  flushing = false
}