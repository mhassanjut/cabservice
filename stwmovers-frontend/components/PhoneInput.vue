<script setup lang="ts">
import { VueTelInput } from 'vue-tel-input'
import type { CountryObject, PhoneObject } from 'vue-tel-input'
import type { CountryCode } from 'libphonenumber-js'
import {
  DEFAULT_PHONE_COUNTRY,
  getPhonePlaceholder,
  PREFERRED_PHONE_COUNTRIES,
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
</script>

<template>
  <div class="phone-input">
    <ClientOnly>
      <VueTelInput
        v-model="phone"
        class="phone-input__control"
        :class="{ 'phone-input__control--invalid': invalid }"
        mode="international"
        :default-country="defaultCountry"
        :preferred-countries="PREFERRED_PHONE_COUNTRIES"
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
        }"
        @validate="onValidate"
        @country-changed="onCountryChanged"
      />

      <template #fallback>
        <div class="phone-input__fallback" aria-hidden="true">
          <span class="phone-input__fallback-flag" />
          <span class="phone-input__fallback-field" />
        </div>
      </template>
    </ClientOnly>
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

.phone-input__control :deep(.vti__search_box) {
  box-sizing: border-box;
  width: calc(100% - 12px);
  margin: 4px 6px 6px;
  padding: 8px 10px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #fff;
  color: #1a1a1a;
  font-size: 0.875rem;
}

.phone-input__control :deep(.vti__search_box::placeholder) {
  color: #9ca3af;
}

.phone-input__control :deep(.vti__input) {
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

.phone-input__control :deep(.vti__input::placeholder) {
  color: #a7a7a7;
}

.phone-input__control :deep(.vti__input:focus) {
  outline: none;
  box-shadow: none;
}
</style>
