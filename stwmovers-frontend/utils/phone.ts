import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js'
import { getExampleNumber } from 'libphonenumber-js/max'
import examples from 'libphonenumber-js/mobile/examples'

export const DEFAULT_PHONE_COUNTRY: CountryCode = 'ES'

export const PREFERRED_PHONE_COUNTRIES: CountryCode[] = ['ES', 'GB', 'FR', 'DE', 'IT', 'PT', 'US']

const FALLBACK_PHONE_PLACEHOLDER = '600 000 000'

export function getPhonePlaceholder(country: CountryCode = DEFAULT_PHONE_COUNTRY): string {
  const example = getExampleNumber(country, examples)
  if (!example) return FALLBACK_PHONE_PLACEHOLDER
  return example.formatNational()
}

export function normalizePhone(
  phone: string,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY,
): string {
  const trimmed = phone.trim()
  if (!trimmed) return ''

  const parsed = parsePhoneNumberFromString(trimmed, defaultCountry)
  return parsed?.format('E.164') ?? trimmed
}

export function isValidPhone(
  phone: string | null | undefined,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY,
): boolean {
  const value = (phone ?? '').trim()
  if (!value) return false
  return isValidPhoneNumber(value, defaultCountry)
}
