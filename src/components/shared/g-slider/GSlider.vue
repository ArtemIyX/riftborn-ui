<template>
  <div
    class="g-slider"
    :class="[
      `g-slider--${variant}`,
      `g-slider--${size}`,
      {
        'g-slider--disabled': disabled,
        'g-slider--dragging': isDragging
      }
    ]"
  >
    <!-- Label -->
    <div v-if="$slots.label || label || showValue" class="g-slider__header">
      <label v-if="$slots.label || label" class="g-slider__label">
        <slot name="label">{{ label }}</slot>
      </label>
      <span v-if="showValue && !editable" class="g-slider__value">
        {{ formattedValue }}{{ suffix }}
      </span>
      <div>
        <GInput size="small"
                v-if="showValue && editable"
                ref="inputRef"
                v-model="inputValue"
                type="number"
                class="g-slider__input"
                :min="numMin"
                :max="numMax"
                :step="numStep"
                :disabled="disabled"
                @input="onInputChange"
                @blur="onInputBlur"
                @keydown.enter="onInputEnter"/>
      </div>

    </div>

    <!-- Track container -->
    <div
      ref="trackRef"
      class="g-slider__track-container"
      @mousedown="onMouseDown"
      @touchstart.prevent="onTouchStart"
    >
      <!-- Track background -->
      <div class="g-slider__track">
        <!-- Tick marks -->
        <div v-if="showTicks" class="g-slider__ticks">
          <span
            v-for="tick in tickCount"
            :key="tick"
            class="g-slider__tick"
            :class="{ 'g-slider__tick--active': getTickPercent(tick) <= percent }"
          ></span>
        </div>

        <!-- Fill -->
        <div
          class="g-slider__fill"
          :style="{ width: `${percent}%` }"
        >
          <span class="g-slider__fill-glow"></span>
        </div>

        <!-- Thumb -->
        <div
          class="g-slider__thumb"
          :style="{ left: `${percent}%` }"
        >
          <span class="g-slider__thumb-inner"></span>
          <span class="g-slider__thumb-ring"></span>
        </div>
      </div>

      <!-- Min/Max labels -->
      <div v-if="showMinMax" class="g-slider__bounds">
        <span class="g-slider__min">{{ numMin }}{{ suffix }}</span>
        <span class="g-slider__max">{{ numMax }}{{ suffix }}</span>
      </div>
    </div>

    <!-- Hidden input for form compatibility -->
    <input
      type="hidden"
      :value="modelValue"
      :name="name"
    />
  </div>
</template>

<script setup>
import {ref, computed, watch, onBeforeUnmount} from 'vue'

defineOptions({
  name: 'GSlider'
})

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: [Number, String],
    default: 0
  },
  max: {
    type: [Number, String],
    default: 100
  },
  step: {
    type: [Number, String],
    default: 1
  },
  label: {
    type: String,
    default: ''
  },
  name: {
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
  showValue: {
    type: Boolean,
    default: true
  },
  showMinMax: {
    type: Boolean,
    default: false
  },
  showTicks: {
    type: Boolean,
    default: false
  },
  tickCount: {
    type: Number,
    default: 10
  },
  editable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'dragStart', 'dragEnd'])

// Refs
const trackRef = ref(null)
const inputRef = ref(null)
const isDragging = ref(false)
const inputValue = ref(props.modelValue)

// Convert string props to numbers
const numMin = computed(() => Number(props.min))
const numMax = computed(() => Number(props.max))
const numStep = computed(() => Number(props.step))

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue
})

// Computed
const percent = computed(() => {
  const range = numMax.value - numMin.value
  if (range === 0) return 0
  return ((props.modelValue - numMin.value) / range) * 100
})

const formattedValue = computed(() => {
  if (Number.isInteger(numStep.value)) {
    return Math.round(props.modelValue)
  }
  const decimals = numStep.value.toString().split('.')[1]?.length || 0
  return props.modelValue.toFixed(decimals)
})

// Methods
const getTickPercent = (tickIndex) => {
  return ((tickIndex - 1) / (props.tickCount - 1)) * 100
}

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

const roundToStep = (value) => {
  const steps = Math.round((value - numMin.value) / numStep.value)
  const roundedValue = numMin.value + (steps * numStep.value)
  return clamp(roundedValue, numMin.value, numMax.value)
}

const getValueFromPosition = (clientX) => {
  if (!trackRef.value) return props.modelValue

  const rect = trackRef.value.getBoundingClientRect()
  const percent = clamp((clientX - rect.left) / rect.width, 0, 1)
  const rawValue = numMin.value + (percent * (numMax.value - numMin.value))

  return roundToStep(rawValue)
}

const updateValue = (clientX) => {
  if (props.disabled) return

  const newValue = getValueFromPosition(clientX)
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
  }
}

// Input events
const onInputChange = (e) => {
  const value = parseFloat(e.target.value)
  if (!isNaN(value)) {
    const clampedValue = clamp(value, numMin.value, numMax.value)
    const roundedValue = roundToStep(clampedValue)
    inputValue.value = roundedValue
    emit('update:modelValue', roundedValue)
  }
}

const onInputBlur = () => {
  // Ensure the input shows the current model value on blur
  inputValue.value = props.modelValue
  emit('change', props.modelValue)
}

const onInputEnter = (e) => {
  e.target.blur()
}

// Mouse events
const onMouseDown = (e) => {
  if (props.disabled) return

  isDragging.value = true
  updateValue(e.clientX)
  emit('dragStart')

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e) => {
  updateValue(e.clientX)
}

const onMouseUp = () => {
  isDragging.value = false
  emit('dragEnd')
  emit('change', props.modelValue)

  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

// Touch events
const onTouchStart = (e) => {
  if (props.disabled) return

  isDragging.value = true
  updateValue(e.touches[0].clientX)
  emit('dragStart')

  document.addEventListener('touchmove', onTouchMove)
  document.addEventListener('touchend', onTouchEnd)
}

const onTouchMove = (e) => {
  updateValue(e.touches[0].clientX)
}

const onTouchEnd = () => {
  isDragging.value = false
  emit('dragEnd')
  emit('change', props.modelValue)

  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
}

// Cleanup
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
})

// Expose
defineExpose({
  trackRef,
  inputRef
})
</script>

<style src="./GSlider.css" scoped/>
