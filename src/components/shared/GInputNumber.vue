<template>
  <div
    class="g-input-number"
    :class="[
      `g-input-number--${variant}`,
      `g-input-number--${size}`,
      {
        'g-input-number--focused': isFocused,
        'g-input-number--disabled': disabled,
        'g-input-number--readonly': readonly,
        'g-input-number--error': error,
        'g-input-number--at-min': isAtMin,
        'g-input-number--at-max': isAtMax
      }
    ]"
  >
    <!-- Label -->
    <label v-if="label" class="g-input-number__label" :for="inputId">
      {{ label }}
      <span v-if="required" class="g-input-number__required">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="g-input-number__wrapper">
      <!-- Corner accents -->
      <span class="g-input-number__corner g-input-number__corner--tl"></span>
      <span class="g-input-number__corner g-input-number__corner--br"></span>

      <!-- Decrement button -->
      <button
        type="button"
        class="g-input-number__btn g-input-number__btn--decrement"
        :disabled="disabled || readonly || isAtMin"
        tabindex="-1"
        @mousedown="startDecrement"
        @mouseup="stopChange"
        @mouseleave="stopChange"
        @touchstart.prevent="startDecrement"
        @touchend="stopChange"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span class="g-input-number__btn-glow"></span>
      </button>

      <!-- Input field -->
      <div class="g-input-number__field-wrapper">
        <input
          :id="inputId"
          ref="inputRef"
          type="text"
          inputmode="decimal"
          class="g-input-number__field"
          :value="displayValue"
          :disabled="disabled"
          :readonly="readonly"
          v-bind="$attrs"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onKeydown"
        />

        <!-- Unit suffix -->
        <span v-if="unit" class="g-input-number__unit">{{ unit }}</span>

        <!-- Scanline effect -->
        <span class="g-input-number__scanline"></span>
      </div>

      <!-- Increment button -->
      <button
        type="button"
        class="g-input-number__btn g-input-number__btn--increment"
        :disabled="disabled || readonly || isAtMax"
        tabindex="-1"
        @mousedown="startIncrement"
        @mouseup="stopChange"
        @mouseleave="stopChange"
        @touchstart.prevent="startIncrement"
        @touchend="stopChange"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span class="g-input-number__btn-glow"></span>
      </button>
    </div>

    <!-- Helper / Error text -->
    <div v-if="error || hint" class="g-input-number__helper">
      <span v-if="error" class="g-input-number__error">{{ error }}</span>
      <span v-else-if="hint" class="g-input-number__hint">{{ hint }}</span>
    </div>

    <!-- Min/Max bounds display -->
    <div v-if="showBounds" class="g-input-number__bounds">
      <span class="g-input-number__bound">{{ min }}</span>
      <span class="g-input-number__bound-separator">/</span>
      <span class="g-input-number__bound">{{ max }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'GInputNumber',
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: -Infinity
  },
  max: {
    type: Number,
    default: Infinity
  },
  step: {
    type: Number,
    default: 1
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
  unit: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'danger', 'warning', 'success'].includes(value)
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
  precision: {
    type: Number,
    default: null
  },
  showBounds: {
    type: Boolean,
    default: false
  },
  holdDelay: {
    type: Number,
    default: 400
  },
  holdInterval: {
    type: Number,
    default: 50
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])

// Refs
const inputRef = ref(null)
const isFocused = ref(false)
let holdTimer = null
let intervalTimer = null

// Unique ID
let idCounter = 0
const inputId = computed(() => `g-input-number-${++idCounter}`)

// Computed
const isAtMin = computed(() => props.modelValue <= props.min)
const isAtMax = computed(() => props.modelValue >= props.max)

const displayValue = computed(() => {
  if (props.precision !== null) {
    return props.modelValue.toFixed(props.precision)
  }
  return String(props.modelValue)
})

// Methods
const clamp = (value) => {
  return Math.min(Math.max(value, props.min), props.max)
}

const roundToStep = (value) => {
  if (props.step === 0) return value
  const steps = Math.round((value - props.min) / props.step)
  return props.min + steps * props.step
}

const setValue = (newValue) => {
  const clamped = clamp(newValue)
  const rounded = props.precision !== null
    ? parseFloat(clamped.toFixed(props.precision))
    : roundToStep(clamped)

  if (rounded !== props.modelValue) {
    emit('update:modelValue', rounded)
    emit('change', rounded)
  }
}

const increment = () => {
  if (props.disabled || props.readonly || isAtMax.value) return
  setValue(props.modelValue + props.step)
}

const decrement = () => {
  if (props.disabled || props.readonly || isAtMin.value) return
  setValue(props.modelValue - props.step)
}

const startIncrement = () => {
  increment()
  holdTimer = setTimeout(() => {
    intervalTimer = setInterval(increment, props.holdInterval)
  }, props.holdDelay)
}

const startDecrement = () => {
  decrement()
  holdTimer = setTimeout(() => {
    intervalTimer = setInterval(decrement, props.holdInterval)
  }, props.holdDelay)
}

const stopChange = () => {
  if (holdTimer) {
    clearTimeout(holdTimer)
    holdTimer = null
  }
  if (intervalTimer) {
    clearInterval(intervalTimer)
    intervalTimer = null
  }
}

const onInput = (e) => {
  const value = e.target.value

  // Allow empty, minus sign, or decimal point while typing
  if (value === '' || value === '-' || value === '.') {
    return
  }

  const parsed = parseFloat(value)
  if (!isNaN(parsed)) {
    setValue(parsed)
  }
}

const onFocus = (e) => {
  isFocused.value = true
  emit('focus', e)
}

const onBlur = (e) => {
  isFocused.value = false

  // Ensure value is valid on blur
  const parsed = parseFloat(e.target.value)
  if (isNaN(parsed)) {
    setValue(props.min > -Infinity ? props.min : 0)
  } else {
    setValue(parsed)
  }

  emit('blur', e)
}

const onKeydown = (e) => {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      increment()
      break
    case 'ArrowDown':
      e.preventDefault()
      decrement()
      break
    case 'Home':
      if (props.min > -Infinity) {
        e.preventDefault()
        setValue(props.min)
      }
      break
    case 'End':
      if (props.max < Infinity) {
        e.preventDefault()
        setValue(props.max)
      }
      break
  }
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

// Cleanup
onBeforeUnmount(() => {
  stopChange()
})

// Expose
defineExpose({
  focus,
  blur,
  increment,
  decrement,
  inputRef
})
</script>

<style scoped>
/* ============================================
   G-INPUT-NUMBER
   Space Horror UI Component
   ============================================ */

.g-input-number {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
  max-width: 12.5rem;
}

/* --------------------------------------------
   LABEL
   -------------------------------------------- */

.g-input-number__label {
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--num-label, #8892a2);
  cursor: pointer;
}

.g-input-number__required {
  color: #ff3344;
  margin-left: 0.125rem;
}

/* --------------------------------------------
   WRAPPER
   -------------------------------------------- */

.g-input-number__wrapper {
  position: relative;
  display: flex;
  align-items: stretch;

  background-color: var(--num-bg, #0f1218);
  border: 0.0625rem solid var(--num-border, #2a3444);

  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.g-input-number__wrapper:hover {
  background-color: var(--num-bg-hover, #161b24);
  border-color: var(--num-border-hover, #3a4a5e);
}

.g-input-number--focused .g-input-number__wrapper {
  border-color: var(--num-accent, #00d4d4);
  box-shadow: 0 0 0.75rem var(--num-glow, rgba(0, 212, 212, 0.15));
}

.g-input-number--error .g-input-number__wrapper {
  border-color: #ff3344;
  box-shadow: 0 0 0.75rem rgba(255, 51, 68, 0.15);
}

/* --------------------------------------------
   CORNER ACCENTS
   -------------------------------------------- */

.g-input-number__corner {
  position: absolute;
  width: 0.375rem;
  height: 0.375rem;
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.g-input-number__corner::before,
.g-input-number__corner::after {
  content: '';
  position: absolute;
  background-color: var(--num-accent, #00d4d4);
}

.g-input-number__corner--tl {
  top: -0.0625rem;
  left: -0.0625rem;
}
.g-input-number__corner--tl::before {
  top: 0;
  left: 0;
  width: 0.375rem;
  height: 0.0625rem;
}
.g-input-number__corner--tl::after {
  top: 0;
  left: 0;
  width: 0.0625rem;
  height: 0.375rem;
}

.g-input-number__corner--br {
  bottom: -0.0625rem;
  right: -0.0625rem;
}
.g-input-number__corner--br::before {
  bottom: 0;
  right: 0;
  width: 0.375rem;
  height: 0.0625rem;
}
.g-input-number__corner--br::after {
  bottom: 0;
  right: 0;
  width: 0.0625rem;
  height: 0.375rem;
}

.g-input-number--focused .g-input-number__corner {
  opacity: 1;
}

/* --------------------------------------------
   BUTTONS
   -------------------------------------------- */

.g-input-number__btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background-color: var(--num-btn-bg, #161b24);
  border: none;
  color: var(--num-btn-color, #8892a2);
  cursor: pointer;
  overflow: hidden;

  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.g-input-number__btn:hover:not(:disabled) {
  background-color: var(--num-btn-bg-hover, #1c232e);
  color: var(--num-accent, #00d4d4);
}

.g-input-number__btn:active:not(:disabled) {
  background-color: var(--num-btn-bg-active, #252d3a);
}

.g-input-number__btn:disabled {
  color: var(--num-btn-disabled, #2a3444);
  cursor: not-allowed;
}

.g-input-number__btn svg {
  position: relative;
  z-index: 1;
}

/* Button glow effect */
.g-input-number__btn-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    var(--num-glow, rgba(0, 212, 212, 0.2)) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
}

.g-input-number__btn:hover:not(:disabled) .g-input-number__btn-glow {
  opacity: 1;
}

/* Decrement button */
.g-input-number__btn--decrement {
  border-right: 0.0625rem solid var(--num-border, #2a3444);
}

/* Increment button */
.g-input-number__btn--increment {
  border-left: 0.0625rem solid var(--num-border, #2a3444);
}

/* --------------------------------------------
   FIELD WRAPPER
   -------------------------------------------- */

.g-input-number__field-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  overflow: hidden;
}

/* --------------------------------------------
   FIELD
   -------------------------------------------- */

.g-input-number__field {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  text-align: center;

  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: var(--num-color, #e0e4ea);

  transition: color 0.15s ease;
}

.g-input-number__field::placeholder {
  color: var(--num-placeholder, #505868);
}

/* Hide native spin buttons */
.g-input-number__field::-webkit-outer-spin-button,
.g-input-number__field::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.g-input-number__field[type='number'] {
  -moz-appearance: textfield;
}

/* --------------------------------------------
   UNIT
   -------------------------------------------- */

.g-input-number__unit {
  position: absolute;
  right: 0.5rem;
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 0.625rem;
  color: var(--num-unit, #505868);
  pointer-events: none;
  text-transform: uppercase;
}

/* --------------------------------------------
   SCANLINE
   -------------------------------------------- */

.g-input-number__scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.125rem;
  background: linear-gradient(
    90deg,
    transparent,
    var(--num-accent, #00d4d4),
    transparent
  );
  opacity: 0;
  transform: translateY(-100%);
  pointer-events: none;
}

.g-input-number--focused .g-input-number__scanline {
  opacity: 0.5;
  animation: g-input-number-scanline 2s ease-in-out infinite;
}

@keyframes g-input-number-scanline {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  10% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(calc(100% + 2.5rem));
    opacity: 0;
  }
}

/* --------------------------------------------
   HELPER TEXT
   -------------------------------------------- */

.g-input-number__helper {
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-size: 0.6875rem;
  font-weight: 500;
}

.g-input-number__hint {
  color: #505868;
}

.g-input-number__error {
  color: #ff3344;
}

/* --------------------------------------------
   BOUNDS DISPLAY
   -------------------------------------------- */

.g-input-number__bounds {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 0.5625rem;
  color: var(--num-bounds, #505868);
}

.g-input-number__bound-separator {
  color: var(--num-border, #2a3444);
}

.g-input-number--at-min .g-input-number__bounds .g-input-number__bound:first-child,
.g-input-number--at-max .g-input-number__bounds .g-input-number__bound:last-child {
  color: var(--num-accent, #00d4d4);
}

/* --------------------------------------------
   SIZES
   -------------------------------------------- */

/* Small */
.g-input-number--small .g-input-number__wrapper {
  height: 1.75rem;
}

.g-input-number--small .g-input-number__btn {
  width: 1.75rem;
}

.g-input-number--small .g-input-number__btn svg {
  width: 0.75rem;
  height: 0.75rem;
}

.g-input-number--small .g-input-number__field {
  padding: 0.25rem 0.5rem;
  font-size: 0.6875rem;
}

.g-input-number--small .g-input-number__unit {
  font-size: 0.5625rem;
}

/* Medium */
.g-input-number--medium .g-input-number__wrapper {
  height: 2.25rem;
}

.g-input-number--medium .g-input-number__btn {
  width: 2.25rem;
}

.g-input-number--medium .g-input-number__btn svg {
  width: 0.875rem;
  height: 0.875rem;
}

.g-input-number--medium .g-input-number__field {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

/* Large */
.g-input-number--large .g-input-number__wrapper {
  height: 2.75rem;
}

.g-input-number--large .g-input-number__btn {
  width: 2.75rem;
}

.g-input-number--large .g-input-number__btn svg {
  width: 1rem;
  height: 1rem;
}

.g-input-number--large .g-input-number__field {
  padding: 0.5rem 0.875rem;
  font-size: 1rem;
}

.g-input-number--large .g-input-number__unit {
  font-size: 0.6875rem;
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Default (Cyan) */
.g-input-number--default {
  --num-bg: #0f1218;
  --num-bg-hover: #161b24;
  --num-color: #e0e4ea;
  --num-border: #2a3444;
  --num-border-hover: #3a4a5e;
  --num-accent: #00d4d4;
  --num-glow: rgba(0, 212, 212, 0.15);
  --num-label: #8892a2;
  --num-placeholder: #505868;
  --num-unit: #505868;
  --num-bounds: #505868;
  --num-btn-bg: #161b24;
  --num-btn-bg-hover: #1c232e;
  --num-btn-bg-active: #252d3a;
  --num-btn-color: #8892a2;
  --num-btn-disabled: #2a3444;
}

/* Primary (Strong Cyan) */
.g-input-number--primary {
  --num-bg: rgba(0, 212, 212, 0.05);
  --num-bg-hover: rgba(0, 212, 212, 0.08);
  --num-color: #00d4d4;
  --num-border: rgba(0, 212, 212, 0.3);
  --num-border-hover: rgba(0, 212, 212, 0.5);
  --num-accent: #00d4d4;
  --num-glow: rgba(0, 212, 212, 0.2);
  --num-label: #00d4d4;
  --num-placeholder: #007070;
  --num-unit: #00a0a0;
  --num-bounds: #007070;
  --num-btn-bg: rgba(0, 212, 212, 0.1);
  --num-btn-bg-hover: rgba(0, 212, 212, 0.15);
  --num-btn-bg-active: rgba(0, 212, 212, 0.25);
  --num-btn-color: #00a0a0;
  --num-btn-disabled: rgba(0, 212, 212, 0.2);
}

/* Danger (Red - Critical) */
.g-input-number--danger {
  --num-bg: rgba(255, 51, 68, 0.05);
  --num-bg-hover: rgba(255, 51, 68, 0.08);
  --num-color: #ff3344;
  --num-border: rgba(255, 51, 68, 0.3);
  --num-border-hover: rgba(255, 51, 68, 0.5);
  --num-accent: #ff3344;
  --num-glow: rgba(255, 51, 68, 0.2);
  --num-label: #ff3344;
  --num-placeholder: #992233;
  --num-unit: #cc2936;
  --num-bounds: #992233;
  --num-btn-bg: rgba(255, 51, 68, 0.1);
  --num-btn-bg-hover: rgba(255, 51, 68, 0.15);
  --num-btn-bg-active: rgba(255, 51, 68, 0.25);
  --num-btn-color: #cc2936;
  --num-btn-disabled: rgba(255, 51, 68, 0.2);
}

/* Warning (Orange - Caution) */
.g-input-number--warning {
  --num-bg: rgba(255, 153, 34, 0.05);
  --num-bg-hover: rgba(255, 153, 34, 0.08);
  --num-color: #ff9922;
  --num-border: rgba(255, 153, 34, 0.3);
  --num-border-hover: rgba(255, 153, 34, 0.5);
  --num-accent: #ff9922;
  --num-glow: rgba(255, 153, 34, 0.2);
  --num-label: #ff9922;
  --num-placeholder: #996611;
  --num-unit: #cc7a1b;
  --num-bounds: #996611;
  --num-btn-bg: rgba(255, 153, 34, 0.1);
  --num-btn-bg-hover: rgba(255, 153, 34, 0.15);
  --num-btn-bg-active: rgba(255, 153, 34, 0.25);
  --num-btn-color: #cc7a1b;
  --num-btn-disabled: rgba(255, 153, 34, 0.2);
}

/* Success (Green - Systems Online) */
.g-input-number--success {
  --num-bg: rgba(0, 204, 102, 0.05);
  --num-bg-hover: rgba(0, 204, 102, 0.08);
  --num-color: #00cc66;
  --num-border: rgba(0, 204, 102, 0.3);
  --num-border-hover: rgba(0, 204, 102, 0.5);
  --num-accent: #00cc66;
  --num-glow: rgba(0, 204, 102, 0.2);
  --num-label: #00cc66;
  --num-placeholder: #007744;
  --num-unit: #00994d;
  --num-bounds: #007744;
  --num-btn-bg: rgba(0, 204, 102, 0.1);
  --num-btn-bg-hover: rgba(0, 204, 102, 0.15);
  --num-btn-bg-active: rgba(0, 204, 102, 0.25);
  --num-btn-color: #00994d;
  --num-btn-disabled: rgba(0, 204, 102, 0.2);
}

/* --------------------------------------------
   DISABLED & READONLY
   -------------------------------------------- */

.g-input-number--disabled {
  pointer-events: none;
}

.g-input-number--disabled .g-input-number__wrapper {
  --num-bg: rgba(80, 88, 104, 0.05);
  --num-border: rgba(80, 88, 104, 0.15);
}

.g-input-number--disabled .g-input-number__field {
  color: #505868;
}

.g-input-number--disabled .g-input-number__label {
  color: #505868;
}

.g-input-number--disabled .g-input-number__btn {
  --num-btn-bg: rgba(80, 88, 104, 0.05);
}

.g-input-number--disabled .g-input-number__corner {
  display: none;
}

.g-input-number--readonly .g-input-number__field {
  cursor: default;
}

.g-input-number--readonly .g-input-number__btn {
  cursor: default;
}

/* --------------------------------------------
   AT MIN/MAX STATES
   -------------------------------------------- */

.g-input-number--at-min .g-input-number__btn--decrement,
.g-input-number--at-max .g-input-number__btn--increment {
  color: var(--num-btn-disabled, #2a3444);
}

/* Pulse effect when at limits */
.g-input-number--at-min .g-input-number__field,
.g-input-number--at-max .g-input-number__field {
  animation: g-input-number-limit-pulse 2s ease-in-out infinite;
}

@keyframes g-input-number-limit-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
