<template>
  <div
    class="g-input"
    :class="[
      `g-input--${variant}`,
      `g-input--${size}`,
      {
        'g-input--focused': isFocused,
        'g-input--disabled': disabled,
        'g-input--readonly': readonly,
        'g-input--error': error
      }
    ]"
  >
    <!-- Label -->
    <label v-if="label" class="g-input__label" :for="inputId">
      {{ label }}
      <span v-if="required" class="g-input__required">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="g-input__wrapper">
      <!-- Prefix -->
      <span v-if="$slots.prefix || prefix" class="g-input__prefix">
        <slot name="prefix">{{ prefix }}</slot>
      </span>

      <!-- Input -->
      <input
        :id="inputId"
        ref="inputRef"
        class="g-input__field"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        v-bind="$attrs"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="$emit('keydown', $event)"
        @keyup="$emit('keyup', $event)"
      />

      <!-- Clear button -->
      <button
        v-if="clearable && modelValue && !disabled && !readonly"
        type="button"
        class="g-input__clear"
        tabindex="-1"
        @click="clear"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Suffix -->
      <span v-if="$slots.suffix || suffix" class="g-input__suffix">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
    </div>

    <!-- Helper / Error text -->
    <div v-if="error || hint" class="g-input__helper">
      <span v-if="error" class="g-input__error">{{ error }}</span>
      <span v-else-if="hint" class="g-input__hint">{{ hint }}</span>
    </div>

    <!-- Character count -->
    <div v-if="showCount && maxlength" class="g-input__count">
      {{ modelValue?.length || 0 }}/{{ maxlength }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({
  name: 'GInput',
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'ghost'].includes(value)
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
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number,
    default: null
  },
  showCount: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: 'off'
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'clear', 'keydown', 'keyup'])

// Refs
const inputRef = ref(null)
const isFocused = ref(false)

// Computed
let idCounter = 0
const inputId = computed(() => `g-input-${++idCounter}`)

// Methods
const onInput = (e) => {
  emit('update:modelValue', e.target.value)
}

const onFocus = (e) => {
  isFocused.value = true
  emit('focus', e)
}

const onBlur = (e) => {
  isFocused.value = false
  emit('blur', e)
}

const clear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

// Expose methods
defineExpose({
  focus,
  blur,
  inputRef
})
</script>

<style src="./GInput.css" scoped/>

