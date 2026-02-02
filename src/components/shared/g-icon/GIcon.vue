<template>
  <svg
    class="g-icon"
    :class="[
      `g-icon--${size}`,
      `g-icon--${variant}`,
      {
        'g-icon--spinning': spinning,
        'g-icon--pulse': pulse,
        'g-icon--glow': glow,
        'g-icon--flip-h': flipH,
        'g-icon--flip-v': flipV,
        'g-icon--interactive': interactive
      }
    ]"
    :style="iconStyle"
    :viewBox="viewBox"
    :width="computedWidth"
    :height="computedHeight"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :role="role"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
  >
    <!-- Single path -->
    <path
      v-if="path && !paths"
      :d="path"
      :fill="fillComputed"
      :stroke="strokeComputed"
      :stroke-width="strokeWidth"
      :stroke-linecap="strokeLinecap"
      :stroke-linejoin="strokeLinejoin"
    />

    <!-- Multiple paths -->
    <path
      v-for="(pathData, index) in paths"
      :key="index"
      :d="pathData"
      :fill="fillComputed"
      :stroke="strokeComputed"
      :stroke-width="strokeWidth"
      :stroke-linecap="strokeLinecap"
      :stroke-linejoin="strokeLinejoin"
    />

    <!-- Slot for custom SVG content -->
    <slot></slot>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'GIcon',
  inheritAttrs: false
})

const props = defineProps({
  // Icon content
  path: {
    type: String,
    default: ''
  },
  paths: {
    type: Array,
    default: null
  },

  // SVG attributes
  viewBox: {
    type: String,
    default: '0 0 24 24'
  },
  width: {
    type: [String, Number],
    default: null
  },
  height: {
    type: [String, Number],
    default: null
  },

  // Styling
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['tiny', 'small', 'medium', 'large', 'huge', 'custom'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => [
      'default',
      'primary',
      'secondary',
      'danger',
      'warning',
      'success',
      'info',
      'muted',
      'inverse'
    ].includes(value)
  },
  color: {
    type: String,
    default: null
  },

  // Path attributes
  fill: {
    type: String,
    default: 'currentColor'
  },
  stroke: {
    type: String,
    default: 'none'
  },
  strokeWidth: {
    type: [String, Number],
    default: 0
  },
  strokeLinecap: {
    type: String,
    default: 'round'
  },
  strokeLinejoin: {
    type: String,
    default: 'round'
  },

  // Effects
  spinning: {
    type: Boolean,
    default: false
  },
  pulse: {
    type: Boolean,
    default: false
  },
  glow: {
    type: Boolean,
    default: false
  },
  flipH: {
    type: Boolean,
    default: false
  },
  flipV: {
    type: Boolean,
    default: false
  },
  rotate: {
    type: [String, Number],
    default: null
  },
  interactive: {
    type: Boolean,
    default: false
  },

  // Accessibility
  ariaLabel: {
    type: String,
    default: null
  },
  ariaHidden: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'img'
  }
})

// Computed
const iconStyle = computed(() => {
  const style = {}

  if (props.color) {
    style.color = props.color
  }

  if (props.rotate !== null) {
    const rotation = typeof props.rotate === 'number' ? `${props.rotate}deg` : props.rotate
    style.transform = `rotate(${rotation})`
  }

  return style
})

const computedWidth = computed(() => {
  if (props.width !== null) {
    return typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  return undefined
})

const computedHeight = computed(() => {
  if (props.height !== null) {
    return typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  return undefined
})

const fillComputed = computed(() => {
  return props.fill
})

const strokeComputed = computed(() => {
  return props.stroke
})
</script>

<style src="./GIcon.css" scoped/>
