import { transform } from './transform'
import { parse } from './parse'
import { generateScss, resetScss, scssStr2Ast } from './scssParse'
export { parse } from './parse'
import { Command } from 'commander'
import path from 'path'
import * as fs from 'fs'
import pkg from '../package.json'

/**
 * 1. 通过读取.vue的文件中的template 生成ast树
 * 2. 获取ast中class 三步走 1) 获取直接的class 2) 获取数组的 3) 获取对象的
 * 3. 通过ast结构生成class树
 */
const template = `
<template>
  <div class="wrap">
    <div class="header">
      <div class="left">
        <div class="title">标题</div>
        <div class="sub-title">副标题</div>
        <div class="sub-title1">副标题</div>
        <div class="sub-title2">副标题</div>
        <div class="sub-title3">副标题</div>
      </div>
      <div class="right">
        <div class="time">时间</div>
      </div>
    </div>
    <div class="footer">
      <div class="copyright">这是版权信息1</div>
      <div class="copyright">这是版权信息2</div>
    </div>
  </div>
</template>
`
// const ast = parse(template).children[0]
// const selectorTree = transform(ast).children[0]
// const scssAst = scssStr2Ast(`.wrap {
//   .header {
//     .left {
//       .title {
//       }
//       .sub-title {
//       }
//     }
//     .right {
//       .time {
//       }
//     }
//   }
//   .footer {
//     .copyright {
//     }
// }
// }`)
// resetScss(selectorTree, scssAst)
// const scss = generateScss(scssAst.children[0])
// console.log(scss)
// const v= scss

const program = new Command()
program.command(`file`)
  .description('初始化获取一个文件')
  .argument('<string>', 'a file name')
  .action((fileName) => {
    const filePath = path.resolve(process.cwd(), fileName)
    let content = fs.readFileSync(filePath, {
      encoding: 'utf-8'
    })
    const templateRe = /<template[^>]*>([\s\S]*)<\/template>/
    const styleRe = /(<style[^>]*>)([\s\S]*)(<\/style>)/
    const matchTemplateArr = (content.match(templateRe) as RegExpMatchArray)
    const matchStyleArr = (content.match(styleRe) as RegExpMatchArray)
    const matchTemplate = matchTemplateArr ? matchTemplateArr[1] : ''
    const matchStyle = matchStyleArr ? matchStyleArr[2] : ''

    const ast = parse(matchTemplate)
    const selectorTree = transform(ast).children[0]
    const scssAst = scssStr2Ast(matchStyle)
    resetScss(selectorTree, scssAst)
    const scss = generateScss(scssAst.children[0])
    content = content.replace(styleRe, '')
    console.log(content)

    if(matchStyleArr) {
      const matchStyleStart = matchStyleArr ? matchStyleArr[1] : ''
      const matchStyleEnd = matchStyleArr ? matchStyleArr[3] : ''
      content += matchStyleStart + scss + '\n' + matchStyleEnd
    } else {
      content += '<style lang=\"scss\" scoped>' + scss + '\n' + '</style>'
    }
    fs.writeFileSync(filePath, content)
  })

program.version(pkg.version)

program.parse(process.argv)
