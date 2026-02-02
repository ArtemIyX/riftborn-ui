<template>
  <component
    :is="tag"
    class="g-link"
    :class="[
      `g-link--${variant}`,
      `g-link--${size}`,
      {
        [`g-link--${weight}`]: weight,
        [`g-link--${family}`]: family,
        'g-link--underline': underline,
        'g-link--underline-hover': underlineHover,
        'g-link--underline-animated': underlineAnimated,
        'g-link--block': block,
        'g-link--inline-block': inlineBlock,
        'g-link--disabled': disabled,
        'g-link--loading': loading,
        'g-link--glow': glow,
        'g-link--flicker': flicker,
        'g-link--scanline': scanline,
        'g-link--uppercase': uppercase,
        'g-link--external': external,
        'g-link--track-visited': trackVisited,
        'g-link--icon-left': $slots['icon-left'] || $slots.icon,
        'g-link--icon-right': $slots['icon-right']
      }
    ]"
    :href="href"
    :to="to"
    :target="computedTarget"
    :rel="computedRel"
    :aria-disabled="disabled"
    @click="onClick"
  >
    <!-- Icon left -->
    <span v-if="$slots['icon-left'] || $slots.icon" class="g-link__icon">
      <slot name="icon-left">
        <slot name="icon"></slot>
      </slot>
    </span>

    <!-- Content -->
    <span class="g-link__text">
      <slot></slot>
    </span>

    <!-- Badge -->
    <span v-if="badge" class="g-link__badge">{{ badge }}</span>

    <!-- Icon right / External icon -->
    <span v-if="$slots['icon-right'] || (external && showExternalIcon)" class="g-link__icon">
      <slot name="icon-right">
        <!-- Default external icon -->
        <svg v-if="external && showExternalIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </slot>
    </span>

    <!-- Decorative line -->
    <span v-if="decorativeLine" class="g-link__line"></span>
  </component>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'GLink'
})

const props = defineProps({
  // HTML/Router props
  tag: {
    type: String,
    default: 'a',
    validator: (value) => ['a', 'router-link', 'nuxt-link', 'button'].includes(value)
  },

  href: {
    type: String,
    default: null
  },

  to: {
    type: [String, Object],
    default: null
  },

  target: {
    type: String,
    default: null,
    validator: (value) => value === null || ['_blank', '_self', '_parent', '_top'].includes(value)
  },

  rel: {
    type: String,
    default: null
  },

  // Styling
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

  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['xs', 'small', 'medium', 'large', 'xl'].includes(value)
  },

  weight: {
    type: String,
    default: null,
    validator: (value) => value === null || ['light', 'regular', 'medium', 'semibold', 'bold'].includes(value)
  },

  family: {
    type: String,
    default: null,
    validator: (value) => value === null || ['ui', 'mono', 'title'].includes(value)
  },

  // Underline styles
  underline: {
    type: Boolean,
    default: false
  },

  underlineHover: {
    type: Boolean,
    default: false
  },

  underlineAnimated: {
    type: Boolean,
    default: false
  },

  // Layout
  block: {
    type: Boolean,
    default: false
  },

  inlineBlock: {
    type: Boolean,
    default: false
  },

  // Additional elements
  badge: {
    type: String,
    default: ''
  },

  decorativeLine: {
    type: Boolean,
    default: false
  },

  // Behavior
  external: {
    type: Boolean,
    default: false
  },

  showExternalIcon: {
    type: Boolean,
    default: true
  },

  download: {
    type: [Boolean, String],
    default: false
  },

  // Effects
  glow: {
    type: Boolean,
    default: false
  },

  flicker: {
    type: Boolean,
    default: false
  },

  scanline: {
    type: Boolean,
    default: false
  },

  uppercase: {
    type: Boolean,
    default: false
  },

  // States
  disabled: {
    type: Boolean,
    default: false
  },

  loading: {
    type: Boolean,
    default: false
  },

  trackVisited: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

// Computed
const computedTarget = computed(() => {
  if (props.target) return props.target
  if (props.external) return '_blank'
  return null
})

const computedRel = computed(() => {
  if (props.rel) return props.rel
  if (props.external || computedTarget.value === '_blank') {
    return 'noopener noreferrer'
  }
  return null
})

// Methods
const onClick = (event) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<style src="./GLink.css" scoped/>
