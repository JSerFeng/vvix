import { _currentMountingFC } from "."

export const checkHookAvailable = () => {
  if (!_currentMountingFC) {
    /**@ts-ignore */
    _warn("hook must be called inside a function component")
    return false
  }
  return true
}

export const onMounted = (fn: () => any) => {
  if (checkHookAvailable()) {
    _currentMountingFC!._onMount.push(fn)
  }
}

export const onUnmounted = (fn: () => any) => {
  if (checkHookAvailable()) {
    _currentMountingFC!._onUnmount.push(fn)
  }
}

export const expose = (value: Record<any, any>) => {
  if (checkHookAvailable()) {
    _currentMountingFC!._props.ref && (_currentMountingFC!._props.ref!.value = value)
  }
}