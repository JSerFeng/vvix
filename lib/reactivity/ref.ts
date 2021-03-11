export type UnwrapRef<T> = T extends Ref<T> ? UnwrapRef<T> : T
export class Ref<T> {
  value: UnwrapRef<T>

  constructor(value: any) {
    
    this.value = value
  }
}


const ref1 = new Ref(
  new Ref(2)
)
ref1.value = 2