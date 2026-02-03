<template>
  <div
    class="g-progress"
    :class="[
      `g-progress--${variant}`,
      `g-progress--${size}`,
      {
        'g-progress--striped': striped,
        'g-progress--animated': animated,
        'g-progress--indeterminate': indeterminate
      }
    ]"
  >
    <!-- Label -->
    <div v-if="label || showValue" class="g-progress__header">
      <span v-if="label" class="g-progress__label">{{ label }}</span>
      <span v-if="showValue && !indeterminate" class="g-progress__value">
        {{ displayValue }}{{ suffix }}
      </span>
    </div>

    <!-- Track -->
    <div class="g-progress__track">
      <!-- Segments (optional) -->
      <div v-if="segments > 0" class="g-progress__segments">
        <span
          v-for="seg in segments"
          :key="seg"
          class="g-progress__segment"
        ></span>
      </div>

      <!-- Fill -->
      <div
        class="g-progress__fill"
        :style="fillStyle"
      >
        <span class="g-progress__fill-glow"></span>
        <span v-if="striped" class="g-progress__stripes"></span>
      </div>

      <!-- Indeterminate bar -->
      <div v-if="indeterminate" class="g-progress__indeterminate"></div>

      <!-- Threshold marker -->
      <div
        v-if="threshold !== null && !indeterminate"
        class="g-progress__threshold"
        :style="{ left: `${threshold}%` }"
      >
        <span class="g-progress__threshold-line"></span>
      </div>
    </div>

    <!-- Status text -->
    <div v-if="status" class="g-progress__status">{{ status }}</div>
  </div>
</template>

<script setup>
import {computed} from 'vue'

defineOptions({
  name: 'GProgress'
})

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  label: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: '%'
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'danger', 'warning', 'success', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  showValue: {
    type: Boolean,
    default: false
  },
  striped: {
    type: Boolean,
    default: false
  },
  animated: {
    type: Boolean,
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  segments: {
    type: Number,
    default: 0
  },
  threshold: {
    type: Number,
    default: null
  }
})

// Computed
const percent = computed(() => {
  if (props.max === 0) return 0
  return Math.min(Math.max((props.value / props.max) * 100, 0), 100)
})

const displayValue = computed(() => {
  if (props.suffix === '%') {
    return Math.round(percent.value)
  }
  return props.value
})

const fillStyle = computed(() => {
  if (props.indeterminate) return {}
  return {
    width: `${percent.value}%`
  }
})
</script>

<style src="./GProgress.css" scoped/>
