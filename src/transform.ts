import { Ast, SelectorTree } from './types'
import { isBuiltInComponents } from './utils'
// ast => selectorTree 将上一步得到的class的ast喜欢换成选择器树
export function transform(ast: Ast): SelectorTree {
  let selectorRootTree: SelectorTree = {
    selectorNames: [],
    children: []
  }
  const children = ast.children
  selectorRootTree = transformTree(ast)
  // selectorRootTree.children = transformChildren(selectorRootTree, children)
  console.log(JSON.stringify(selectorRootTree))
  return selectorRootTree
}

export function transformTree(ast: Ast) {
  // todo
  let selectorRootTree: SelectorTree = {
    selectorNames: [],
    children: []
  }
  if(ast.children && ast.children.length) {
    ast.children.forEach((child, index) => {
      const selectorNames: string[] = ([] as string[]).concat(
        transformClass(child.class),
        transformClass(child.bindClass),
        transformId(child.id),
        transformId(child.bindId)
      )
      if(!selectorNames.length && isBuiltInComponents(child.tag)) {
        selectorNames.push(child.tag)
      }
      selectorRootTree.selectorNames = selectorRootTree.selectorNames.concat(selectorNames)
      if(child.children.length) {
        selectorRootTree.children.push(transformTree(child))
      }
      if(!selectorNames.length) {
        selectorRootTree = transformTree(child)
      }
    })
  }
  return selectorRootTree
}

export function transformChildren(parent: SelectorTree, children: Ast[]) {
  const childSelectorTree: SelectorTree[] = []
  for(let i = 0; i < children.length; i++) {
    const child = children[i]
    childSelectorTree[i] = {
      selectorNames: [],
      children: []
    }
    childSelectorTree[i].selectorNames = ([] as string[]).concat(
      transformClass(child.class),
      transformClass(child.bindClass),
      transformId(child.id),
      transformId(child.bindId)
    )
    if(childSelectorTree[i].selectorNames.length === 0 && isBuiltInComponents(child.tag)) {
      childSelectorTree[i].selectorNames = [child.tag]
    }
    if(child.children.length) {
      childSelectorTree[i].children = transformChildren(childSelectorTree[i], child.children)
    }
  }
  // return parent
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
