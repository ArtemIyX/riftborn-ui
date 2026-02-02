<template>
  <label
    class="g-radio"
    :class="[
      `g-radio--${variant}`,
      `g-radio--${size}`,
      {
        'g-radio--checked': isChecked,
        'g-radio--disabled': disabled
      }
    ]"
  >
    <!-- Hidden input -->
    <input
      ref="inputRef"
      type="radio"
      class="g-radio__input"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      v-bind="$attrs"
      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

    <!-- Custom radio -->
    <span
      class="g-radio__box"
      :class="{ 'g-radio__box--focused': isFocused }"
    >
      <!-- Outer ring -->
      <span class="g-radio__ring"></span>

      <!-- Inner dot -->
      <span class="g-radio__dot"></span>

      <!-- Pulse effect -->
      <span class="g-radio__pulse"></span>
    </span>

    <!-- Label -->
    <span v-if="label || $slots.default" class="g-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({
  name: 'GRadio',
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: null
  },
  value: {
    type: [String, Number, Boolean, Object],
    required: true
  },
  name: {
    type: String,
    default: ''
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

// Computed
const isChecked = computed(() => {
  return props.modelValue === props.value
})

// Methods
const onChange = () => {
  if (props.disabled) return
  emit('update:modelValue', props.value)
  emit('change', props.value)
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

// Expose
defineExpose({
  focus,
  blur,
  inputRef
})
</script>

<style src="./GRadio.css" scoped/>

