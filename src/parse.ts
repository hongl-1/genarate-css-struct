import { Ast } from './types'

// wrapper 是额外添加的用于辅助构建 scss AST 的标签
const htmlBlockTagList = ['wrapper', 'a', 'abbr', 'acronym', 'address', 'applet', 'article', 'aside', 'audio', 'b', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6','head', 'header', 'i', 'iframe', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'menu', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'small', 'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'tt', 'u', 'ul', 'var', 'video']
// HTML 自闭合标签
const voidElementList = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr']

export function parse(html: string): Ast {
  const root: Ast = {
    type: 'root',
    tag: 'root',
    isVoidElement: false,
    class: '',
    bindClass: '',
    id: '',
    bindId: '',
    children: []
  }
  if(!html) return root
  // 匹配字符串 <div> <img /> <div class="foo"> </div> 等
  const tagRE = /<!--[\s\S]*?-->|<(?:"[^"]*"|'[^']*'|[^'">])+>/g

  let level = 0
  const stack: Ast[] = []
  let currentNode: Ast

  html.replace(tagRE, (tag: string) => {
    // 匹配class
    const isStartTag = tag.charAt(1) !== '/'
    // 层级
    if(isStartTag) {
      currentNode = parseTag(tag)
      if (level === 0) {
        root.children.push(currentNode)
        stack.push(currentNode)
      } else {
        const parent = stack[level - 1]
        stack.push(currentNode)
        parent.children.push(currentNode)
      }
      level++
    }
    if(!isStartTag || currentNode.isVoidElement) {
      level--
      stack.pop()
    }
    return ''
  })
  return root
}

function parseTag(tag: string) {
  const node: Ast = {
    type: 'tag',
    isVoidElement: false,
    tag: 'div',
    class: '',
    bindClass: '',
    id: '',
    bindId: '',
    children: []
  }
  const tagNameMatch = /<([a-zA-Z]+)/.exec(tag)
  node.tag = (tagNameMatch as any)[1]
  node.isVoidElement = voidElementList.includes(node.tag)

  node.class = parseAttr(tag, 'class')
  node.id = parseAttr(tag, 'id')

  node.bindClass = parseBindAttr(tag, 'class')
  node.bindId = parseBindAttr(tag, 'id')
  return node
}

function parseAttr(tag: string, attrName: string): string {
  const attrReg = new RegExp(`\\s${attrName}=(('[^']+')|("[^"]+"))`)
  const attrMatch = attrReg.exec(tag)
  return attrMatch ? attrMatch[1].slice(1, -1) : ''
}

function parseBindAttr(tag: string, attrName: string): string {
  const attrReg = new RegExp(`\\s(v-bind)?:${attrName}=(('[^']+')|("[^"]+"))`)
  const bindAttrMatch = attrReg.exec(tag)
  const rawAttr = bindAttrMatch ? bindAttrMatch[2].slice(1, -1) : ''
  const attr: string[] = []
  rawAttr && rawAttr.replace(/(('[^']')|("[^"]"))/g, (match) => {
    attr.push(match.slice(1, -1))
    return ''
  })
  return attr.join(' ')
}
