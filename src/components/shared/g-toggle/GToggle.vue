<template>
  <label
    class="g-toggle"
    :class="[
      `g-toggle--${variant}`,
      `g-toggle--${size}`,
      {
        'g-toggle--checked': modelValue,
        'g-toggle--disabled': disabled
      }
    ]"
  >
    <!-- Hidden input -->
    <input
      ref="inputRef"
      type="checkbox"
      class="g-toggle__input"
      :checked="modelValue"
      :disabled="disabled"
      v-bind="$attrs"
      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

    <!-- Track -->
    <span
      class="g-toggle__track"
      :class="{ 'g-toggle__track--focused': isFocused }"
    >
      <!-- Track glow -->
      <span class="g-toggle__glow"></span>

      <!-- Thumb -->
      <span class="g-toggle__thumb">
        <span class="g-toggle__thumb-dot"></span>
      </span>

      <!-- Status indicators -->
      <span class="g-toggle__status g-toggle__status--on">I</span>
      <span class="g-toggle__status g-toggle__status--off">O</span>
    </span>

    <!-- Label -->
    <span v-if="label || $slots.default" class="g-toggle__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'GToggle',
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'danger', 'success'].includes(value)
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

const emit = defineEmits(['update:modelValue', 'change'])

// Refs
const inputRef = ref(null)
const isFocused = ref(false)

// Methods
const onChange = (e) => {
  if (props.disabled) return
  const newValue = e.target.checked
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

const toggle = () => {
  if (props.disabled) return
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

// Expose
defineExpose({
  focus,
  blur,
  toggle,
  inputRef
})
</script>

<style src="./GToggle.css" scoped/>
