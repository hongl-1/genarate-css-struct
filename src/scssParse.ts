import { ParserContext, ScssAst, SelectorTree } from './types'
const rootStrObj: ScssAst = {
  selectorName: '',
  children: [],
  rule: '',
  rnInfo: {}
}

function cloneDeep<T>(val: T): T {
  return JSON.parse(JSON.stringify(val))
}

// 匹配 }
const leftRe = '^\\s*}'
// 匹配 rule
const ruleRe1 = '([^{}]|#{[^}]*})+;(?=[^{:]+?{)'
// 匹配 rule
const ruleRe2 = '([^{}]|#{[^}]*})+?(?=\\s*})'
// 匹配 {
const rightRe = '([^{]|(?<=#){)*{'
// /^\s*}|([^{}]|#{[^}]*})+;(?=[^{:]+?{)|([^{}]|#{[^}]*})+?(?=\s*})|([^{]|(?<=#){)*{/
const re1 = new RegExp(`${leftRe}|${ruleRe1}|${ruleRe2}|${rightRe}`)
// 匹配 scss 注释
const scssCommentRe = /^\s*\/\/[\s\S]*(?=\n)|^\s*\/\*[\s\S]*?\*\//

let parseContext: ParserContext

export function scssStr2Ast(source: string, root = cloneDeep<ScssAst>(rootStrObj)): any {
  if(!parseContext) {
    parseContext = createParserContext(source)
  }
  const s = parseContext.source
  if (!s.trim()) return root
  const match = s.match(re1)
  if (!match) {
    return null
  }
  let value = match[0]
  // 包含 {，并且不是 scss 插值语句
  if (/[^#]{/.test(value)) {
    advanceBy(parseContext, value.length)
    const child: ScssAst = {
      selectorName: '',
      children: [],
      rule: '',
      parent: root,
      // 选择器名以  @ 开头的，认为是关键字规则
      isKeyRule: value.trim().indexOf('@') === 0,
      rnInfo: {
        start: '',
        end: ''
      }
    }
    // 检查是否有注释
    const commentMt = value.match(scssCommentRe)
    if (commentMt) {
      child.comment = commentMt[0]
      value = value.slice(child.comment.length)
    }
    const selectorMt = <RegExpMatchArray>value.match(/(\s*)([\s\S]*\S)(\s*){$/)
    child.selectorName = selectorMt[2]
    child.rnInfo.start = selectorMt[1]
    child.rnInfo.startAfter = selectorMt[3]
    root.children.push(child)
    return scssStr2Ast(parseContext.source, child)
  } else if (/^\s*}$/.test(value)) {
    // 匹配 }
    root.rnInfo.end = (value.match(/^\s*/) as RegExpMatchArray)[0]
    advanceBy(parseContext, value.length)
    return scssStr2Ast(parseContext.source, root.parent)
  } else {
    // 匹配 css规则
    root.rule = (root.rule || '') + s.slice(0, value.length)
    advanceBy(parseContext, value.length)
    return scssStr2Ast(parseContext.source, root)
  }
}


// 推进 删除content.source已经处理过的字符创
function advanceBy(context: ParserContext, length: number) {
  context.source = context.source.slice(length);
}

function createParserContext(source: string): ParserContext {
  return {
    source
  }
}


function resetScss(selectorTree: SelectorTree): ScssAst[] {
  // if(!selectorTree) return [oldScssAst]
  const newScssAstArr: ScssAst[] = []
  for(let i = 0; i < selectorTree.selectorNames.length; i++) {
    const selector = selectorTree.selectorNames[i]
    newScssAstArr.push({
      children: [],
      rule: '',
      rnInfo: {},
      selectorName: selector
    })
    if(i === 0) {
      newScssAstArr[0].children = selectorTree.children[0] && resetScss(selectorTree.children[0])
    }
  }
  return newScssAstArr
  // selectorTree.selectorNames.forEach(name => {
  //   newScssAst.children.push({
  //     children: [],
  //     rnInfo: {},
  //     rule: '',
  //     selectorName: name
  //   })
  // })
  // const selectorChildren = selectorTree.children
  // for (let i = 0; i < selectorChildren.length; i++) {
  //   const selectorChild = selectorChildren[i]
  //
  //   selectorChild.children.forEach(child => {
  //     newScssAst.children[0].children.push(resetScss(child, oldScssAst))
  //   })
  //   // newScssAst.children[0]=
  // }
  // return newScssAst
}

const a = resetScss({
  selectorNames: ['.baz', '.baz2', '.baz3'],
  children: [
    {
      selectorNames: ['.foo'],
      children: [
        {
          selectorNames: ['bar'],
          children: []
        }
      ]
    },
    {
      selectorNames: ['.foo2'],
      children: [
        {
          selectorNames: ['bar2'],
          children: []
        }
      ]
    }
  ]
})

const b =a
console.log(a)
