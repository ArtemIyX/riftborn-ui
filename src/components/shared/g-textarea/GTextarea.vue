<template>
  <div
    class="g-textarea"
    :class="[
      `g-textarea--${variant}`,
      `g-textarea--${size}`,
      {
        'g-textarea--focused': isFocused,
        'g-textarea--disabled': disabled,
        'g-textarea--readonly': readonly,
        'g-textarea--error': error,
        'g-textarea--resize': resize
      }
    ]"
  >
    <!-- Label -->
    <label v-if="label" class="g-textarea__label" :for="textareaId">
      {{ label }}
      <span v-if="required" class="g-textarea__required">*</span>
    </label>

    <!-- Textarea wrapper -->
    <div class="g-textarea__wrapper">
      <textarea
        :id="textareaId"
        ref="textareaRef"
        class="g-textarea__field"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :rows="rows"
        v-bind="$attrs"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="$emit('keydown', $event)"
        @keyup="$emit('keyup', $event)"
      ></textarea>

      <!-- Scanline effect -->
      <span v-if="variant === 'primary'" class="g-textarea__scanline"></span>
    </div>

    <!-- Footer -->
    <div class="g-textarea__footer">
      <!-- Helper / Error text -->
      <div v-if="error || hint" class="g-textarea__helper">
        <span v-if="error" class="g-textarea__error">{{ error }}</span>
        <span v-else-if="hint" class="g-textarea__hint">{{ hint }}</span>
      </div>
      <div v-else></div>

      <!-- Character count -->
      <div v-if="showCount" class="g-textarea__count">
        {{ modelValue?.length || 0 }}<span v-if="maxlength">/{{ maxlength }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({
  name: 'GTextarea',
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
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
  rows: {
    type: Number,
    default: 4
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
  maxlength: {
    type: Number,
    default: null
  },
  showCount: {
    type: Boolean,
    default: false
  },
  resize: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'keydown', 'keyup'])

// Refs
const textareaRef = ref(null)
const isFocused = ref(false)

// Computed
let idCounter = 0
const textareaId = computed(() => `g-textarea-${++idCounter}`)

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

const focus = () => {
  textareaRef.value?.focus()
}

const blur = () => {
  textareaRef.value?.blur()
}

// Expose methods
defineExpose({
  focus,
  blur,
  textareaRef
})
</script>

<style src="./GTextArea.css" scoped/>
