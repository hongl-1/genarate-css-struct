import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: './lib/bundle.esm.js',
      format: 'esm'
    },
    {
      file: './lib/bundle.cjs.js',
      format: 'cjs'
    }
  ],
  plugins: [
    typescript(),
    json()
  ]
}
