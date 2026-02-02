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
    <div v-if="label || showValue" class="g-slider__header">
      <label v-if="label" class="g-slider__label">{{ label }}</label>
      <span v-if="showValue" class="g-slider__value">
        {{ formattedValue }}{{ suffix }}
      </span>
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
        <span class="g-slider__min">{{ min }}{{ suffix }}</span>
        <span class="g-slider__max">{{ max }}{{ suffix }}</span>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'GSlider'
})

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
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
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'dragStart', 'dragEnd'])

// Refs
const trackRef = ref(null)
const isDragging = ref(false)

// Computed
const percent = computed(() => {
  const range = props.max - props.min
  if (range === 0) return 0
  return ((props.modelValue - props.min) / range) * 100
})

const formattedValue = computed(() => {
  if (Number.isInteger(props.step)) {
    return Math.round(props.modelValue)
  }
  const decimals = props.step.toString().split('.')[1]?.length || 0
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
  const steps = Math.round((value - props.min) / props.step)
  return clamp(props.min + steps * props.step, props.min, props.max)
}

const getValueFromPosition = (clientX) => {
  if (!trackRef.value) return props.modelValue

  const rect = trackRef.value.getBoundingClientRect()
  const percent = clamp((clientX - rect.left) / rect.width, 0, 1)
  const rawValue = props.min + percent * (props.max - props.min)

  return roundToStep(rawValue)
}

const updateValue = (clientX) => {
  if (props.disabled) return

  const newValue = getValueFromPosition(clientX)
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
  }
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
  trackRef
})
</script>

<style src="./GSlider.css" scoped/>

