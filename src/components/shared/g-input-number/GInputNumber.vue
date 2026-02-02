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
import {ref, computed, onBeforeUnmount} from 'vue'

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

<style src="./GInputNumber.css" scoped/>

