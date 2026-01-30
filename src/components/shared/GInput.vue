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

<style scoped>
/* ============================================
   G-INPUT
   Space Horror UI Component
   ============================================ */

.g-input {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 320px;
}

/* --------------------------------------------
   LABEL
   -------------------------------------------- */

.g-input__label {
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--input-label, #8892a2);
  cursor: pointer;
}

.g-input__required {
  color: #ff3344;
  margin-left: 2px;
}

/* --------------------------------------------
   WRAPPER
   -------------------------------------------- */

.g-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;

  background-color: var(--input-bg, #0f1218);
  border: 1px solid var(--input-border, #2a3444);

  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.g-input__wrapper:hover {
  background-color: var(--input-bg-hover, #161b24);
  border-color: var(--input-border-hover, #3a4a5e);
}

.g-input--focused .g-input__wrapper {
  border-color: var(--input-accent, #00d4d4);
  box-shadow: 0 0 12px var(--input-glow, rgba(0, 212, 212, 0.15));
}

.g-input--error .g-input__wrapper {
  border-color: #ff3344;
  box-shadow: 0 0 12px rgba(255, 51, 68, 0.15);
}

/* --------------------------------------------
   FIELD
   -------------------------------------------- */

.g-input__field {
  flex: 1;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;

  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--input-color, #e0e4ea);

  transition: color 0.15s ease;
}

.g-input__field::placeholder {
  color: var(--input-placeholder, #505868);
}

.g-input__field::-webkit-outer-spin-button,
.g-input__field::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.g-input__field[type='number'] {
  -moz-appearance: textfield;
}

/* --------------------------------------------
   PREFIX & SUFFIX
   -------------------------------------------- */

.g-input__prefix,
.g-input__suffix {
  flex-shrink: 0;
  display: flex;
  align-items: center;

  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 11px;
  color: var(--input-addon, #505868);

  user-select: none;
}

.g-input__prefix {
  padding-left: 10px;
}

.g-input__suffix {
  padding-right: 10px;
}

/* --------------------------------------------
   CLEAR BUTTON
   -------------------------------------------- */

.g-input__clear {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 6px;

  background: transparent;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  color: var(--input-addon, #505868);

  transition: color 0.15s ease, background-color 0.15s ease;
}

.g-input__clear:hover {
  color: #e0e4ea;
  background-color: rgba(255, 255, 255, 0.05);
}

.g-input__clear svg {
  width: 14px;
  height: 14px;
}

/* --------------------------------------------
   HELPER TEXT
   -------------------------------------------- */

.g-input__helper {
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-size: 11px;
  font-weight: 500;
}

.g-input__hint {
  color: #505868;
}

.g-input__error {
  color: #ff3344;
}

/* --------------------------------------------
   CHARACTER COUNT
   -------------------------------------------- */

.g-input__count {
  position: absolute;
  right: 0;
  bottom: -18px;

  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 10px;
  color: #505868;
}

.g-input--focused .g-input__count {
  color: var(--input-accent, #00d4d4);
}

/* --------------------------------------------
   SIZES
   -------------------------------------------- */

.g-input--small .g-input__wrapper {
  height: 28px;
}

.g-input--small .g-input__field {
  padding: 4px 10px;
  font-size: 11px;
}

.g-input--medium .g-input__wrapper {
  height: 36px;
}

.g-input--medium .g-input__field {
  padding: 6px 12px;
  font-size: 12px;
}

.g-input--large .g-input__wrapper {
  height: 44px;
}

.g-input--large .g-input__field {
  padding: 8px 14px;
  font-size: 14px;
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Default */
.g-input--default {
  --input-bg: #0f1218;
  --input-bg-hover: #161b24;
  --input-color: #e0e4ea;
  --input-border: #2a3444;
  --input-border-hover: #3a4a5e;
  --input-accent: #00d4d4;
  --input-glow: rgba(0, 212, 212, 0.15);
  --input-label: #8892a2;
  --input-placeholder: #505868;
  --input-addon: #505868;
}

/* Primary */
.g-input--primary {
  --input-bg: rgba(0, 212, 212, 0.05);
  --input-bg-hover: rgba(0, 212, 212, 0.08);
  --input-color: #e0e4ea;
  --input-border: rgba(0, 212, 212, 0.3);
  --input-border-hover: rgba(0, 212, 212, 0.5);
  --input-accent: #00d4d4;
  --input-glow: rgba(0, 212, 212, 0.2);
  --input-label: #00d4d4;
  --input-placeholder: #007070;
  --input-addon: #00a0a0;
}

/* Ghost */
.g-input--ghost {
  --input-bg: transparent;
  --input-bg-hover: rgba(136, 146, 162, 0.05);
  --input-color: #e0e4ea;
  --input-border: transparent;
  --input-border-hover: rgba(136, 146, 162, 0.2);
  --input-accent: #8892a2;
  --input-glow: rgba(136, 146, 162, 0.1);
  --input-label: #8892a2;
  --input-placeholder: #505868;
  --input-addon: #505868;
}

.g-input--ghost .g-input__wrapper {
  border-bottom: 1px solid #2a3444;
}

.g-input--ghost.g-input--focused .g-input__wrapper {
  border-bottom-color: var(--input-accent);
}

/* --------------------------------------------
   DISABLED & READONLY
   -------------------------------------------- */

.g-input--disabled {
  pointer-events: none;
}

.g-input--disabled .g-input__wrapper {
  --input-bg: rgba(80, 88, 104, 0.05);
  --input-border: rgba(80, 88, 104, 0.15);
}

.g-input--disabled .g-input__field {
  color: #505868;
}

.g-input--disabled .g-input__label {
  color: #505868;
}

.g-input--readonly .g-input__field {
  cursor: default;
}
</style>
