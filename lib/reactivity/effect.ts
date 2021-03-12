import { Fn } from "../shared";

export interface Effect {
  (...args: any[]): any
  lazy: boolean
  active: boolean
  _isEffect: true
  raw: Fn
  deps: Set<Effect>[]
  scheduler: (job: Function) => void | null
}
interface Option {
  lazy: boolean
  active: boolean
  scheduler: (job: () => any) => void
}

export const effectStack: Fn[] = []
export let activeEffect: Effect | null = null
let pause = false

export function effect(fn: Fn, option: Partial<Option> = {
  lazy: false,
  active: true
}) {
  const _effect = createEffect(fn, option)
  if (!_effect.lazy) {
    _effect()
  }
  return _effect
}

export function createEffect(fn: Fn, option: Partial<Option>): Effect {
  const effect: Effect = function reactiveEffect(...args: any[]) {
    if ((reactiveEffect as Effect).active && !pause) {
      if (!effectStack.includes(effect)) {
        effectStack.push(reactiveEffect)
        activeEffect = effect
        fn(...args)
        effectStack.pop()
        activeEffect = null
      }
    }
  } as Effect
  effect.lazy = option.lazy || false;
  effect.active = option.active || true;
  effect.raw = fn
  effect.deps = []
  effect.scheduler = (option.scheduler || null) as (job: Function) => void
  return effect
}

export const trigger = (target: Record<any, any>, key: any) => {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  if (!deps) return
  deps.forEach(effect => {
    if (effect !== activeEffect) {
      if (effect.scheduler) {
        effect.scheduler(effect)
      } else {
        effect()
      }
    }
  })
}

const targetMap = new WeakMap<Record<any, any>, Map<any, Set<Effect>>>()

export const track = (target: Record<any, any>, key: any) => {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map<any, Set<Effect>>())
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, deps = new Set<Effect>())
  }
  if (!deps.has(activeEffect!)) {
    deps.add(activeEffect!)
    activeEffect!.deps.push(deps)
  }
}

export const stop = (effect: Effect) => {
  effect.active = false
}

export const pauseTracking = () => {
  pause = true
}

export const resetTracking = () => {
  pause = false
}