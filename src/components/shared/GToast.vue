<template>
  <div
    class="g-toast"
    :class="[
      `g-toast--${variant}`,
      {
        'g-toast--paused': isPaused
      }
    ]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <!-- Corner accents -->
    <span class="g-toast__corner g-toast__corner--tl"></span>
    <span class="g-toast__corner g-toast__corner--br"></span>

    <!-- Icon -->
    <div class="g-toast__icon">
      <slot name="icon">
        <!-- Default icons based on variant -->
        <svg v-if="variant === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <svg v-else-if="variant === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <svg v-else-if="variant === 'danger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <svg v-else-if="variant === 'info'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <svg v-else-if="variant === 'creep'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </slot>
    </div>

    <!-- Content -->
    <div class="g-toast__content">
      <div v-if="title" class="g-toast__title">{{ title }}</div>
      <div class="g-toast__message">
        <slot>{{ message }}</slot>
      </div>

      <!-- Action button -->
      <button
        v-if="action"
        type="button"
        class="g-toast__action"
        @click="onActionClick"
      >
        {{ action.label }}
      </button>
    </div>

    <!-- Close button -->
    <button
      v-if="closable"
      type="button"
      class="g-toast__close"
      aria-label="Dismiss"
      @click="onClose"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <!-- Progress bar -->
    <div v-if="showProgress && duration > 0" class="g-toast__progress">
      <div
        class="g-toast__progress-bar"
        :style="progressStyle"
      ></div>
    </div>

    <!-- Scan effect -->
    <div class="g-toast__scan"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

defineOptions({
  name: 'GToast'
})

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'info', 'success', 'warning', 'danger', 'creep'].includes(value)
  },
  duration: {
    type: Number,
    default: 5000
  },
  closable: {
    type: Boolean,
    default: true
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  action: {
    type: Object,
    default: null,
    validator: (value) => value === null || (value.label && typeof value.onClick === 'function')
  }
})

const emit = defineEmits(['close', 'action'])

// State
const isPaused = ref(false)
const progress = ref(100)
const startTime = ref(0)
const remainingTime = ref(props.duration)
let timer = null
let animationFrame = null

// Computed
const progressStyle = computed(() => ({
  width: `${progress.value}%`,
  transitionDuration: isPaused.value ? '0ms' : '100ms'
}))

// Methods
const startTimer = () => {
  if (props.duration <= 0) return

  startTime.value = Date.now()

  const tick = () => {
    if (isPaused.value) {
      animationFrame = requestAnimationFrame(tick)
      return
    }

    const elapsed = Date.now() - startTime.value
    const remaining = remainingTime.value - elapsed

    if (remaining <= 0) {
      progress.value = 0
      onClose()
      return
    }

    progress.value = (remaining / props.duration) * 100
    animationFrame = requestAnimationFrame(tick)
  }

  animationFrame = requestAnimationFrame(tick)
}

const pauseTimer = () => {
  if (props.duration <= 0) return

  isPaused.value = true
  remainingTime.value = remainingTime.value - (Date.now() - startTime.value)
}

const resumeTimer = () => {
  if (props.duration <= 0) return

  isPaused.value = false
  startTime.value = Date.now()
}

const onMouseEnter = () => {
  pauseTimer()
}

const onMouseLeave = () => {
  resumeTimer()
}

const onClose = () => {
  emit('close', props.id)
}

const onActionClick = () => {
  if (props.action?.onClick) {
    props.action.onClick()
  }
  emit('action', props.id)
}

// Lifecycle
onMounted(() => {
  startTimer()
})

onBeforeUnmount(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<style scoped>
/* ============================================
   G-TOAST
   Space Horror UI Component
   ============================================ */

.g-toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 340px;
  padding: 14px 16px;

  background-color: var(--toast-bg, #0f1218);
  border: 1px solid var(--toast-border, #2a3444);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 20px var(--toast-glow, rgba(0, 212, 212, 0.1)),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);

  overflow: hidden;
}

/* --------------------------------------------
   CORNER ACCENTS
   -------------------------------------------- */

.g-toast__corner {
  position: absolute;
  width: 10px;
  height: 10px;
  pointer-events: none;
  z-index: 2;
}

.g-toast__corner::before,
.g-toast__corner::after {
  content: '';
  position: absolute;
  background-color: var(--toast-accent, #00d4d4);
}

.g-toast__corner--tl {
  top: -1px;
  left: -1px;
}
.g-toast__corner--tl::before {
  top: 0;
  left: 0;
  width: 10px;
  height: 1px;
}
.g-toast__corner--tl::after {
  top: 0;
  left: 0;
  width: 1px;
  height: 10px;
}

.g-toast__corner--br {
  bottom: -1px;
  right: -1px;
}
.g-toast__corner--br::before {
  bottom: 0;
  right: 0;
  width: 10px;
  height: 1px;
}
.g-toast__corner--br::after {
  bottom: 0;
  right: 0;
  width: 1px;
  height: 10px;
}

/* --------------------------------------------
   ICON
   -------------------------------------------- */

.g-toast__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-top: 2px;

  background-color: var(--toast-icon-bg, rgba(0, 212, 212, 0.1));
  border: 1px solid var(--toast-accent, #00d4d4);
  color: var(--toast-accent, #00d4d4);
}

.g-toast__icon svg {
  width: 16px;
  height: 16px;
}

/* --------------------------------------------
   CONTENT
   -------------------------------------------- */

.g-toast__content {
  flex: 1;
  min-width: 0;
}

.g-toast__title {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif;
  font-size: 14px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--toast-accent, #00d4d4);
  margin-bottom: 4px;

  animation: g-toast-title-flicker 0.1s ease 2;
}

@keyframes g-toast-title-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.g-toast__message {
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--toast-text, #e0e4ea);
}

/* Action button */
.g-toast__action {
  display: inline-block;
  margin-top: 10px;
  padding: 4px 12px;

  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  background-color: transparent;
  border: 1px solid var(--toast-accent, #00d4d4);
  color: var(--toast-accent, #00d4d4);
  cursor: pointer;

  transition: all 0.15s ease;
}

.g-toast__action:hover {
  background-color: var(--toast-accent, #00d4d4);
  color: #0a0c10;
}

.g-toast__action:focus-visible {
  outline: none;
  box-shadow: 0 0 0 1px var(--toast-accent, #00d4d4);
}

/* --------------------------------------------
   CLOSE BUTTON
   -------------------------------------------- */

.g-toast__close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  margin: -2px -4px 0 0;

  background: transparent;
  border: none;
  color: var(--toast-muted, #505868);
  cursor: pointer;

  transition: color 0.15s ease;
}

.g-toast__close:hover {
  color: var(--toast-text, #e0e4ea);
}

.g-toast__close:focus-visible {
  outline: none;
  color: var(--toast-accent, #00d4d4);
}

.g-toast__close svg {
  width: 14px;
  height: 14px;
}

/* --------------------------------------------
   PROGRESS BAR
   -------------------------------------------- */

.g-toast__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--toast-progress-bg, rgba(42, 52, 68, 0.5));
  overflow: hidden;
}

.g-toast__progress-bar {
  height: 100%;
  background-color: var(--toast-accent, #00d4d4);
  box-shadow: 0 0 8px var(--toast-accent, #00d4d4);
  transition: width 100ms linear;
}

.g-toast--paused .g-toast__progress-bar {
  animation: g-toast-progress-pulse 1s ease-in-out infinite;
}

@keyframes g-toast-progress-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* --------------------------------------------
   SCAN EFFECT
   -------------------------------------------- */

.g-toast__scan {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--toast-glow, rgba(0, 212, 212, 0.05)) 50%,
    transparent 100%
  );
  opacity: 0;
  pointer-events: none;
  animation: g-toast-scan 2s ease-in-out infinite;
}

@keyframes g-toast-scan {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Default (Cyan) */
.g-toast--default {
  --toast-bg: #0f1218;
  --toast-border: #2a3444;
  --toast-accent: #00d4d4;
  --toast-glow: rgba(0, 212, 212, 0.1);
  --toast-icon-bg: rgba(0, 212, 212, 0.1);
  --toast-text: #e0e4ea;
  --toast-muted: #505868;
  --toast-progress-bg: rgba(42, 52, 68, 0.5);
}

/* Info (Blue) */
.g-toast--info {
  --toast-bg: #0f1218;
  --toast-border: rgba(68, 136, 255, 0.3);
  --toast-accent: #4488ff;
  --toast-glow: rgba(68, 136, 255, 0.1);
  --toast-icon-bg: rgba(68, 136, 255, 0.1);
  --toast-text: #e0e4ea;
  --toast-muted: #4466aa;
  --toast-progress-bg: rgba(68, 136, 255, 0.2);
}

/* Success (Green) */
.g-toast--success {
  --toast-bg: #0f1218;
  --toast-border: rgba(0, 204, 102, 0.3);
  --toast-accent: #00cc66;
  --toast-glow: rgba(0, 204, 102, 0.1);
  --toast-icon-bg: rgba(0, 204, 102, 0.1);
  --toast-text: #e0e4ea;
  --toast-muted: #007744;
  --toast-progress-bg: rgba(0, 204, 102, 0.2);
}

/* Warning (Orange) */
.g-toast--warning {
  --toast-bg: #0f1218;
  --toast-border: rgba(255, 153, 34, 0.3);
  --toast-accent: #ff9922;
  --toast-glow: rgba(255, 153, 34, 0.1);
  --toast-icon-bg: rgba(255, 153, 34, 0.1);
  --toast-text: #e0e4ea;
  --toast-muted: #996611;
  --toast-progress-bg: rgba(255, 153, 34, 0.2);
}

.g-toast--warning .g-toast__icon {
  animation: g-toast-warning-pulse 1s ease-in-out infinite;
}

@keyframes g-toast-warning-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Danger (Red) */
.g-toast--danger {
  --toast-bg: rgba(255, 51, 68, 0.05);
  --toast-border: rgba(255, 51, 68, 0.4);
  --toast-accent: #ff3344;
  --toast-glow: rgba(255, 51, 68, 0.15);
  --toast-icon-bg: rgba(255, 51, 68, 0.15);
  --toast-text: #e0e4ea;
  --toast-muted: #992233;
  --toast-progress-bg: rgba(255, 51, 68, 0.2);
}

.g-toast--danger .g-toast__icon {
  animation: g-toast-danger-pulse 0.5s ease-in-out infinite;
}

@keyframes g-toast-danger-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

.g-toast--danger .g-toast__scan {
  animation: g-toast-scan-danger 1s ease-in-out infinite;
}

@keyframes g-toast-scan-danger {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}

/* Creep (Purple - Anomaly) */
.g-toast--creep {
  --toast-bg: rgba(136, 68, 170, 0.05);
  --toast-border: rgba(136, 68, 170, 0.4);
  --toast-accent: #8844aa;
  --toast-glow: rgba(136, 68, 170, 0.15);
  --toast-icon-bg: rgba(136, 68, 170, 0.15);
  --toast-text: #e0e4ea;
  --toast-muted: #553366;
  --toast-progress-bg: rgba(136, 68, 170, 0.2);
}

.g-toast--creep .g-toast__title {
  animation: g-toast-creep-glitch 3s ease-in-out infinite;
}

@keyframes g-toast-creep-glitch {
  0%, 90%, 100% {
    opacity: 1;
    transform: translateX(0);
  }
  92% {
    opacity: 0.8;
    transform: translateX(-2px);
  }
  94% {
    opacity: 1;
    transform: translateX(2px);
  }
  96% {
    opacity: 0.9;
    transform: translateX(-1px);
  }
  98% {
    opacity: 1;
    transform: translateX(0);
  }
}

.g-toast--creep .g-toast__scan {
  animation: g-toast-scan-creep 1.5s ease-in-out infinite;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(136, 68, 170, 0.1) 50%,
    transparent 100%
  );
}

@keyframes g-toast-scan-creep {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  30% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.3;
  }
  70% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>
