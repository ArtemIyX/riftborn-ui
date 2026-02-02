<template>
  <div
    class="g-divider"
    :class="[
      `g-divider--${variant}`,
      `g-divider--${orientation}`,
      { 'g-divider--with-text': hasText }
    ]"
    role="separator"
    :aria-orientation="orientation"
  >
    <span v-if="hasText" class="g-divider__text">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'

defineOptions({
  name: 'GDivider'
})

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'danger', 'subtle', 'glow'].includes(value)
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  }
})

const slots = useSlots()

const hasText = computed(() => {
  return props.text || slots.default
})
</script>

<style src="./GDivider.css" scoped/>

