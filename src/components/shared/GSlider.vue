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

<style scoped>
/* ============================================
   G-SLIDER
   Space Horror UI Component
   ============================================ */

.g-slider {
  position: relative;
  width: 100%;
  max-width: 20rem;
}

/* --------------------------------------------
   HEADER
   -------------------------------------------- */

.g-slider__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.g-slider__label {
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--slider-label, #8892a2);
}

.g-slider__value {
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--slider-value, #00d4d4);
  min-width: 2.5rem;
  text-align: right;
}

.g-slider--dragging .g-slider__value {
  color: var(--slider-accent, #00d4d4);
  text-shadow: 0 0 0.5rem var(--slider-glow, rgba(0, 212, 212, 0.5));
}

/* --------------------------------------------
   TRACK CONTAINER
   -------------------------------------------- */

.g-slider__track-container {
  position: relative;
  cursor: pointer;
  touch-action: none;
}

/* --------------------------------------------
   TRACK
   -------------------------------------------- */

.g-slider__track {
  position: relative;
  width: 100%;
  background-color: var(--slider-track-bg, #161b24);
  border: 0.0625rem solid var(--slider-border, #2a3444);
  overflow: hidden;
}

.g-slider:hover .g-slider__track {
  border-color: var(--slider-border-hover, #3a4a5e);
}

.g-slider--dragging .g-slider__track {
  border-color: var(--slider-accent, #00d4d4);
  box-shadow: 0 0 0.75rem var(--slider-glow, rgba(0, 212, 212, 0.2));
}

/* --------------------------------------------
   TICKS
   -------------------------------------------- */

.g-slider__ticks {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.375rem;
  pointer-events: none;
}

.g-slider__tick {
  width: 0.0625rem;
  height: 40%;
  background-color: var(--slider-tick, #2a3444);
  transition: background-color 0.15s ease;
}

.g-slider__tick--active {
  background-color: var(--slider-tick-active, rgba(0, 212, 212, 0.5));
}

/* --------------------------------------------
   FILL
   -------------------------------------------- */

.g-slider__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--slider-fill-start, rgba(0, 212, 212, 0.2)),
    var(--slider-fill-end, rgba(0, 212, 212, 0.4))
  );
  transition: width 0.05s ease;
}

.g-slider__fill-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 1.25rem;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--slider-accent, #00d4d4)
  );
  opacity: 0.5;
}

/* --------------------------------------------
   THUMB
   -------------------------------------------- */

.g-slider__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: left 0.05s ease;
}

.g-slider__thumb-inner {
  width: 0.75rem;
  height: 100%;
  background-color: var(--slider-thumb-bg, #2a3444);
  border: 0.0625rem solid var(--slider-thumb-border, #3a4a5e);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.g-slider:hover .g-slider__thumb-inner {
  border-color: var(--slider-accent, #00d4d4);
}

.g-slider--dragging .g-slider__thumb-inner {
  background-color: var(--slider-accent, #00d4d4);
  border-color: var(--slider-accent, #00d4d4);
  box-shadow: 0 0 0.75rem var(--slider-glow, rgba(0, 212, 212, 0.5));
}

.g-slider__thumb-ring {
  position: absolute;
  inset: -0.25rem;
  border: 0.0625rem solid var(--slider-accent, #00d4d4);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.g-slider--dragging .g-slider__thumb-ring {
  opacity: 0.3;
  animation: g-slider-pulse 1s ease-out infinite;
}

@keyframes g-slider-pulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* --------------------------------------------
   BOUNDS
   -------------------------------------------- */

.g-slider__bounds {
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
}

.g-slider__min,
.g-slider__max {
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 0.5625rem;
  color: var(--slider-bounds, #505868);
}

/* --------------------------------------------
   SIZES
   -------------------------------------------- */

/* Small */
.g-slider--small .g-slider__track {
  height: 1rem;
}

.g-slider--small .g-slider__thumb-inner {
  width: 0.5rem;
  height: 1.375rem;
}

.g-slider--small .g-slider__label {
  font-size: 0.625rem;
}

.g-slider--small .g-slider__value {
  font-size: 0.625rem;
}

/* Medium */
.g-slider--medium .g-slider__track {
  height: 1.5rem;
}

.g-slider--medium .g-slider__thumb-inner {
  width: 0.75rem;
  height: 2rem;
}

/* Large */
.g-slider--large .g-slider__track {
  height: 2rem;
}

.g-slider--large .g-slider__thumb-inner {
  width: 1rem;
  height: 2.625rem;
}

.g-slider--large .g-slider__label {
  font-size: 0.75rem;
}

.g-slider--large .g-slider__value {
  font-size: 0.875rem;
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Default */
.g-slider--default {
  --slider-label: #8892a2;
  --slider-value: #00d4d4;
  --slider-track-bg: #161b24;
  --slider-border: #2a3444;
  --slider-border-hover: #3a4a5e;
  --slider-fill-start: rgba(0, 212, 212, 0.15);
  --slider-fill-end: rgba(0, 212, 212, 0.3);
  --slider-accent: #00d4d4;
  --slider-glow: rgba(0, 212, 212, 0.3);
  --slider-thumb-bg: #2a3444;
  --slider-thumb-border: #3a4a5e;
  --slider-tick: #2a3444;
  --slider-tick-active: rgba(0, 212, 212, 0.5);
  --slider-bounds: #505868;
}

/* Primary */
.g-slider--primary {
  --slider-label: #00a0a0;
  --slider-value: #00d4d4;
  --slider-track-bg: rgba(0, 212, 212, 0.05);
  --slider-border: rgba(0, 212, 212, 0.3);
  --slider-border-hover: rgba(0, 212, 212, 0.5);
  --slider-fill-start: rgba(0, 212, 212, 0.2);
  --slider-fill-end: rgba(0, 212, 212, 0.4);
  --slider-accent: #00d4d4;
  --slider-glow: rgba(0, 212, 212, 0.4);
  --slider-thumb-bg: #007070;
  --slider-thumb-border: #00a0a0;
  --slider-tick: rgba(0, 212, 212, 0.2);
  --slider-tick-active: #00d4d4;
  --slider-bounds: #007070;
}

/* Danger */
.g-slider--danger {
  --slider-label: #cc2936;
  --slider-value: #ff3344;
  --slider-track-bg: rgba(255, 51, 68, 0.05);
  --slider-border: rgba(255, 51, 68, 0.3);
  --slider-border-hover: rgba(255, 51, 68, 0.5);
  --slider-fill-start: rgba(255, 51, 68, 0.2);
  --slider-fill-end: rgba(255, 51, 68, 0.4);
  --slider-accent: #ff3344;
  --slider-glow: rgba(255, 51, 68, 0.4);
  --slider-thumb-bg: #992233;
  --slider-thumb-border: #cc2936;
  --slider-tick: rgba(255, 51, 68, 0.2);
  --slider-tick-active: #ff3344;
  --slider-bounds: #992233;
}

/* Warning */
.g-slider--warning {
  --slider-label: #cc7a1b;
  --slider-value: #ff9922;
  --slider-track-bg: rgba(255, 153, 34, 0.05);
  --slider-border: rgba(255, 153, 34, 0.3);
  --slider-border-hover: rgba(255, 153, 34, 0.5);
  --slider-fill-start: rgba(255, 153, 34, 0.2);
  --slider-fill-end: rgba(255, 153, 34, 0.4);
  --slider-accent: #ff9922;
  --slider-glow: rgba(255, 153, 34, 0.4);
  --slider-thumb-bg: #996611;
  --slider-thumb-border: #cc7a1b;
  --slider-tick: rgba(255, 153, 34, 0.2);
  --slider-tick-active: #ff9922;
  --slider-bounds: #996611;
}

/* Success */
.g-slider--success {
  --slider-label: #00994d;
  --slider-value: #00cc66;
  --slider-track-bg: rgba(0, 204, 102, 0.05);
  --slider-border: rgba(0, 204, 102, 0.3);
  --slider-border-hover: rgba(0, 204, 102, 0.5);
  --slider-fill-start: rgba(0, 204, 102, 0.2);
  --slider-fill-end: rgba(0, 204, 102, 0.4);
  --slider-accent: #00cc66;
  --slider-glow: rgba(0, 204, 102, 0.4);
  --slider-thumb-bg: #007744;
  --slider-thumb-border: #00994d;
  --slider-tick: rgba(0, 204, 102, 0.2);
  --slider-tick-active: #00cc66;
  --slider-bounds: #007744;
}

/* --------------------------------------------
   DISABLED
   -------------------------------------------- */

.g-slider--disabled {
  pointer-events: none;
  opacity: 0.5;
}

.g-slider--disabled .g-slider__track {
  --slider-track-bg: rgba(80, 88, 104, 0.05);
  --slider-border: rgba(80, 88, 104, 0.2);
}

.g-slider--disabled .g-slider__fill {
  --slider-fill-start: rgba(80, 88, 104, 0.1);
  --slider-fill-end: rgba(80, 88, 104, 0.2);
}

.g-slider--disabled .g-slider__thumb-inner {
  --slider-thumb-bg: #1c232e;
  --slider-thumb-border: #2a3444;
}

.g-slider--disabled .g-slider__value {
  color: #505868;
}
</style>
