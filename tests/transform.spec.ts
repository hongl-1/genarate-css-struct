import { transform } from '../src/transform'
import { parse } from '../src/parse'

describe('transform', () => {
  it('happy path', () => {
    const ast = parse('<div class="foo"><p class="bar"></p></div>')
    const selectorTree = transform(ast)
    expect(selectorTree).toEqual({
      selectorNames: [],
      children: [
        {
          selectorNames: ['.foo'],
          children: [
            {
              selectorNames: ['.bar'],
              children: []
            }
          ]
        }
      ]
    })
  })
  it('muti class name', () => {
    const ast = parse(`<div class="foo baz bar" :class="{test ? 's' : 'c'}" :id="{test ? 'c' : 'a'}"><p class="foo baz bar"></p></div>`)
    const selectorTree = transform(ast)
    expect(selectorTree).toEqual({
      selectorNames: [],
      children: [
        {
          selectorNames: ['.foo', '.baz', '.bar', '.s', '.c', '#c', '#a'],
          children: [
            {
              selectorNames: ['.foo', '.baz', '.bar'],
              children: []
            }
          ]
        }
      ]
    })
  })
})
