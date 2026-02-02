<template>
  <button
    class="g-btn"
    :class="[
      `g-btn--${variant}`,
      `g-btn--${size}`,
      { 'g-btn--disabled': disabled }
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <span class="g-btn__glow"></span>
    <span class="g-btn__border"></span>
    <span class="g-btn__content">
      <slot>{{ text }}</slot>
    </span>
    <span class="g-btn__scanline"></span>
  </button>
</template>

<script setup>
defineOptions({
  name: 'GButton',
  inheritAttrs: false
})

defineProps({
  text: {
    type: String,
    default: 'ENGAGE'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'warning', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style src="./GButton.css" scoped/>
