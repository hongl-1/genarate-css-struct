export interface Ast {
  type: string,
  isVoidElement: boolean,
  tag: string,
  class: string,
  bindClass: string,
  id: string,
  bindId: string,
  children: Ast[]
}

export interface SelectorTree {
  selectorNames: string[],
  children: SelectorTree[]
}
