<template>
  <component
    :is="tag"
    class="g-heading"
    :class="[
      `g-heading--${level}`,
      `g-heading--${variant}`,
      `g-heading--${align}`,
      {
        'g-heading--truncate': truncate,
        'g-heading--underline': underline,
        'g-heading--glow': glow,
        'g-heading--scanline': scanline,
        'g-heading--line-left': decorativeLine === 'left',
        'g-heading--line-right': decorativeLine === 'right',
        'g-heading--line-both': decorativeLine === 'both'
      }
    ]"
  >
    <!-- Left bracket -->
    <span v-if="brackets" class="g-heading__bracket g-heading__bracket--left"></span>

    <!-- Status indicator -->
    <span v-if="showStatus" class="g-heading__status"></span>

    <!-- Icon -->
    <span v-if="$slots.icon || icon" class="g-heading__icon">
      <slot name="icon">
        <component :is="icon" v-if="typeof icon === 'object'" />
      </slot>
    </span>

    <!-- Content wrapper -->
    <span class="g-heading__content">
      <span class="g-heading__text">
        <slot>{{ text }}</slot>
        <span v-if="glow" class="g-heading__text-glow">
          <slot>{{ text }}</slot>
        </span>
      </span>

      <!-- Badge/Tag -->
      <span v-if="badge" class="g-heading__badge">{{ badge }}</span>
    </span>

    <!-- Decorative line -->
    <span
      v-if="decorativeLine && (decorativeLine === 'right' || decorativeLine === 'both')"
      class="g-heading__line"
    >
      <span class="g-heading__line-glow"></span>
    </span>

    <!-- Right bracket -->
    <span v-if="brackets" class="g-heading__bracket g-heading__bracket--right"></span>

    <!-- Scanline effect -->
    <span v-if="scanline" class="g-heading__scanline"></span>
  </component>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'GHeading'
})

const props = defineProps({
  // Content
  text: {
    type: String,
    default: ''
  },

  // Heading level (h1-h6)
  level: {
    type: String,
    default: 'h2',
    validator: (value) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value)
  },

  // HTML tag (can override level)
  tag: {
    type: String,
    default: null,
    validator: (value) => value === null || ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'p'].includes(value)
  },

  // Color variant
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
      'creep',
      'muted'
    ].includes(value)
  },

  // Text alignment
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'center', 'right'].includes(value)
  },

  // Icon (slot or component)
  icon: {
    type: [Object, String],
    default: null
  },

  // Badge text
  badge: {
    type: String,
    default: ''
  },

  // Visual features
  showStatus: {
    type: Boolean,
    default: false
  },

  brackets: {
    type: Boolean,
    default: false
  },

  decorativeLine: {
    type: String,
    default: '',
    validator: (value) => ['', 'left', 'right', 'both'].includes(value)
  },

  underline: {
    type: Boolean,
    default: false
  },

  glow: {
    type: Boolean,
    default: false
  },

  scanline: {
    type: Boolean,
    default: false
  },

  truncate: {
    type: Boolean,
    default: false
  }
})

// Computed tag (use tag prop or fall back to level)
const componentTag = computed(() => props.tag || props.level)
</script>

<script>
export default {
  computed: {
    tag() {
      return this.$props.tag || this.$props.level
    }
  }
}
</script>

<style src="./GHeading.css" scoped/>
