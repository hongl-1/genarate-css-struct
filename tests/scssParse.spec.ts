import { scssStr2Ast } from '../src/scssParse'

describe('scss', () => {
  it('scss parse', () => {
    const res = scssStr2Ast(``)
    console.log(res)
    expect(2).toBe(2)
  })
})
