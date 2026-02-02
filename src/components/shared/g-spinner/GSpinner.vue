<template>
  <div
    class="g-spinner"
    :class="[
      `g-spinner--${variant}`,
      `g-spinner--${size}`,
      {
        'g-spinner--inline': inline
      }
    ]"
    role="status"
    :aria-label="ariaLabel"
  >
    <!-- Sonar spinner -->
    <svg
      v-if="variant === 'sonar'"
      class="g-spinner__sonar"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle class="g-spinner__sonar-ring g-spinner__sonar-ring--1" cx="50" cy="50" r="35" />
      <circle class="g-spinner__sonar-ring g-spinner__sonar-ring--2" cx="50" cy="50" r="35" />
      <circle class="g-spinner__sonar-ring g-spinner__sonar-ring--3" cx="50" cy="50" r="35" />
      <line class="g-spinner__sonar-sweep" x1="50" y1="50" x2="50" y2="15" />
    </svg>

    <!-- Orbital spinner -->
    <svg
      v-else-if="variant === 'orbital'"
      class="g-spinner__orbital"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle class="g-spinner__orbital-track" cx="50" cy="50" r="35" />
      <circle class="g-spinner__orbital-dot g-spinner__orbital-dot--1" cx="50" cy="15" r="4" />
      <circle class="g-spinner__orbital-dot g-spinner__orbital-dot--2" cx="50" cy="15" r="3" />
      <circle class="g-spinner__orbital-dot g-spinner__orbital-dot--3" cx="50" cy="15" r="2" />
    </svg>

    <!-- Dots spinner -->
    <div v-else-if="variant === 'dots'" class="g-spinner__dots">
      <span class="g-spinner__dot g-spinner__dot--1"></span>
      <span class="g-spinner__dot g-spinner__dot--2"></span>
      <span class="g-spinner__dot g-spinner__dot--3"></span>
    </div>

    <!-- Pulse spinner -->
    <div v-else-if="variant === 'pulse'" class="g-spinner__pulse">
      <span class="g-spinner__pulse-ring g-spinner__pulse-ring--1"></span>
      <span class="g-spinner__pulse-ring g-spinner__pulse-ring--2"></span>
      <span class="g-spinner__pulse-ring g-spinner__pulse-ring--3"></span>
    </div>

    <!-- Bars spinner -->
    <div v-else-if="variant === 'bars'" class="g-spinner__bars">
      <span class="g-spinner__bar g-spinner__bar--1"></span>
      <span class="g-spinner__bar g-spinner__bar--2"></span>
      <span class="g-spinner__bar g-spinner__bar--3"></span>
      <span class="g-spinner__bar g-spinner__bar--4"></span>
      <span class="g-spinner__bar g-spinner__bar--5"></span>
    </div>

    <!-- Scan spinner -->
    <div v-else-if="variant === 'scan'" class="g-spinner__scan">
      <span class="g-spinner__scan-line"></span>
    </div>

    <!-- Helix spinner (DNA-like) -->
    <svg
      v-else-if="variant === 'helix'"
      class="g-spinner__helix"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle class="g-spinner__helix-dot g-spinner__helix-dot--1" cx="30" cy="50" r="5" />
      <circle class="g-spinner__helix-dot g-spinner__helix-dot--2" cx="50" cy="50" r="5" />
      <circle class="g-spinner__helix-dot g-spinner__helix-dot--3" cx="70" cy="50" r="5" />
    </svg>

    <!-- Glitch spinner -->
    <div v-else-if="variant === 'glitch'" class="g-spinner__glitch">
      <span class="g-spinner__glitch-block g-spinner__glitch-block--1"></span>
      <span class="g-spinner__glitch-block g-spinner__glitch-block--2"></span>
      <span class="g-spinner__glitch-block g-spinner__glitch-block--3"></span>
      <span class="g-spinner__glitch-block g-spinner__glitch-block--4"></span>
    </div>

    <!-- Ring spinner (default) -->
    <svg
      v-else
      class="g-spinner__ring"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle class="g-spinner__ring-track" cx="50" cy="50" r="40" />
      <circle class="g-spinner__ring-progress" cx="50" cy="50" r="40" />
    </svg>

    <!-- Label text -->
    <span v-if="label" class="g-spinner__label">{{ label }}</span>
  </div>
</template>

<script setup>
defineOptions({
  name: 'GSpinner'
})

const props = defineProps({
  variant: {
    type: String,
    default: 'ring',
    validator: (value) => [
      'ring',
      'sonar',
      'orbital',
      'dots',
      'pulse',
      'bars',
      'scan',
      'helix',
      'glitch'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['tiny', 'small', 'medium', 'large', 'huge'].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  inline: {
    type: Boolean,
    default: false
  },
  ariaLabel: {
    type: String,
    default: 'Loading...'
  }
})
</script>

<style src="./GSpinner.css" scoped/>
