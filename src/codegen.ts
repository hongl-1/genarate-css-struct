import { SelectorTree } from './types'
import { cssBeautify } from './format'


export function codegen(selectorTree: SelectorTree): string {
  const codegenContext = createCodegenContext()
  codegenChildren(selectorTree.children, codegenContext)
  return cssBeautify(codegenContext.code)
}

function codegenChildren(children: SelectorTree[], context: CodegenContext) {
  const { push } = context
  for(let i = 0; i < children.length; i++) {
    const child = children[i]
    const { selectorNames } = child
    if (selectorNames.length) {
      push(selectorNames[0] + '{')
    }
    codegenChildren(child.children, context)
    if (selectorNames.length) {
      push('}')
    }
    if(selectorNames.length > 1) {
      for(let j = 1; j < selectorNames.length; j++) {
        push(selectorNames[j] + '{}')
      }
    }
  }
}

function createCodegenContext (): CodegenContext{
  const context = {
    code: '',
    push(str: string) {
      context.code += str
    }
  }
  return context
}


interface CodegenContext {
  code: string,
  push: (str: string) => void
}

