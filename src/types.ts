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

export interface ParserContext {
  source: string
}

export interface ScssAst {
  // css 规则内容
  rule: string
  selectorName: string
  children: ScssAst[]
  parent?: ScssAst
  // 同级别元素，选择器相同，但子元素不同，需要按照出现的顺序进行标记是否已经被匹配比较过了
  hasMatch?: boolean,
  // 是否是以 @ 开头的关键字规则，例如
  isKeyRule?: boolean,
  // scss 注释
  comment?: string,
  // 换行、缩进字符信息
  rnInfo: {
    // 选择器字符前面的换行、缩进信息
    start?: string
    // 选择器字符 与 { 字符之间的换行、缩进信息
    startAfter?: string
    // } 字符前面的换行、缩进信息
    end?: string
  },
  // 相比于上一次是否是新增节点
  isNew?: boolean
}
