import { LooseObj, VdomType } from "../shared";

class VdomReference<T> {
  current: T | null = null
  constructor(value?: T) {
    this.current = value || null
  }
}

type InternalProps<T = unknown> = Partial<{
  ref: VdomReference<T>,
  parent: Vdom | null,
  dom: Element,
  style: CSSStyleDeclaration
}>

export interface VdomProps extends InternalProps {
  [K: string]: any
}

export class Vdom {
  _V__Flag: true = true;
  type: string | Vdom = "";
  props: VdomProps = {};
  children: Vdom[] = [];
  constructor(type: VdomType, props: VdomProps, children: Vdom[]) {
    this.type = type
    this.props = props
    this.children = children
  }

}

export function createVdom(type: VdomType, props: VdomProps, children: Vdom[]): Vdom {
  return new Vdom(type, props, children)
}