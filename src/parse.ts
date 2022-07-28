import { VDom } from './types'

// wrapper 是额外添加的用于辅助构建 scss AST 的标签
const htmlBlockTagList = ['wrapper', 'a', 'abbr', 'acronym', 'address', 'applet', 'article', 'aside', 'audio', 'b', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6','head', 'header', 'i', 'iframe', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'menu', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'small', 'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'tt', 'u', 'ul', 'var', 'video']
// HTML 自闭合标签
const voidElementList = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr']

const attrRE = /((:|v-bind:)?[\w$\-]+)|(["'])[\s\S]*?/g

export function parse(html: string) {
  if(!html) return []
  // 匹配字符串 <div> <img /> <div class="foo"> </div> 等
  const tagRE = /<!--[\s\S]*?-->|<(?:"[^"]*"|'[^']*'|[^'">])+>/g
  const root: any = {
    type: 'root',
    children: []
  }
  let level = 0
  const stack: any[] = []
  let currentNode: any

  html.replace(tagRE, (tag: string) => {
    // 匹配class
    const isStartTag = tag.charAt(1) !== '/'
    // 层级
    if(isStartTag) {
      currentNode = parseTag(tag)
      if (level === 0) {
        root.children.push(currentNode)
        stack[level] = currentNode
      } else {
        const parent = stack[level - 1]
        parent.children.push(currentNode)
      }
      level++
    }
    if(!isStartTag || currentNode.isVoidElement) {
      level--
    }
    return ''
  })
  return root
}

function parseTag(tag: string) {
  const node = {
    type: 'tag',
    isVoidElement: false,
    tag: 'div',
    class: '',
    bindClass: '',
    children: []
  }
  const tagNameMatch = /<([a-zA-Z]+)/.exec(tag)
  node.tag = (tagNameMatch as any)[1]
  node.isVoidElement = voidElementList.includes(node.tag)
  const classMatch = /[^(v\-bind)?:]class=(('[^']+')|("[^"]+"))/.exec(tag)
  node.class = classMatch ? classMatch[1] : ''
  const bindClassMatch = /^(v-bind|:)]class=(('[^']+')|("[^"]+"))/.exec(tag)
  node.bindClass = bindClassMatch ? bindClassMatch[2] : ''
  console.log(node)
  return node
}
