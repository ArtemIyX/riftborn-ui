<template>
  <button
    class="g-btn-common"
    :class="[
      `g-btn-common--${variant}`,
      `g-btn-common--${size}`,
      { 'g-btn-common--disabled': disabled }
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <span class="g-btn-common__content">
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script setup>
defineOptions({
  name: 'GButtonCommon',
  inheritAttrs: false
})

defineProps({
  text: {
    type: String,
    default: 'OK'
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary', 'danger', 'ghost'].includes(value)
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
</script>

<style scoped>
/* ============================================
   G-BUTTON-COMMON
   Simplified UI Button
   ============================================ */

.g-btn-common {
  /* Reset */
  border: none;
  background: none;
  cursor: pointer;
  outline: none;

  /* Layout */
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* Typography */
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  /* Base styling */
  background-color: var(--common-bg, #1c232e);
  color: var(--common-color, #e0e4ea);
  border: 1px solid var(--common-border, #2a3444);
  border-radius: 2px;

  /* Transitions */
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

/* --------------------------------------------
   SIZES
   -------------------------------------------- */

.g-btn-common--small {
  padding: 4px 10px;
  font-size: 11px;
  min-width: 50px;
}

.g-btn-common--medium {
  padding: 6px 14px;
  font-size: 12px;
  min-width: 70px;
}

.g-btn-common--large {
  padding: 8px 20px;
  font-size: 13px;
  min-width: 90px;
}

/* --------------------------------------------
   CONTENT
   -------------------------------------------- */

.g-btn-common__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* --------------------------------------------
   HOVER & ACTIVE STATES
   -------------------------------------------- */

.g-btn-common:hover {
  background-color: var(--common-bg-hover, #252d3a);
  border-color: var(--common-border-hover, #3a4a5e);
}

.g-btn-common:active {
  transform: scale(0.98);
  background-color: var(--common-bg-active, #2a3444);
}

.g-btn-common:focus-visible {
  border-color: var(--common-focus, #00d4d4);
  box-shadow: 0 0 0 1px var(--common-focus, #00d4d4);
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Default (Neutral) */
.g-btn-common--default {
  --common-color: #e0e4ea;
  --common-bg: #1c232e;
  --common-bg-hover: #252d3a;
  --common-bg-active: #2a3444;
  --common-border: #2a3444;
  --common-border-hover: #3a4a5e;
  --common-focus: #00d4d4;
}

/* Primary (Cyan accent) */
.g-btn-common--primary {
  --common-color: #00d4d4;
  --common-bg: rgba(0, 212, 212, 0.1);
  --common-bg-hover: rgba(0, 212, 212, 0.18);
  --common-bg-active: rgba(0, 212, 212, 0.25);
  --common-border: rgba(0, 212, 212, 0.3);
  --common-border-hover: rgba(0, 212, 212, 0.5);
  --common-focus: #00d4d4;
}

/* Secondary (Blue accent) */
.g-btn-common--secondary {
  --common-color: #4488ff;
  --common-bg: rgba(68, 136, 255, 0.1);
  --common-bg-hover: rgba(68, 136, 255, 0.18);
  --common-bg-active: rgba(68, 136, 255, 0.25);
  --common-border: rgba(68, 136, 255, 0.3);
  --common-border-hover: rgba(68, 136, 255, 0.5);
  --common-focus: #4488ff;
}

/* Danger (Red) */
.g-btn-common--danger {
  --common-color: #ff3344;
  --common-bg: rgba(255, 51, 68, 0.1);
  --common-bg-hover: rgba(255, 51, 68, 0.18);
  --common-bg-active: rgba(255, 51, 68, 0.25);
  --common-border: rgba(255, 51, 68, 0.3);
  --common-border-hover: rgba(255, 51, 68, 0.5);
  --common-focus: #ff3344;
}

/* Ghost (Minimal) */
.g-btn-common--ghost {
  --common-color: #8892a2;
  --common-bg: transparent;
  --common-bg-hover: rgba(136, 146, 162, 0.08);
  --common-bg-active: rgba(136, 146, 162, 0.12);
  --common-border: transparent;
  --common-border-hover: rgba(136, 146, 162, 0.2);
  --common-focus: #8892a2;
}

.g-btn-common--ghost:hover {
  --common-color: #e0e4ea;
}

/* --------------------------------------------
   DISABLED STATE
   -------------------------------------------- */

.g-btn-common--disabled,
.g-btn-common:disabled {
  --common-color: #505868;
  --common-bg: rgba(80, 88, 104, 0.05);
  --common-border: rgba(80, 88, 104, 0.15);

  cursor: not-allowed;
  pointer-events: none;
}
</style>
