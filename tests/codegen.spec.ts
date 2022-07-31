import { parse } from '../src/parse'
import { transform } from '../src/transform'
import { codegen } from '../src/codegen'
import { cssBeautify } from '../src/format'
// {
//   selectorNames: [],
//   children: [
//     {
//       selectorNames: ['foo'],
//       children: [
//         {
//           selectorNames: ['bar'],
//           children: []
//         }
//       ]
//     }
//   ]
// }
describe('codegen', () => {
  it('happy path', () => {
    const ast = parse('<div class="foo"><div class="bar"></div>')
    const selectorTree = transform(ast)
    expect(codegen(selectorTree)).toBe(cssBeautify('.foo{.bar{}}'))
  })
  it('多个子集', () => {
    const ast = parse(`
      <div class="foo baz">
        <div class="bar"></div>
        <div class="bar1"></div>
        <div class="bar2"></div>
      </div>`
    )
    const selectorTree = transform(ast)
    const result = '.foo{.bar{}.bar1{}.bar2{}}.baz{}'
    expect(codegen(selectorTree)).toBe(cssBeautify(result))
  })

  it('多个元素', () => {
    const ast = parse(`
      <div class="foo baz">
        <div class="bar"></div>
        <div class="bar1"></div>
        <div class="bar2"></div>
      </div>
      <div class="foo2 baz2">
        <div class="bar"></div>
        <div class="bar1"></div>
        <div class="bar2"></div>
      </div>
`
    )
    const selectorTree = transform(ast)
    const result = '.foo{.bar{}.bar1{}.bar2{}}.baz{}.foo2{.bar{}.bar1{}.bar2{}}.baz2{}'
    expect(codegen(selectorTree)).toBe(
      cssBeautify(result)
    )
  })

  it('模拟正常元素', () => {
    const ast = parse(`
      <div class="header">
        <div class="title">
          <span class="title-content"></span>
        </div>
        <div class="icon">
          <img src="/images/logo.png" class="logo" alt="" v-if="a == 1">
          <img src="/images/avatar.png" class="avatar" alt="" v-else>
        </div>
      </div>
`
    )
    const selectorTree = transform(ast)
    const result = '.header{.title{.title-content{}}.icon{.logo{}.avatar{}}}'
    expect(codegen(selectorTree)).toBe(cssBeautify(result))
  })
})
