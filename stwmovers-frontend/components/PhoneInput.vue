<script setup lang="ts">
import { VueTelInput } from 'vue-tel-input'
import type { CountryObject, PhoneObject } from 'vue-tel-input'
import type { CountryCode } from 'libphonenumber-js'
import {
  DEFAULT_PHONE_COUNTRY,
  getPhonePlaceholder,
} from '~/utils/phone'

const props = withDefaults(
  defineProps<{
    modelValue: string
    disabled?: boolean
    id?: string
    defaultCountry?: string
    autofocus?: boolean
    invalid?: boolean
  }>(),
  {
    disabled: false,
    defaultCountry: DEFAULT_PHONE_COUNTRY,
    autofocus: false,
    invalid: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  validate: [valid: boolean]
}>()

const phone = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})

const selectedCountry = ref<CountryCode>(props.defaultCountry as CountryCode)

watch(
  () => props.defaultCountry,
  (country: string) => {
    selectedCountry.value = country as CountryCode
  },
)

const phonePlaceholder = computed(() => getPhonePlaceholder(selectedCountry.value))

const inputOptions = computed(() => ({
  id: props.id,
  autocomplete: 'tel',
  autofocus: props.autofocus,
  inputmode: 'tel' as const,
  name: 'phone',
  placeholder: phonePlaceholder.value,
  required: true,
  type: 'tel',
}))

const onValidate = (phoneObject: PhoneObject) => {
  emit('validate', phoneObject.valid)
}

const onCountryChanged = (country: CountryObject) => {
  selectedCountry.value = country.iso2
}

const rootRef = ref<HTMLElement | null>(null)
const ready = ref(false)

function bindDropdownFix() {
  const dropdown = rootRef.value?.querySelector('.vti__dropdown')
  if (!dropdown || dropdown.getAttribute('data-dropdown-fix-bound') === 'true') {
    return
  }

  dropdown.setAttribute('data-dropdown-fix-bound', 'true')

  dropdown.addEventListener('mousedown', (event: MouseEvent) => {
    const target = event.target
    if (!(target instanceof Element)) return

    // Let the search field and country list handle focus/clicks normally.
    if (target.closest('.vti__dropdown-list, .vti__search_box, .vti__search_box_container')) {
      return
    }

    // Prevent focus churn on the tel field from swallowing the first toggle click.
    event.preventDefault()
  })

  dropdown.addEventListener('click', (event: MouseEvent) => {
    const target = event.target
    if (!(target instanceof Element)) return

    // Keep list/search interactions working; only isolate the toggle button click.
    if (target.closest('.vti__dropdown-list')) {
      return
    }

    // Keep the opening click from reaching vue-tel-input's body click-outside handler.
    event.stopPropagation()
  })

  // vue-tel-input attaches type-to-find on the dropdown wrapper; route typing to search instead.
  dropdown.addEventListener('keydown', (event: KeyboardEvent) => {
    if (!dropdown.classList.contains('open')) return

    const searchBox = dropdown.querySelector<HTMLInputElement>('.vti__search_box')
    if (!searchBox) return

    if (event.target instanceof Element && event.target.closest('.vti__search_box')) {
      return
    }

    const isPrintable =
      event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey

    if (!isPrintable) return

    event.preventDefault()
    event.stopImmediatePropagation()

    searchBox.focus({ preventScroll: true })
    searchBox.value = `${searchBox.value}${event.key}`
    searchBox.dispatchEvent(new Event('input', { bubbles: true }))
  }, true)
}

function setupSearchInteraction() {
  nextTick(() => {
    const searchBox = rootRef.value?.querySelector<HTMLInputElement>('.vti__search_box')
    if (!searchBox) return

    if (searchBox.getAttribute('data-search-fix-bound') !== 'true') {
      searchBox.setAttribute('data-search-fix-bound', 'true')
      searchBox.addEventListener('keydown', (event: KeyboardEvent) => {
        event.stopPropagation()
      })
    }

    searchBox.focus({ preventScroll: true })
  })
}

onMounted(async () => {
  ready.value = true
  await nextTick()
  bindDropdownFix()
})
</script>

<template>
  <div ref="rootRef" class="phone-input">
    <VueTelInput
      v-if="ready"
      v-model="phone"
      class="phone-input__control"
      :class="{ 'phone-input__control--invalid': invalid }"
      mode="international"
      :default-country="defaultCountry"
      :preferred-countries="[]"
      :auto-default-country="false"
      valid-characters-only
      :disabled="disabled"
      :input-options="inputOptions"
      :dropdown-options="{
        showFlags: true,
        showSearchBox: true,
        showDialCodeInList: true,
        showDialCodeInSelection: true,
        searchBoxPlaceholder: 'Search country',
        tabindex: -1,
      }"
      @validate="onValidate"
      @country-changed="onCountryChanged"
      @open="setupSearchInteraction"
    />

    <div v-else class="phone-input__fallback" aria-hidden="true">
      <span class="phone-input__fallback-flag" />
      <span class="phone-input__fallback-field" />
    </div>
  </div>
</template>

<style scoped>
/*
 * VueTelInput root element = .vue-tel-input.phone-input__control
 * Do NOT set display:block on __control — it breaks the horizontal flex layout.
 */
.phone-input {
  width: 100%;
  color: #1a1a1a;
}

.phone-input__fallback {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 52px;
  padding: 0 14px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  background: #fff;
}

.phone-input__fallback-flag {
  width: 28px;
  height: 20px;
  border-radius: 3px;
  background: #f3f4f6;
}

.phone-input__fallback-field {
  flex: 1;
  height: 14px;
  border-radius: 999px;
  background: #f3f4f6;
}

.phone-input__control {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  min-height: 52px;
  border: 1px solid #e5e5e5 !important;
  border-radius: 10px !important;
  background: #fff !important;
  box-shadow: none !important;
  color: #1a1a1a;
  text-align: left;
  transition: border-color 0.2s ease;
}

.phone-input__control:focus-within {
  border-color: #d8b24c !important;
}

.phone-input__control--invalid {
  border-color: #dc2626 !important;
}

.phone-input__control :deep(.vti__dropdown) {
  position: static;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  min-width: 88px;
  padding: 0 10px 0 12px;
  border-right: 1px solid #eef0f2;
  background: transparent;
  color: #374151;
  cursor: pointer;
}

.phone-input__control :deep(.vti__dropdown.show),
.phone-input__control :deep(.vti__dropdown.open) {
  max-height: none;
  overflow: visible;
  background: rgba(216, 178, 76, 0.08);
}

.phone-input__control :deep(.vti__selection) {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  line-height: 1;
  color: #374151;
}

.phone-input__control :deep(.vti__selection .vti__country-code) {
  margin-left: 2px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
}

.phone-input__control :deep(.vti__selection .vti__flag) {
  margin: 0;
}

.phone-input__control :deep(.vti__dropdown-list) {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 650;
  width: auto;
  max-height: 240px;
  margin: 0;
  padding: 4px 0 6px;
  list-style: none;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: #fff;
  color: #1a1a1a;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.14);
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.phone-input__control :deep(.vti__dropdown-list::-webkit-scrollbar) {
  width: 8px;
}

.phone-input__control :deep(.vti__dropdown-list::-webkit-scrollbar-thumb) {
  border-radius: 999px;
  background: #d1d5db;
}

.phone-input__control :deep(.vti__dropdown-item) {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: 0.875rem;
  line-height: 1.4;
  color: #1a1a1a;
  cursor: pointer;
}

.phone-input__control :deep(.vti__dropdown-item .vti__flag) {
  flex-shrink: 0;
  margin: 0;
}

.phone-input__control :deep(.vti__dropdown-item.highlighted) {
  background: rgba(216, 178, 76, 0.14);
  color: #1a1a1a;
}

.phone-input__control :deep(.vti__search_box_container) {
  display: block;
  flex: none;
  padding: 0;
  margin: 0;
  list-style: none;
}

.phone-input__control :deep(input.vti__search_box.vti__input) {
  box-sizing: border-box;
  display: block;
  flex: none;
  width: calc(100% - 12px) !important;
  min-width: 0;
  height: 38px;
  min-height: 38px;
  margin: 4px 6px 6px;
  padding: 9px 10px !important;
  border: 1px solid #e5e5e5 !important;
  border-radius: 8px !important;
  background: #fff !important;
  color: #1a1a1a;
  font: 400 0.875rem/1.25 var(--font-sans, Inter, sans-serif) !important;
  outline: none;
  box-shadow: none;
  -webkit-appearance: none;
  appearance: none;
}

.phone-input__control :deep(input.vti__search_box.vti__input::placeholder) {
  color: #9ca3af;
}

.phone-input__control :deep(input.vti__search_box.vti__input:focus) {
  outline: none;
  box-shadow: none;
  border-color: #e5e5e5 !important;
}

.phone-input__control :deep(.vti__input:not(.vti__search_box)) {
  flex: 1 1 auto;
  min-width: 0;
  width: auto !important;
  height: auto;
  min-height: 52px;
  padding: 0 14px;
  border: 0 !important;
  border-radius: 0 10px 10px 0 !important;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #1a1a1a;
}

.phone-input__control :deep(.vti__input:not(.vti__search_box)::placeholder) {
  color: #a7a7a7;
}

.phone-input__control :deep(.vti__input:not(.vti__search_box):focus) {
  outline: none;
  box-shadow: none;
}
</style>
