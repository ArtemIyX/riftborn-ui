<template>
  <div
    v-if="hint && !inlineHint"
    class="g-label-wrapper"
  >
    <component
      :is="tag"
      :for="htmlFor"
      class="g-label"
      :class="[
        `g-label--${variant}`,
        `g-label--${size}`,
        {
          [`g-label--${weight}`]: weight,
          'g-label--vertical': vertical,
          'g-label--inline': inline,
          'g-label--block': block,
          'g-label--glow': glow,
          'g-label--flicker': flicker,
          'g-label--disabled': disabled,
          'g-label--no-uppercase': noUppercase
        }
      ]"
    >
      <!-- Status indicator -->
      <span v-if="showStatus" class="g-label__status"></span>

      <!-- Icon left -->
      <span v-if="$slots.icon || icon" class="g-label__icon">
        <slot name="icon">
          <component :is="icon" v-if="typeof icon === 'object'" />
        </slot>
      </span>

      <!-- Text content -->
      <span class="g-label__text">
        <slot></slot>

        <!-- Required indicator -->
        <span
          v-if="required"
          class="g-label__required"
          :class="{ 'g-label__required--pulsing': requiredPulse }"
          aria-label="required"
        >
          *
        </span>

        <!-- Optional indicator -->
        <span v-if="optional" class="g-label__optional">(optional)</span>

        <!-- Badge -->
        <span v-if="badge" class="g-label__badge">{{ badge }}</span>

        <!-- Tooltip icon -->
        <span
          v-if="$slots.tooltip || tooltip"
          class="g-label__tooltip"
          :title="tooltip"
        >
          <slot name="tooltip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </slot>
        </span>
      </span>
    </component>

    <!-- Hint text (below) -->
    <div v-if="hint && !inlineHint" class="g-label__hint">
      <span v-if="hintIcon" class="g-label__hint-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </span>
      <slot name="hint">{{ hint }}</slot>
    </div>
  </div>

  <component
    v-else
    :is="tag"
    :for="htmlFor"
    class="g-label"
    :class="[
      `g-label--${variant}`,
      `g-label--${size}`,
      {
        [`g-label--${weight}`]: weight,
        'g-label--vertical': vertical,
        'g-label--inline': inline,
        'g-label--block': block,
        'g-label--glow': glow,
        'g-label--flicker': flicker,
        'g-label--disabled': disabled,
        'g-label--no-uppercase': noUppercase
      }
    ]"
  >
    <!-- Status indicator -->
    <span v-if="showStatus" class="g-label__status"></span>

    <!-- Icon left -->
    <span v-if="$slots.icon || icon" class="g-label__icon">
      <slot name="icon">
        <component :is="icon" v-if="typeof icon === 'object'" />
      </slot>
    </span>

    <!-- Text content -->
    <span class="g-label__text">
      <slot></slot>

      <!-- Required indicator -->
      <span
        v-if="required"
        class="g-label__required"
        :class="{ 'g-label__required--pulsing': requiredPulse }"
        aria-label="required"
      >
        *
      </span>

      <!-- Optional indicator -->
      <span v-if="optional" class="g-label__optional">(optional)</span>

      <!-- Badge -->
      <span v-if="badge" class="g-label__badge">{{ badge }}</span>

      <!-- Tooltip icon -->
      <span
        v-if="$slots.tooltip || tooltip"
        class="g-label__tooltip"
        :title="tooltip"
      >
        <slot name="tooltip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </slot>
      </span>

      <!-- Inline hint -->
      <span v-if="hint && inlineHint" class="g-label__hint" style="display: inline; margin-left: 0.5rem; margin-top: 0;">
        <span v-if="hintIcon" class="g-label__hint-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </span>
        <slot name="hint">{{ hint }}</slot>
      </span>
    </span>
  </component>
</template>

<script setup>
defineOptions({
  name: 'GLabel'
})

const props = defineProps({
  // HTML attributes
  tag: {
    type: String,
    default: 'label',
    validator: (value) => ['label', 'span', 'div'].includes(value)
  },

  htmlFor: {
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
      'muted'
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

  // Icon
  icon: {
    type: [Object, String],
    default: null
  },

  // Indicators
  required: {
    type: Boolean,
    default: false
  },

  requiredPulse: {
    type: Boolean,
    default: false
  },

  optional: {
    type: Boolean,
    default: false
  },

  showStatus: {
    type: Boolean,
    default: false
  },

  // Additional content
  badge: {
    type: String,
    default: ''
  },

  tooltip: {
    type: String,
    default: ''
  },

  hint: {
    type: String,
    default: ''
  },

  hintIcon: {
    type: Boolean,
    default: false
  },

  inlineHint: {
    type: Boolean,
    default: false
  },

  // Layout
  vertical: {
    type: Boolean,
    default: false
  },

  inline: {
    type: Boolean,
    default: false
  },

  block: {
    type: Boolean,
    default: false
  },

  noUppercase: {
    type: Boolean,
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

  // State
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style src="./GLabel.css" scoped/>
