<script setup lang="ts">
const model = defineModel<string>({ default: '' })
const digits = ref(['', '', '', '', '', ''])
const inputs = ref<HTMLInputElement[]>([])

watch(digits, (d) => {
  model.value = d.join('')
}, { deep: true })

const onInput = (i: number, e: Event) => {
  const v = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(-1)
  digits.value[i] = v
  if (v && i < 5) inputs.value[i + 1]?.focus()
}

const onKey = (i: number, e: KeyboardEvent) => {
  if (e.key === 'Backspace' && !digits.value[i] && i > 0) inputs.value[i - 1]?.focus()
}
</script>

<template>
  <div class="otp-row" role="group" aria-label="One-time password digits">
    <input
      v-for="(_, i) in digits"
      :key="i"
      :ref="(el) => { if (el) inputs[i] = el as HTMLInputElement }"
      class="otp-box"
      type="text"
      inputmode="numeric"
      maxlength="1"
      autocomplete="one-time-code"
      :aria-label="`Digit ${i + 1} of 6`"
      :value="digits[i]"
      @input="onInput(i, $event)"
      @keydown="onKey(i, $event)"
    />
  </div>
</template>
