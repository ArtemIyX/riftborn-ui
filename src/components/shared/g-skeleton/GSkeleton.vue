<template>
  <div
    class="g-skeleton"
    :class="[
      `g-skeleton--${variant}`,
      `g-skeleton--${animation}`,
      {
        'g-skeleton--rounded': rounded,
        'g-skeleton--loading': loading
      }
    ]"
    :style="skeletonStyle"
  >
    <!-- Scan line effect -->
    <span v-if="animation === 'pulse' || animation === 'scan'" class="g-skeleton__scan"></span>

    <!-- Shimmer effect -->
    <span v-if="animation === 'shimmer'" class="g-skeleton__shimmer"></span>

    <!-- Wave effect -->
    <span v-if="animation === 'wave'" class="g-skeleton__wave"></span>

    <!-- Glitch effect -->
    <span v-if="animation === 'glitch'" class="g-skeleton__glitch"></span>

    <!-- Corner accents for rectangular variants -->
    <span v-if="showCorners" class="g-skeleton__corner g-skeleton__corner--tl"></span>
    <span v-if="showCorners" class="g-skeleton__corner g-skeleton__corner--tr"></span>
    <span v-if="showCorners" class="g-skeleton__corner g-skeleton__corner--bl"></span>
    <span v-if="showCorners" class="g-skeleton__corner g-skeleton__corner--br"></span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'GSkeleton'
})

const props = defineProps({
  variant: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'circle', 'rect', 'avatar', 'button', 'card', 'image'].includes(value)
  },
  animation: {
    type: String,
    default: 'pulse',
    validator: (value) => ['pulse', 'wave', 'shimmer', 'scan', 'glitch', 'none'].includes(value)
  },
  width: {
    type: [String, Number],
    default: null
  },
  height: {
    type: [String, Number],
    default: null
  },
  rounded: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: true
  },
  showCorners: {
    type: Boolean,
    default: false
  },
  aspectRatio: {
    type: String,
    default: null
  }
})

// Computed
const skeletonStyle = computed(() => {
  const style = {}

  if (props.width !== null) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  if (props.height !== null) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  if (props.aspectRatio) {
    style.aspectRatio = props.aspectRatio
  }

  return style
})
</script>

<style src="./GSkeleton.css" scoped/>
