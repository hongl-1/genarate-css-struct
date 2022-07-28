import { parse } from '../src/parse'

describe('parse', () => {
  it('happy path', () => {
    const res = parse('<div class="foo"></div>')
    expect(res).toEqual( {
      type: 'root',
      children: [{
        type: 'tag',
        tag: 'div',
        class: '"foo"',
        bindClass: '',
        isVoidElement: false,
        children: []
      }]
    })
  })
  it('muti tag', () => {
    const res = parse('<div class="foo"><p class="bar"></p></div>')
    expect(res).toEqual({
      type: 'root',
      children: [
        {
          type: 'tag',
          tag: 'div',
          class: '"foo"',
          bindClass: '',
          isVoidElement: false,
          children: [
            {
              type: 'tag',
              tag: 'p',
              class: '"bar"',
              bindClass: '',
              isVoidElement: false,
              children: []
            }
          ]
        }
      ]
    })
  })
})
