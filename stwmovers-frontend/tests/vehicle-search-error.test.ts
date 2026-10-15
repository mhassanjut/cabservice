import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import VehicleSearchError from '../components/VehicleSearchError.vue'

describe('vehicle search recovery', () => {
  it('offers an actionable retry and an alternative contact route', async () => {
    const wrapper = mount(VehicleSearchError, { global: { stubs: { NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } } } })
    expect(wrapper.find('[role="alert"]').text()).toContain('temporarily unavailable')
    expect(wrapper.find('a').attributes('href')).toBe('/contact')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
    wrapper.unmount()
  })

  it('prevents another retry while a search is running', async () => {
    const wrapper = mount(VehicleSearchError, { props: { busy: true }, global: { stubs: ['NuxtLink'] } })
    expect(wrapper.find('button').element.disabled).toBe(true)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('retry')).toBeUndefined()
    wrapper.unmount()
  })
})
