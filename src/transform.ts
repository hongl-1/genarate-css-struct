import { Ast, SelectorTree } from './types'
// ast => selectorTree 将上一步得到的class的ast喜欢换成选择器树
export function transform(ast: Ast): SelectorTree {
  const selectorRootTree: SelectorTree = {
    selectorNames: [],
    children: []
  }
  const children = ast.children
  selectorRootTree.children = transformChildren(children)
  return selectorRootTree
}

export function transformChildren(children: Ast[]) {
  const childSelectorTree: SelectorTree[] = []
  for(let i = 0; i < children.length; i++) {
    const child = children[i]
    childSelectorTree[i] = {
      selectorNames: [],
      children: []
    }
    childSelectorTree[i].selectorNames.push(...transformClass(child.class))
    childSelectorTree[i].selectorNames.push(...transformId(child.id))
    childSelectorTree[i].selectorNames.push(...transformClass(child.bindClass))
    childSelectorTree[i].selectorNames.push(...transformId(child.bindId))
    if(child.children.length) {
      childSelectorTree[i].children = transformChildren(child.children)
    }
  }
  return childSelectorTree
}

function transformClass (value: string): string[] {
  return string2Array(value).map(item => `.${item}`)
}

function transformId (value: string): string[] {
  return string2Array(value).map(item => `#${item}`)
}

function string2Array(value: string): string[] {
  return value.split(/\s/).filter(item => item)
}
