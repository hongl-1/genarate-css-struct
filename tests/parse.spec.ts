import { parse } from '../src/parse'

describe('parse', () => {
  it('happy path', () => {
    const res = parse('<div class="foo"></div>')
    expect(res).toEqual( {
      type: 'root',
      tag: 'root',
      isVoidElement: false,
      class: '',
      bindClass: '',
      id:'',
      bindId:'',
      children: [{
        type: 'tag',
        tag: 'div',
        class: 'foo',
        bindClass: '',
        id:'',
        bindId:'',
        isVoidElement: false,
        children: []
      }]
    })
  })
  it('muti tag', () => {
    const res = parse('<div class="foo"><p class="bar"></p></div>')
    expect(res).toEqual({
      type: 'root',
      tag: 'root',
      isVoidElement: false,
      class: '',
      bindClass: '',
      id:'',
      bindId:'',
      children: [
        {
          type: 'tag',
          tag: 'div',
          class: 'foo',
          bindClass: '',
          id:'',
          bindId:'',
          isVoidElement: false,
          children: [
            {
              type: 'tag',
              tag: 'p',
              class: 'bar',
              bindClass: '',
              id:'',
              bindId:'',
              isVoidElement: false,
              children: []
            }
          ]
        }
      ]
    })
  })
})
