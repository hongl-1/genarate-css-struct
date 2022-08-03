import typescript from '@rollup/plugin-typescript'

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
  plugins: [typescript()]
}
