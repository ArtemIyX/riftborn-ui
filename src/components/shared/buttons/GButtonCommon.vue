<template>
  <button
    class="g-btn-common"
    :class="[
      `g-btn-common--${variant}`,
      `g-btn-common--${size}`,
      { 'g-btn-common--disabled': disabled }
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <span class="g-btn-common__content">
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script setup>
defineOptions({
  name: 'GButtonCommon',
  inheritAttrs: false
})

defineProps({
  text: {
    type: String,
    default: 'OK'
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary', 'danger', 'ghost'].includes(value)
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

<style src="./GButtonCommon.css" scoped/>
