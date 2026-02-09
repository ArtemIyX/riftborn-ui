<template>
  <div class="alpha-badge" :class="badgeClasses">
    <!-- Corner accents -->
    <div class="alpha-badge__corner alpha-badge__corner--tl"></div>
    <div class="alpha-badge__corner alpha-badge__corner--tr"></div>
    <div class="alpha-badge__corner alpha-badge__corner--bl"></div>
    <div class="alpha-badge__corner alpha-badge__corner--br"></div>

    <!-- Scanline effect -->
    <div class="alpha-badge__scan-line"></div>

    <!-- Status indicator -->
    <div class="alpha-badge__status-dot"></div>

    <!-- Content -->
    <div class="alpha-badge__content">
      <div class="alpha-badge__label">{{ label }}</div>
      <div class="alpha-badge__version">{{ version }}</div>
    </div>

    <!-- Border glow -->
    <div class="alpha-badge__border-glow"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: 'ALPHA'
  },
  version: {
    type: String,
    default: 'PREVIEW'
  },
  variant: {
    type: String,
    default: 'warning', // 'warning', 'danger', 'primary', 'creep'
    validator: (value) => ['warning', 'danger', 'primary', 'creep', 'default'].includes(value)
  },
  pulse: {
    type: Boolean,
    default: true
  },
  glitch: {
    type: Boolean,
    default: false
  }
});

const badgeClasses = computed(() => ({
  [`alpha-badge--${props.variant}`]: true,
  'alpha-badge--pulse': props.pulse,
  'alpha-badge--glitch': props.glitch
}));
</script>

<style scoped src="./AlphaBadge.css"/>
