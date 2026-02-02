<template>
  <component
    :is="tag"
    class="g-text"
    :class="[
      `g-text--${variant}`,
      `g-text--${size}`,
      {
        [`g-text--${weight}`]: weight,
        [`g-text--${family}`]: family,
        [`g-text--${align}`]: align && align !== 'left',
        'g-text--uppercase': uppercase,
        'g-text--lowercase': lowercase,
        'g-text--capitalize': capitalize,
        'g-text--truncate': truncate,
        [`g-text--clamp-${clamp}`]: clamp,
        'g-text--nowrap': nowrap,
        'g-text--break': breakWord,
        'g-text--block': block,
        'g-text--inline': inline,
        'g-text--inline-block': inlineBlock,
        [`g-text--spacing-${spacing}`]: spacing && spacing !== 'normal',
        'g-text--glow': glow,
        'g-text--glitch': glitch,
        'g-text--flicker': flicker,
        'g-text--pulse': pulse,
        'g-text--scanline': scanline,
        'g-text--disabled': disabled,
        'g-text--interactive': interactive,
        'g-text--gradient': gradient,
        [`g-text--gradient-${gradient}`]: gradient && gradient !== true,
        'g-text--with-icon': $slots.icon || $slots['icon-left'] || $slots['icon-right']
      }
    ]"
    @click="onClick"
  >
    <!-- Icon left -->
    <span v-if="$slots['icon-left'] || $slots.icon" class="g-text__icon">
      <slot name="icon-left">
        <slot name="icon"></slot>
      </slot>
    </span>

    <!-- Content -->
    <slot></slot>

    <!-- Badge -->
    <span v-if="badge" class="g-text__badge">{{ badge }}</span>

    <!-- Icon right -->
    <span v-if="$slots['icon-right']" class="g-text__icon">
      <slot name="icon-right"></slot>
    </span>
  </component>
</template>

<script setup>
defineOptions({
  name: 'GText'
})

const props = defineProps({
  // HTML tag
  tag: {
    type: String,
    default: 'p',
    validator: (value) => ['p', 'span', 'div', 'label', 'em', 'strong', 'small', 'mark'].includes(value)
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
      'muted',
      'dim',
      'inverse'
    ].includes(value)
  },

  // Size
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['xs', 'small', 'medium', 'large', 'xl'].includes(value)
  },

  // Font weight
  weight: {
    type: String,
    default: null,
    validator: (value) => value === null || ['light', 'regular', 'medium', 'semibold', 'bold'].includes(value)
  },

  // Font family
  family: {
    type: String,
    default: null,
    validator: (value) => value === null || ['ui', 'mono', 'title', 'special'].includes(value)
  },

  // Text alignment
  align: {
    type: String,
    default: null,
    validator: (value) => value === null || ['left', 'center', 'right', 'justify'].includes(value)
  },

  // Text transforms
  uppercase: {
    type: Boolean,
    default: false
  },

  lowercase: {
    type: Boolean,
    default: false
  },

  capitalize: {
    type: Boolean,
    default: false
  },

  // Overflow handling
  truncate: {
    type: Boolean,
    default: false
  },

  clamp: {
    type: [Number, Boolean],
    default: false,
    validator: (value) => value === false || [2, 3, 4].includes(value)
  },

  nowrap: {
    type: Boolean,
    default: false
  },

  breakWord: {
    type: Boolean,
    default: false
  },

  // Display
  block: {
    type: Boolean,
    default: false
  },

  inline: {
    type: Boolean,
    default: false
  },

  inlineBlock: {
    type: Boolean,
    default: false
  },

  // Line spacing
  spacing: {
    type: String,
    default: null,
    validator: (value) => value === null || ['tight', 'normal', 'loose'].includes(value)
  },

  // Effects
  glow: {
    type: Boolean,
    default: false
  },

  glitch: {
    type: Boolean,
    default: false
  },

  flicker: {
    type: Boolean,
    default: false
  },

  pulse: {
    type: Boolean,
    default: false
  },

  scanline: {
    type: Boolean,
    default: false
  },

  gradient: {
    type: [Boolean, String],
    default: false,
    validator: (value) => value === false || value === true || ['primary', 'danger', 'success'].includes(value)
  },

  // Additional elements
  badge: {
    type: String,
    default: ''
  },

  // States
  disabled: {
    type: Boolean,
    default: false
  },

  interactive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

// Methods
const onClick = (event) => {
  if (props.disabled) return
  if (props.interactive) {
    emit('click', event)
  }
}
</script>

<style src="./GText.css" scoped/>
