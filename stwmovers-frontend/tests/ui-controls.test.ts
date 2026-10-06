import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiButton from '../components/ui/UiButton.vue'
import UiTextField from '../components/ui/UiTextField.vue'

describe('shared controls', () => {
  it('does not submit a surrounding form unless explicitly requested', () => {
    const button = mount(UiButton, { slots: { default: 'Request a quote' } })
    expect(button.attributes('type')).toBe('button')
    expect(button.text()).toBe('Request a quote')
  })

  it('preserves an external destination and native attributes', () => {
    const button = mount(UiButton, { props: { href: 'https://example.com', variant: 'secondary' }, attrs: { rel: 'noopener' } })
    expect(button.element.tagName).toBe('A')
    expect(button.attributes('href')).toBe('https://example.com')
    expect(button.attributes('rel')).toBe('noopener')
  })

  it('uses the Nuxt router for internal destinations', () => {
    const button = mount(UiButton, {
      props: { to: '/journey#book-journey' },
      global: { components: { NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } } },
    })
    expect(button.attributes('href')).toBe('/journey#book-journey')
  })

  it.each([{ disabled: true }, { loading: true }])('prevents navigation while unavailable: %o', (state) => {
    const button = mount(UiButton, { props: { href: 'https://example.com', ...state }, slots: { default: 'Continue' } })
    expect(button.element.tagName).toBe('BUTTON')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.attributes('href')).toBeUndefined()
    expect(button.text()).toBe('Continue')
    if ('loading' in state) expect(button.attributes('aria-busy')).toBe('true')
  })

  it('connects label and error with the actual input and emits edits', async () => {
    const field = mount(UiTextField, {
      props: { id: 'email', label: 'Email', modelValue: '', error: 'Enter an email address' },
      attrs: { type: 'email', required: true, autocomplete: 'email' },
    })
    expect(field.get('label').attributes('for')).toBe('email')
    expect(field.get('input').attributes()).toMatchObject({ id: 'email', type: 'email', 'aria-invalid': 'true', 'aria-describedby': 'email-error' })
    expect(field.get('#email-error').attributes('role')).toBe('alert')
    await field.get('input').setValue('guest@example.com')
    expect(field.emitted('update:modelValue')?.[0]).toEqual(['guest@example.com'])
    await field.setProps({ error: '' })
    expect(field.find('[role="alert"]').exists()).toBe(false)
    expect(field.get('input').attributes('aria-invalid')).toBeUndefined()
  })
})
