<template>
  <label
    class="g-toggle"
    :class="[
      `g-toggle--${variant}`,
      `g-toggle--${size}`,
      {
        'g-toggle--checked': modelValue,
        'g-toggle--disabled': disabled
      }
    ]"
  >
    <!-- Hidden input -->
    <input
      ref="inputRef"
      type="checkbox"
      class="g-toggle__input"
      :checked="modelValue"
      :disabled="disabled"
      v-bind="$attrs"
      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

    <!-- Track -->
    <span
      class="g-toggle__track"
      :class="{ 'g-toggle__track--focused': isFocused }"
    >
      <!-- Track glow -->
      <span class="g-toggle__glow"></span>

      <!-- Thumb -->
      <span class="g-toggle__thumb">
        <span class="g-toggle__thumb-dot"></span>
      </span>

      <!-- Status indicators -->
      <span class="g-toggle__status g-toggle__status--on">I</span>
      <span class="g-toggle__status g-toggle__status--off">O</span>
    </span>

    <!-- Label -->
    <span v-if="label || $slots.default" class="g-toggle__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'GToggle',
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'danger', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// Refs
const inputRef = ref(null)
const isFocused = ref(false)

// Methods
const onChange = (e) => {
  if (props.disabled) return
  const newValue = e.target.checked
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

const toggle = () => {
  if (props.disabled) return
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

// Expose
defineExpose({
  focus,
  blur,
  toggle,
  inputRef
})
</script>

<style scoped>
/* ============================================
   G-TOGGLE
   Space Horror UI Component
   ============================================ */

.g-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

/* --------------------------------------------
   HIDDEN INPUT
   -------------------------------------------- */

.g-toggle__input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

/* --------------------------------------------
   TRACK
   -------------------------------------------- */

.g-toggle__track {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  background-color: var(--toggle-track-bg, #161b24);
  border: 1px solid var(--toggle-border, #2a3444);
  border-radius: 2px;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.g-toggle:hover .g-toggle__track {
  border-color: var(--toggle-border-hover, #3a4a5e);
}

.g-toggle__track--focused {
  border-color: var(--toggle-accent, #00d4d4);
  box-shadow: 0 0 8px var(--toggle-glow, rgba(0, 212, 212, 0.2));
}

.g-toggle--checked .g-toggle__track {
  background-color: var(--toggle-track-bg-active, rgba(0, 212, 212, 0.1));
  border-color: var(--toggle-accent, #00d4d4);
}

/* --------------------------------------------
   GLOW
   -------------------------------------------- */

.g-toggle__glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    transparent,
    var(--toggle-glow, rgba(0, 212, 212, 0.1)),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.g-toggle--checked .g-toggle__glow {
  opacity: 1;
}

/* --------------------------------------------
   THUMB
   -------------------------------------------- */

.g-toggle__thumb {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--toggle-thumb-bg, #2a3444);
  border: 1px solid var(--toggle-thumb-border, #3a4a5e);
  border-radius: 1px;

  transition:
    left 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.g-toggle--checked .g-toggle__thumb {
  background-color: var(--toggle-accent, #00d4d4);
  border-color: var(--toggle-accent, #00d4d4);
  box-shadow: 0 0 10px var(--toggle-glow, rgba(0, 212, 212, 0.4));
}

/* Thumb dot (indicator light) */
.g-toggle__thumb-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--toggle-dot, #505868);
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.g-toggle--checked .g-toggle__thumb-dot {
  background-color: var(--toggle-dot-active, #0a0c10);
  box-shadow: 0 0 4px var(--toggle-dot-active, #0a0c10);
}

/* --------------------------------------------
   STATUS INDICATORS
   -------------------------------------------- */

.g-toggle__status {
  position: absolute;
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-weight: 400;
  color: var(--toggle-status, #505868);
  transition: opacity 0.2s ease, color 0.2s ease;
  pointer-events: none;
}

.g-toggle__status--on {
  opacity: 0;
}

.g-toggle__status--off {
  opacity: 0.6;
}

.g-toggle--checked .g-toggle__status--on {
  opacity: 1;
  color: var(--toggle-accent, #00d4d4);
}

.g-toggle--checked .g-toggle__status--off {
  opacity: 0;
}

/* --------------------------------------------
   LABEL
   -------------------------------------------- */

.g-toggle__label {
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--toggle-label, #e0e4ea);
  transition: color 0.15s ease;
}

.g-toggle:hover .g-toggle__label {
  color: var(--toggle-label-hover, #fff);
}

.g-toggle--checked .g-toggle__label {
  color: var(--toggle-accent, #00d4d4);
}

/* --------------------------------------------
   SIZES
   -------------------------------------------- */

/* Small */
.g-toggle--small .g-toggle__track {
  width: 36px;
  height: 18px;
}

.g-toggle--small .g-toggle__thumb {
  width: 12px;
  height: 12px;
  left: 3px;
}

.g-toggle--small.g-toggle--checked .g-toggle__thumb {
  left: 19px;
}

.g-toggle--small .g-toggle__thumb-dot {
  width: 3px;
  height: 3px;
}

.g-toggle--small .g-toggle__status {
  font-size: 8px;
}

.g-toggle--small .g-toggle__status--on {
  left: 6px;
}

.g-toggle--small .g-toggle__status--off {
  right: 6px;
}

.g-toggle--small .g-toggle__label {
  font-size: 11px;
}

/* Medium */
.g-toggle--medium .g-toggle__track {
  width: 48px;
  height: 24px;
}

.g-toggle--medium .g-toggle__thumb {
  width: 16px;
  height: 16px;
  left: 4px;
}

.g-toggle--medium.g-toggle--checked .g-toggle__thumb {
  left: 26px;
}

.g-toggle--medium .g-toggle__status {
  font-size: 9px;
}

.g-toggle--medium .g-toggle__status--on {
  left: 7px;
}

.g-toggle--medium .g-toggle__status--off {
  right: 7px;
}

.g-toggle--medium .g-toggle__label {
  font-size: 12px;
}

/* Large */
.g-toggle--large .g-toggle__track {
  width: 60px;
  height: 30px;
}

.g-toggle--large .g-toggle__thumb {
  width: 20px;
  height: 20px;
  left: 5px;
}

.g-toggle--large.g-toggle--checked .g-toggle__thumb {
  left: 33px;
}

.g-toggle--large .g-toggle__thumb-dot {
  width: 5px;
  height: 5px;
}

.g-toggle--large .g-toggle__status {
  font-size: 10px;
}

.g-toggle--large .g-toggle__status--on {
  left: 9px;
}

.g-toggle--large .g-toggle__status--off {
  right: 9px;
}

.g-toggle--large .g-toggle__label {
  font-size: 14px;
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Default */
.g-toggle--default {
  --toggle-track-bg: #161b24;
  --toggle-track-bg-active: rgba(0, 212, 212, 0.1);
  --toggle-border: #2a3444;
  --toggle-border-hover: #3a4a5e;
  --toggle-accent: #00d4d4;
  --toggle-glow: rgba(0, 212, 212, 0.2);
  --toggle-thumb-bg: #2a3444;
  --toggle-thumb-border: #3a4a5e;
  --toggle-dot: #505868;
  --toggle-dot-active: #0a0c10;
  --toggle-status: #505868;
  --toggle-label: #e0e4ea;
  --toggle-label-hover: #fff;
}

/* Primary */
.g-toggle--primary {
  --toggle-track-bg: rgba(0, 212, 212, 0.05);
  --toggle-track-bg-active: rgba(0, 212, 212, 0.15);
  --toggle-border: rgba(0, 212, 212, 0.3);
  --toggle-border-hover: rgba(0, 212, 212, 0.5);
  --toggle-accent: #00d4d4;
  --toggle-glow: rgba(0, 212, 212, 0.3);
  --toggle-thumb-bg: #007070;
  --toggle-thumb-border: #00a0a0;
  --toggle-dot: #00a0a0;
  --toggle-dot-active: #0a0c10;
  --toggle-status: #007070;
  --toggle-label: #00d4d4;
  --toggle-label-hover: #00ffff;
}

/* Danger */
.g-toggle--danger {
  --toggle-track-bg: rgba(255, 51, 68, 0.05);
  --toggle-track-bg-active: rgba(255, 51, 68, 0.15);
  --toggle-border: rgba(255, 51, 68, 0.3);
  --toggle-border-hover: rgba(255, 51, 68, 0.5);
  --toggle-accent: #ff3344;
  --toggle-glow: rgba(255, 51, 68, 0.3);
  --toggle-thumb-bg: #992233;
  --toggle-thumb-border: #cc2936;
  --toggle-dot: #cc2936;
  --toggle-dot-active: #0a0c10;
  --toggle-status: #992233;
  --toggle-label: #ff3344;
  --toggle-label-hover: #ff6677;
}

/* Success */
.g-toggle--success {
  --toggle-track-bg: rgba(0, 204, 102, 0.05);
  --toggle-track-bg-active: rgba(0, 204, 102, 0.15);
  --toggle-border: rgba(0, 204, 102, 0.3);
  --toggle-border-hover: rgba(0, 204, 102, 0.5);
  --toggle-accent: #00cc66;
  --toggle-glow: rgba(0, 204, 102, 0.3);
  --toggle-thumb-bg: #007744;
  --toggle-thumb-border: #00994d;
  --toggle-dot: #00994d;
  --toggle-dot-active: #0a0c10;
  --toggle-status: #007744;
  --toggle-label: #00cc66;
  --toggle-label-hover: #00ff7f;
}

/* --------------------------------------------
   DISABLED
   -------------------------------------------- */

.g-toggle--disabled {
  pointer-events: none;
}

.g-toggle--disabled .g-toggle__track {
  --toggle-track-bg: rgba(80, 88, 104, 0.05);
  --toggle-border: rgba(80, 88, 104, 0.2);
}

.g-toggle--disabled .g-toggle__thumb {
  --toggle-thumb-bg: #1c232e;
  --toggle-thumb-border: #2a3444;
}

.g-toggle--disabled .g-toggle__thumb-dot {
  --toggle-dot: #2a3444;
}

.g-toggle--disabled .g-toggle__label {
  color: #505868;
}

.g-toggle--disabled.g-toggle--checked .g-toggle__thumb {
  background-color: #505868;
  border-color: #505868;
  box-shadow: none;
}

.g-toggle--disabled .g-toggle__status {
  opacity: 0.3;
}

.g-toggle--disabled .g-toggle__glow {
  display: none;
}
</style>
