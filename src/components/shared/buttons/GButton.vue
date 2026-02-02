<template>
  <button
    class="g-btn"
    :class="[
      `g-btn--${variant}`,
      `g-btn--${size}`,
      { 'g-btn--disabled': disabled }
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <span class="g-btn__glow"></span>
    <span class="g-btn__border"></span>
    <span class="g-btn__content">
      <slot>{{ text }}</slot>
    </span>
    <span class="g-btn__scanline"></span>
  </button>
</template>

<script setup>
defineOptions({
  name: 'GButton',
  inheritAttrs: false
})

defineProps({
  text: {
    type: String,
    default: 'ENGAGE'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'warning', 'success'].includes(value)
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
   G-BUTTON
   Space Horror UI Component
   ============================================ */

.g-btn {
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
  overflow: hidden;

  /* Typography */
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;

  /* Base styling */
  background-color: var(--btn-bg, rgba(0, 212, 212, 0.08));
  color: var(--btn-color, #00d4d4);

  /* Clip path for angled corners */
  clip-path: polygon(
    0 0,
    calc(100% - 0.5rem) 0,
    100% 0.5rem,
    100% 100%,
    0.5rem 100%,
    0 calc(100% - 0.5rem)
  );

  /* Transitions */
  transition:
    background-color 0.2s ease,
    color 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.2s ease;
}

/* --------------------------------------------
   SIZES
   -------------------------------------------- */

.g-btn--small {
  padding: 0.375rem 1rem;
  font-size: 0.6875rem;
  min-width: 5rem;
}

.g-btn--medium {
  padding: 0.625rem 1.5rem;
  font-size: 0.8125rem;
  min-width: 7.5rem;
}

.g-btn--large {
  padding: 0.875rem 2rem;
  font-size: 0.9375rem;
  min-width: 10rem;
}

/* --------------------------------------------
   GLOW LAYER
   -------------------------------------------- */

.g-btn__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    var(--btn-glow, rgba(0, 212, 212, 0.15)) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.g-btn:hover .g-btn__glow {
  opacity: 1;
}

/* --------------------------------------------
   BORDER LAYER
   -------------------------------------------- */

.g-btn__border {
  position: absolute;
  inset: 0;
  border: 0.0625rem solid var(--btn-border, rgba(0, 212, 212, 0.4));
  clip-path: inherit;
  pointer-events: none;
  transition: border-color 0.2s ease;
}

.g-btn:hover .g-btn__border {
  border-color: var(--btn-border-hover, rgba(0, 212, 212, 0.8));
}

.g-btn:focus-visible .g-btn__border {
  border-color: var(--btn-color, #00d4d4);
  box-shadow:
    inset 0 0 0.5rem var(--btn-glow, rgba(0, 212, 212, 0.3)),
    0 0 0.75rem var(--btn-glow, rgba(0, 212, 212, 0.2));
}

/* --------------------------------------------
   CONTENT
   -------------------------------------------- */

.g-btn__content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* --------------------------------------------
   SCANLINE EFFECT
   -------------------------------------------- */

.g-btn__scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.125rem;
  background: linear-gradient(
    90deg,
    transparent,
    var(--btn-color, #00d4d4),
    transparent
  );
  opacity: 0;
  transform: translateY(-100%);
  pointer-events: none;
}

.g-btn:hover .g-btn__scanline {
  opacity: 0.6;
  animation: g-btn-scanline 1.5s ease-in-out infinite;
}

@keyframes g-btn-scanline {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(calc(100% + 3.125rem));
    opacity: 0;
  }
}

/* --------------------------------------------
   HOVER & ACTIVE STATES
   -------------------------------------------- */

.g-btn:hover {
  background-color: var(--btn-bg-hover, rgba(0, 212, 212, 0.15));
  box-shadow:
    0 0 1.25rem var(--btn-glow, rgba(0, 212, 212, 0.2)),
    inset 0 0 1.25rem var(--btn-glow, rgba(0, 212, 212, 0.05));
}

.g-btn:active {
  transform: scale(0.98);
  background-color: var(--btn-bg-active, rgba(0, 212, 212, 0.25));
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Primary (Cyan - Terminal) */
.g-btn--primary {
  --btn-color: #00d4d4;
  --btn-bg: rgba(0, 212, 212, 0.08);
  --btn-bg-hover: rgba(0, 212, 212, 0.15);
  --btn-bg-active: rgba(0, 212, 212, 0.25);
  --btn-border: rgba(0, 212, 212, 0.4);
  --btn-border-hover: rgba(0, 212, 212, 0.8);
  --btn-glow: rgba(0, 212, 212, 0.15);
}

/* Secondary (Blue - Sonar) */
.g-btn--secondary {
  --btn-color: #4488ff;
  --btn-bg: rgba(68, 136, 255, 0.08);
  --btn-bg-hover: rgba(68, 136, 255, 0.15);
  --btn-bg-active: rgba(68, 136, 255, 0.25);
  --btn-border: rgba(68, 136, 255, 0.4);
  --btn-border-hover: rgba(68, 136, 255, 0.8);
  --btn-glow: rgba(68, 136, 255, 0.15);
}

/* Danger (Red - Critical Alert) */
.g-btn--danger {
  --btn-color: #ff3344;
  --btn-bg: rgba(255, 51, 68, 0.08);
  --btn-bg-hover: rgba(255, 51, 68, 0.15);
  --btn-bg-active: rgba(255, 51, 68, 0.25);
  --btn-border: rgba(255, 51, 68, 0.4);
  --btn-border-hover: rgba(255, 51, 68, 0.8);
  --btn-glow: rgba(255, 51, 68, 0.2);
}

/* Warning (Orange - Caution) */
.g-btn--warning {
  --btn-color: #ff9922;
  --btn-bg: rgba(255, 153, 34, 0.08);
  --btn-bg-hover: rgba(255, 153, 34, 0.15);
  --btn-bg-active: rgba(255, 153, 34, 0.25);
  --btn-border: rgba(255, 153, 34, 0.4);
  --btn-border-hover: rgba(255, 153, 34, 0.8);
  --btn-glow: rgba(255, 153, 34, 0.15);
}

/* Success (Green - Systems Online) */
.g-btn--success {
  --btn-color: #00cc66;
  --btn-bg: rgba(0, 204, 102, 0.08);
  --btn-bg-hover: rgba(0, 204, 102, 0.15);
  --btn-bg-active: rgba(0, 204, 102, 0.25);
  --btn-border: rgba(0, 204, 102, 0.4);
  --btn-border-hover: rgba(0, 204, 102, 0.8);
  --btn-glow: rgba(0, 204, 102, 0.15);
}

/* --------------------------------------------
   DISABLED STATE
   -------------------------------------------- */

.g-btn--disabled,
.g-btn:disabled {
  --btn-color: #505868;
  --btn-bg: rgba(80, 88, 104, 0.05);
  --btn-border: rgba(80, 88, 104, 0.2);

  cursor: not-allowed;
  pointer-events: none;
}

.g-btn--disabled .g-btn__scanline,
.g-btn:disabled .g-btn__scanline {
  display: none;
}

.g-btn--disabled .g-btn__glow,
.g-btn:disabled .g-btn__glow {
  display: none;
}
</style>
