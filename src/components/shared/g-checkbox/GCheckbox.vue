<template>
  <label
    class="g-checkbox"
    :class="[
      `g-checkbox--${variant}`,
      `g-checkbox--${size}`,
      {
        'g-checkbox--checked': isChecked,
        'g-checkbox--disabled': disabled,
        'g-checkbox--indeterminate': indeterminate
      }
    ]"
  >
    <!-- Hidden input -->
    <input
      ref="inputRef"
      type="checkbox"
      class="g-checkbox__input"
      :checked="isChecked"
      :disabled="disabled"

      v-bind="$attrs"
      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"


    />

    <!-- Custom checkbox -->
    <span
      class="g-checkbox__box"
      :class="{ 'g-checkbox__box--focused': isFocused }"
    >
      <!-- Check icon (always rendered, visibility controlled by CSS) -->
      <svg
        class="g-checkbox__icon g-checkbox__icon--check"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>

      <!-- Indeterminate icon (always rendered, visibility controlled by CSS) -->
      <svg
        class="g-checkbox__icon g-checkbox__icon--indeterminate"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
      >
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>

      <!-- Corner accents -->
      <span class="g-checkbox__corner g-checkbox__corner--tl"></span>
      <span class="g-checkbox__corner g-checkbox__corner--br"></span>
    </span>

    <!-- Label -->
    <span v-if="label || $slots.default" class="g-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({
  name: 'GCheckbox',
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: [Boolean, Array],
    default: false
  },
  value: {
    type: [String, Number, Boolean, Object],
    default: true
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
  },
  indeterminate: {
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
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return props.modelValue === true
})

// Methods
const onChange = (e) => {
  if (props.disabled) return

  let newValue

  if (Array.isArray(props.modelValue)) {
    newValue = [...props.modelValue]
    if (e.target.checked) {
      newValue.push(props.value)
    } else {
      const index = newValue.indexOf(props.value)
      if (index > -1) newValue.splice(index, 1)
    }
  } else {
    newValue = e.target.checked
  }

  emit('update:modelValue', newValue)
  emit('change', newValue)
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

<style src="./GCheckbox.css" scoped/>
