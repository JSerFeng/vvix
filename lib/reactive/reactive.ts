const raw = new WeakSet()
const observed = new WeakSet()

const baseHandler: ProxyHandler<any> = {
  get(target, key, receiver) {
    const val =  Reflect.get(target, key, receiver)
    return val
  },
  set(target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver)
  }
}

export const reactive = <T>(target: T) => {
  return new Proxy(target, baseHandler)
}