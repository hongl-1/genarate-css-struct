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

function resetScss(selectorTree: SelectorTree, scssAst: ScssAst, childIndex = 0) {
  if(!selectorTree) return
  const selectorNames = selectorTree.selectorNames
  for (let i = 0; i < selectorNames.length; i++) {
    const selector = selectorNames[i]
    // 查找当前scssAst中是否已经有模板中的选择器
    const matchIndex = scssAst.children.findIndex((scssAstItem) => {
      return !scssAstItem.hasMatch && (selector === scssAstItem.selectorName || (scssAstItem.selectorName.startsWith('&') && selector === completeSelectorName(scssAst)))
    })
    // 没有的话则代表是新增的选择器去遍历所有的子集
    if(matchIndex === -1) {
      scssAst.children = [
        // 将当前数组按照子集的开始index拆分开, 将新的节点信息插入
        ...scssAst.children.slice(0, childIndex + i),
        {
          rule: '',
          // 当前为1时, 遍历他的所有子集
          children: i === 0 ? trackChildren(selectorTree) : [],
          rnInfo: {},
          selectorName: selector,
          isNew: true
        } as ScssAst,
        ...scssAst.children.slice(childIndex + i)
      ]
    } else {
      if(i === 0) {
        scssAst.children[matchIndex].hasMatch = true
        selectorTree.children.forEach((selectorTreeChild, index) => {
          const scssAstChild = scssAst.children[matchIndex]
          if(!scssAstChild.isKeyRule) {
            resetScss(selectorTreeChild, scssAstChild, getPrevSelectorsCount(selectorTree, index))
          }
        })
      }
    }
  }
}
// 获取当前选择器列表前面所有同级的列表中的selector的数量
function getPrevSelectorsCount(selectorTree: SelectorTree, index: number) {
  // 获取所有之前的列表
  const prevSelectorTreeChildren = selectorTree.children.slice(0, index)
  return prevSelectorTreeChildren.reduce((prev, currentChild) => {
    return prev + currentChild.selectorNames.length
  }, 0)
}

function trackChildren(selectorTree: SelectorTree): ScssAst[] {
  const scssAstArr: ScssAst[] = []
  for(let i = 0; i < selectorTree.children.length; i++) {
    selectorTree.children[i].selectorNames.forEach((selector, index) => {
      scssAstArr.push({
        rule: '',
        rnInfo: {},
        selectorName: selector,
        children: index === 0 ? trackChildren(selectorTree.children[i]) : [],
        isNew: true
      })
    })
  }
  return scssAstArr
}

function completeSelectorName (scssAst: ScssAst, name: string = ''): string {
  if(scssAst.selectorName.startsWith('&')) {
    const selectorName = scssAst.selectorName
    return scssAst.parent ?
      completeSelectorName(scssAst.parent, selectorName + name.replace('&', '')) : (selectorName + name)
  }
  return scssAst.selectorName + name.replace('&', '')
}

const a: ScssAst = {
  children: [], rnInfo: {}, rule: '', selectorName: ''
}
