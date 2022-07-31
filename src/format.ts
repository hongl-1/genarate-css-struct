import { css_beautify } from 'js-beautify'

export const cssBeautifyOptions = {
  indent_size: 2
}

export function cssBeautify(source: string) {
  return css_beautify(source, cssBeautifyOptions)
}
