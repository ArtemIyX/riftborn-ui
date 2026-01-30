<template>
  <button
    class="g-btn-adv"
    :class="[
      `g-btn-adv--${variant}`,
      `g-btn-adv--${size}`,
      { 'g-btn-adv--disabled': disabled }
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <!-- Corner accents -->
    <span class="g-btn-adv__corner g-btn-adv__corner--tl"></span>
    <span class="g-btn-adv__corner g-btn-adv__corner--tr"></span>
    <span class="g-btn-adv__corner g-btn-adv__corner--bl"></span>
    <span class="g-btn-adv__corner g-btn-adv__corner--br"></span>

    <!-- Animated background layers -->
    <span class="g-btn-adv__bg"></span>
    <span class="g-btn-adv__pulse"></span>

    <!-- Content -->
    <span class="g-btn-adv__content">
      <span class="g-btn-adv__icon-left">
        <slot name="icon-left"></slot>
      </span>
      <span class="g-btn-adv__text">
        <slot>{{ text }}</slot>
      </span>
      <span class="g-btn-adv__icon-right">
        <slot name="icon-right"></slot>
      </span>
    </span>

    <!-- Data stream effect -->
    <span class="g-btn-adv__stream"></span>
  </button>
</template>

<script setup>
defineOptions({
  name: 'GButtonAdv',
  inheritAttrs: false
})

defineProps({
  text: {
    type: String,
    default: 'INITIALIZE'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'warning', 'success', 'creep'].includes(value)
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
   G-BUTTON-ADV
   Advanced Control Panel Style
   ============================================ */

.g-btn-adv {
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
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2em;

  /* Base styling */
  background-color: var(--adv-bg, #0f1218);
  color: var(--adv-color, #00d4d4);
  border: 1px solid var(--adv-border, rgba(0, 212, 212, 0.3));

  /* Transitions */
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.15s ease;
}

/* --------------------------------------------
   SIZES
   -------------------------------------------- */

.g-btn-adv--small {
  padding: 8px 20px;
  font-size: 10px;
  min-width: 100px;
}

.g-btn-adv--medium {
  padding: 12px 28px;
  font-size: 12px;
  min-width: 140px;
}

.g-btn-adv--large {
  padding: 16px 40px;
  font-size: 14px;
  min-width: 180px;
}

/* --------------------------------------------
   CORNER ACCENTS
   -------------------------------------------- */

.g-btn-adv__corner {
  position: absolute;
  width: 12px;
  height: 12px;
  pointer-events: none;
  transition: all 0.3s ease;
}

.g-btn-adv__corner::before,
.g-btn-adv__corner::after {
  content: '';
  position: absolute;
  background-color: var(--adv-accent, #00d4d4);
  transition: background-color 0.3s ease;
}

.g-btn-adv__corner--tl {
  top: -1px;
  left: -1px;
}
.g-btn-adv__corner--tl::before {
  top: 0;
  left: 0;
  width: 12px;
  height: 2px;
}
.g-btn-adv__corner--tl::after {
  top: 0;
  left: 0;
  width: 2px;
  height: 12px;
}

.g-btn-adv__corner--tr {
  top: -1px;
  right: -1px;
}
.g-btn-adv__corner--tr::before {
  top: 0;
  right: 0;
  width: 12px;
  height: 2px;
}
.g-btn-adv__corner--tr::after {
  top: 0;
  right: 0;
  width: 2px;
  height: 12px;
}

.g-btn-adv__corner--bl {
  bottom: -1px;
  left: -1px;
}
.g-btn-adv__corner--bl::before {
  bottom: 0;
  left: 0;
  width: 12px;
  height: 2px;
}
.g-btn-adv__corner--bl::after {
  bottom: 0;
  left: 0;
  width: 2px;
  height: 12px;
}

.g-btn-adv__corner--br {
  bottom: -1px;
  right: -1px;
}
.g-btn-adv__corner--br::before {
  bottom: 0;
  right: 0;
  width: 12px;
  height: 2px;
}
.g-btn-adv__corner--br::after {
  bottom: 0;
  right: 0;
  width: 2px;
  height: 12px;
}

/* Corner hover animation */
.g-btn-adv:hover .g-btn-adv__corner--tl,
.g-btn-adv:hover .g-btn-adv__corner--br {
  transform: translate(-2px, -2px);
}

.g-btn-adv:hover .g-btn-adv__corner--tr,
.g-btn-adv:hover .g-btn-adv__corner--bl {
  transform: translate(2px, 2px);
}

.g-btn-adv:hover .g-btn-adv__corner--tr {
  transform: translate(2px, -2px);
}

.g-btn-adv:hover .g-btn-adv__corner--bl {
  transform: translate(-2px, 2px);
}

/* --------------------------------------------
   BACKGROUND LAYERS
   -------------------------------------------- */

.g-btn-adv__bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    var(--adv-glow, rgba(0, 212, 212, 0.05)) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.g-btn-adv:hover .g-btn-adv__bg {
  opacity: 1;
}

/* Pulse ring effect */
.g-btn-adv__pulse {
  position: absolute;
  inset: -4px;
  border: 1px solid var(--adv-accent, #00d4d4);
  opacity: 0;
  pointer-events: none;
}

.g-btn-adv:hover .g-btn-adv__pulse {
  animation: g-btn-adv-pulse 1.5s ease-out infinite;
}

@keyframes g-btn-adv-pulse {
  0% {
    opacity: 0.6;
    inset: -4px;
  }
  100% {
    opacity: 0;
    inset: -16px;
  }
}

/* --------------------------------------------
   CONTENT
   -------------------------------------------- */

.g-btn-adv__content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 10px;
}

.g-btn-adv__icon-left,
.g-btn-adv__icon-right {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
}

.g-btn-adv__icon-left:empty,
.g-btn-adv__icon-right:empty {
  display: none;
}

.g-btn-adv__text {
  position: relative;
}

/* Text glitch on hover */
.g-btn-adv:hover .g-btn-adv__text {
  animation: g-btn-adv-glitch 0.3s ease forwards;
}

@keyframes g-btn-adv-glitch {
  0% {
    opacity: 1;
  }
  20% {
    opacity: 0.8;
    transform: translateX(-2px);
  }
  40% {
    opacity: 1;
    transform: translateX(2px);
  }
  60% {
    opacity: 0.9;
    transform: translateX(-1px);
  }
  80% {
    opacity: 1;
    transform: translateX(1px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* --------------------------------------------
   DATA STREAM EFFECT
   -------------------------------------------- */

.g-btn-adv__stream {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--adv-accent, #00d4d4) 20%,
    var(--adv-accent, #00d4d4) 80%,
    transparent
  );
  opacity: 0.4;
  overflow: hidden;
  pointer-events: none;
}

.g-btn-adv__stream::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 30%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
}

.g-btn-adv:hover .g-btn-adv__stream::after {
  animation: g-btn-adv-stream 1s linear infinite;
}

@keyframes g-btn-adv-stream {
  0% {
    left: -30%;
  }
  100% {
    left: 100%;
  }
}

/* --------------------------------------------
   HOVER & ACTIVE STATES
   -------------------------------------------- */

.g-btn-adv:hover {
  border-color: var(--adv-border-hover, rgba(0, 212, 212, 0.6));
  box-shadow:
    0 0 30px var(--adv-glow, rgba(0, 212, 212, 0.15)),
    inset 0 0 30px var(--adv-glow, rgba(0, 212, 212, 0.05));
}

.g-btn-adv:active {
  transform: scale(0.98);
  background-color: var(--adv-bg-active, rgba(0, 212, 212, 0.1));
}

.g-btn-adv:focus-visible {
  border-color: var(--adv-accent, #00d4d4);
  box-shadow:
    0 0 0 2px var(--adv-bg, #0f1218),
    0 0 0 4px var(--adv-accent, #00d4d4);
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Primary (Cyan - Main Terminal) */
.g-btn-adv--primary {
  --adv-color: #00d4d4;
  --adv-bg: #0f1218;
  --adv-bg-active: rgba(0, 212, 212, 0.1);
  --adv-border: rgba(0, 212, 212, 0.3);
  --adv-border-hover: rgba(0, 212, 212, 0.6);
  --adv-accent: #00d4d4;
  --adv-glow: rgba(0, 212, 212, 0.15);
}

/* Secondary (Blue - Navigation) */
.g-btn-adv--secondary {
  --adv-color: #4488ff;
  --adv-bg: #0f1218;
  --adv-bg-active: rgba(68, 136, 255, 0.1);
  --adv-border: rgba(68, 136, 255, 0.3);
  --adv-border-hover: rgba(68, 136, 255, 0.6);
  --adv-accent: #4488ff;
  --adv-glow: rgba(68, 136, 255, 0.15);
}

/* Danger (Red - Emergency) */
.g-btn-adv--danger {
  --adv-color: #ff3344;
  --adv-bg: #0f1218;
  --adv-bg-active: rgba(255, 51, 68, 0.1);
  --adv-border: rgba(255, 51, 68, 0.3);
  --adv-border-hover: rgba(255, 51, 68, 0.6);
  --adv-accent: #ff3344;
  --adv-glow: rgba(255, 51, 68, 0.2);
}

/* Warning (Orange - Alert) */
.g-btn-adv--warning {
  --adv-color: #ff9922;
  --adv-bg: #0f1218;
  --adv-bg-active: rgba(255, 153, 34, 0.1);
  --adv-border: rgba(255, 153, 34, 0.3);
  --adv-border-hover: rgba(255, 153, 34, 0.6);
  --adv-accent: #ff9922;
  --adv-glow: rgba(255, 153, 34, 0.15);
}

/* Success (Green - Confirmed) */
.g-btn-adv--success {
  --adv-color: #00cc66;
  --adv-bg: #0f1218;
  --adv-bg-active: rgba(0, 204, 102, 0.1);
  --adv-border: rgba(0, 204, 102, 0.3);
  --adv-border-hover: rgba(0, 204, 102, 0.6);
  --adv-accent: #00cc66;
  --adv-glow: rgba(0, 204, 102, 0.15);
}

/* Creep (Purple - Anomaly/Horror) */
.g-btn-adv--creep {
  --adv-color: #8844aa;
  --adv-bg: #0f1218;
  --adv-bg-active: rgba(136, 68, 170, 0.1);
  --adv-border: rgba(136, 68, 170, 0.3);
  --adv-border-hover: rgba(136, 68, 170, 0.6);
  --adv-accent: #8844aa;
  --adv-glow: rgba(136, 68, 170, 0.2);
}

/* --------------------------------------------
   DISABLED STATE
   -------------------------------------------- */

.g-btn-adv--disabled,
.g-btn-adv:disabled {
  --adv-color: #505868;
  --adv-bg: #0a0c10;
  --adv-border: rgba(80, 88, 104, 0.2);
  --adv-accent: #505868;

  cursor: not-allowed;
  pointer-events: none;
}

.g-btn-adv--disabled .g-btn-adv__pulse,
.g-btn-adv:disabled .g-btn-adv__pulse,
.g-btn-adv--disabled .g-btn-adv__stream,
.g-btn-adv:disabled .g-btn-adv__stream {
  display: none;
}

.g-btn-adv--disabled .g-btn-adv__corner::before,
.g-btn-adv--disabled .g-btn-adv__corner::after,
.g-btn-adv:disabled .g-btn-adv__corner::before,
.g-btn-adv:disabled .g-btn-adv__corner::after {
  background-color: #505868;
}
</style>
