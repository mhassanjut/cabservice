// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import postcss from 'postcss'

const css = postcss.parse(readFileSync('assets/styles/css/ui-tokens.css', 'utf8'))
function tokens(selector: string) {
  const values: Record<string, string> = {}
  css.walkRules(selector, rule => { rule.walkDecls(decl => { values[decl.prop] = decl.value }) })
  return values
}
function luminance(hex: string) {
  const value = hex.slice(1)
  const normalized = value.length === 3 ? [...value].map(c => c + c).join('') : value
  const channels = [0, 2, 4].map(offset => {
    const n = parseInt(normalized.slice(offset, offset + 2), 16) / 255
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4
  })
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722
}
const pairs = [
  ['action-bg', 'action-text'], ['action-hover', 'action-text'],
  ['secondary-bg', 'secondary-text'], ['field-bg', 'field-text'],
  ['field-bg', 'field-muted'], ['field-bg', 'error'], ['disabled-bg', 'disabled-text'],
]
describe.each(['public', 'checkout'])('%s contrast contracts', (theme) => {
  const values = { ...tokens(':root'), ...(theme === 'checkout' ? tokens('.site-root--booking') : {}) }
  it.each(pairs)('%s / %s has at least 4.5:1 contrast', (background, foreground) => {
    const a = luminance(values[`--ui-${background}`]!)
    const b = luminance(values[`--ui-${foreground}`]!)
    expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toBeGreaterThanOrEqual(4.5)
  })
})
