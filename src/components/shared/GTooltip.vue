<template>
  <div
    class="g-tooltip-wrapper"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    ref="triggerRef"
  >
    <!-- Trigger slot -->
    <slot></slot>

    <!-- Tooltip -->
    <Teleport to="body">
      <Transition name="g-tooltip">
        <div
          v-if="isVisible"
          ref="tooltipRef"
          class="g-tooltip"
          :class="[
            `g-tooltip--${variant}`,
            `g-tooltip--${size}`,
            `g-tooltip--${actualPlacement}`,
            {
              'g-tooltip--with-arrow': showArrow,
              'g-tooltip--interactive': interactive
            }
          ]"
          :style="tooltipStyle"
          role="tooltip"
          @mouseenter="onTooltipMouseEnter"
          @mouseleave="onTooltipMouseLeave"
        >
          <!-- Scanline effect -->
          <span v-if="variant === 'primary' || variant === 'danger'" class="g-tooltip__scanline"></span>

          <!-- Corner accents -->
          <span class="g-tooltip__corner g-tooltip__corner--tl"></span>
          <span class="g-tooltip__corner g-tooltip__corner--tr"></span>
          <span class="g-tooltip__corner g-tooltip__corner--bl"></span>
          <span class="g-tooltip__corner g-tooltip__corner--br"></span>

          <!-- Content -->
          <div class="g-tooltip__content">
            <!-- Icon -->
            <span v-if="icon || $slots.icon" class="g-tooltip__icon">
              <slot name="icon">
                <!-- Default info icon -->
                <svg v-if="icon === 'info'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <!-- Warning icon -->
                <svg v-else-if="icon === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <!-- Danger icon -->
                <svg v-else-if="icon === 'danger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <!-- Success icon -->
                <svg v-else-if="icon === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </slot>
            </span>

            <!-- Title -->
            <div v-if="title || $slots.title" class="g-tooltip__title">
              <slot name="title">{{ title }}</slot>
            </div>

            <!-- Text -->
            <div class="g-tooltip__text">
              <slot name="content">{{ text }}</slot>
            </div>

            <!-- Custom widget slot -->
            <div v-if="$slots.widget" class="g-tooltip__widget">
              <slot name="widget"></slot>
            </div>

            <!-- Hotkey -->
            <span v-if="hotkey" class="g-tooltip__hotkey">
              <kbd v-for="(key, index) in hotkeyParts" :key="index" class="g-tooltip__key">
                {{ key }}
              </kbd>
            </span>
          </div>

          <!-- Arrow -->
          <span v-if="showArrow" class="g-tooltip__arrow"></span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'GTooltip'
})

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '',
    validator: (value) => ['', 'info', 'warning', 'danger', 'success'].includes(value)
  },
  hotkey: {
    type: String,
    default: ''
  },
  placement: {
    type: String,
    default: 'top',
    validator: (value) => [
      'top', 'top-start', 'top-end',
      'bottom', 'bottom-start', 'bottom-end',
      'left', 'left-start', 'left-end',
      'right', 'right-start', 'right-end'
    ].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'danger', 'warning', 'success', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  delay: {
    type: Number,
    default: 200
  },
  hideDelay: {
    type: Number,
    default: 100
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showArrow: {
    type: Boolean,
    default: true
  },
  interactive: {
    type: Boolean,
    default: false
  },
  maxWidth: {
    type: [Number, String],
    default: 280
  },
  offset: {
    type: Number,
    default: 8
  },
  trigger: {
    type: String,
    default: 'hover',
    validator: (value) => ['hover', 'focus', 'both'].includes(value)
  }
})

const emit = defineEmits(['show', 'hide'])

// Refs
const triggerRef = ref(null)
const tooltipRef = ref(null)
const isVisible = ref(false)
const actualPlacement = ref(props.placement)
const tooltipStyle = ref({})

// Timers
let showTimer = null
let hideTimer = null

// Computed
const hotkeyParts = computed(() => {
  if (!props.hotkey) return []
  return props.hotkey.split('+').map(k => k.trim())
})

const maxWidthPx = computed(() => {
  if (typeof props.maxWidth === 'number') {
    return `${props.maxWidth}px`
  }
  return props.maxWidth
})

// Methods
const show = () => {
  if (props.disabled) return

  clearTimeout(hideTimer)
  showTimer = setTimeout(() => {
    isVisible.value = true
    nextTick(() => {
      updatePosition()
    })
    emit('show')
  }, props.delay)
}

const hide = () => {
  clearTimeout(showTimer)
  hideTimer = setTimeout(() => {
    isVisible.value = false
    emit('hide')
  }, props.hideDelay)
}

const updatePosition = () => {
  if (!triggerRef.value || !tooltipRef.value) return

  const triggerEl = triggerRef.value
  const tooltipEl = tooltipRef.value
  const triggerRect = triggerEl.getBoundingClientRect()
  const tooltipRect = tooltipEl.getBoundingClientRect()

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const scrollX = window.scrollX
  const scrollY = window.scrollY

  let placement = props.placement
  let top = 0
  let left = 0

  // Calculate base position
  const positions = {
    top: () => {
      top = triggerRect.top - tooltipRect.height - props.offset
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
    },
    'top-start': () => {
      top = triggerRect.top - tooltipRect.height - props.offset
      left = triggerRect.left
    },
    'top-end': () => {
      top = triggerRect.top - tooltipRect.height - props.offset
      left = triggerRect.right - tooltipRect.width
    },
    bottom: () => {
      top = triggerRect.bottom + props.offset
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
    },
    'bottom-start': () => {
      top = triggerRect.bottom + props.offset
      left = triggerRect.left
    },
    'bottom-end': () => {
      top = triggerRect.bottom + props.offset
      left = triggerRect.right - tooltipRect.width
    },
    left: () => {
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.left - tooltipRect.width - props.offset
    },
    'left-start': () => {
      top = triggerRect.top
      left = triggerRect.left - tooltipRect.width - props.offset
    },
    'left-end': () => {
      top = triggerRect.bottom - tooltipRect.height
      left = triggerRect.left - tooltipRect.width - props.offset
    },
    right: () => {
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.right + props.offset
    },
    'right-start': () => {
      top = triggerRect.top
      left = triggerRect.right + props.offset
    },
    'right-end': () => {
      top = triggerRect.bottom - tooltipRect.height
      left = triggerRect.right + props.offset
    }
  }

  // Apply initial position
  positions[placement]()

  // Flip if necessary
  const basePlacement = placement.split('-')[0]

  // Check and flip vertically
  if (basePlacement === 'top' && top < 0) {
    placement = placement.replace('top', 'bottom')
    positions[placement]()
  } else if (basePlacement === 'bottom' && top + tooltipRect.height > viewportHeight) {
    placement = placement.replace('bottom', 'top')
    positions[placement]()
  }

  // Check and flip horizontally
  if (basePlacement === 'left' && left < 0) {
    placement = placement.replace('left', 'right')
    positions[placement]()
  } else if (basePlacement === 'right' && left + tooltipRect.width > viewportWidth) {
    placement = placement.replace('right', 'left')
    positions[placement]()
  }

  // Constrain to viewport
  left = Math.max(8, Math.min(left, viewportWidth - tooltipRect.width - 8))
  top = Math.max(8, Math.min(top, viewportHeight - tooltipRect.height - 8))

  actualPlacement.value = placement

  tooltipStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    maxWidth: maxWidthPx.value
  }
}

// Event handlers
const onMouseEnter = () => {
  if (props.trigger === 'hover' || props.trigger === 'both') {
    show()
  }
}

const onMouseLeave = () => {
  if (props.trigger === 'hover' || props.trigger === 'both') {
    if (!props.interactive) {
      hide()
    } else {
      // Small delay to allow moving to tooltip
      hideTimer = setTimeout(() => {
        hide()
      }, 100)
    }
  }
}

const onFocusIn = () => {
  if (props.trigger === 'focus' || props.trigger === 'both') {
    show()
  }
}

const onFocusOut = () => {
  if (props.trigger === 'focus' || props.trigger === 'both') {
    hide()
  }
}

const onTooltipMouseEnter = () => {
  if (props.interactive) {
    clearTimeout(hideTimer)
  }
}

const onTooltipMouseLeave = () => {
  if (props.interactive) {
    hide()
  }
}

// Watchers
watch(() => props.placement, () => {
  if (isVisible.value) {
    nextTick(updatePosition)
  }
})

watch(() => props.disabled, (disabled) => {
  if (disabled && isVisible.value) {
    hide()
  }
})

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
})

onBeforeUnmount(() => {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})

// Expose
defineExpose({
  show: () => {
    clearTimeout(hideTimer)
    isVisible.value = true
    nextTick(updatePosition)
    emit('show')
  },
  hide: () => {
    clearTimeout(showTimer)
    isVisible.value = false
    emit('hide')
  },
  updatePosition,
  isVisible
})
</script>

<style scoped>
/* ============================================
   G-TOOLTIP
   Space Horror UI Component
   ============================================ */

.g-tooltip-wrapper {
  display: inline-block;
}

.g-tooltip {
  position: fixed;
  z-index: 10000;
  pointer-events: none;

  background-color: var(--tooltip-bg, #0f1218);
  border: 1px solid var(--tooltip-border, #2a3444);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.6),
    0 0 16px var(--tooltip-glow, rgba(0, 212, 212, 0.1)),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);

  overflow: hidden;
}

.g-tooltip--interactive {
  pointer-events: auto;
}

/* --------------------------------------------
   SCANLINE EFFECT
   -------------------------------------------- */

.g-tooltip__scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--tooltip-accent, #00d4d4),
    transparent
  );
  opacity: 0.5;
  animation: g-tooltip-scanline 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes g-tooltip-scanline {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(100%);
    opacity: 0.2;
  }
}

/* --------------------------------------------
   CORNER ACCENTS
   -------------------------------------------- */

.g-tooltip__corner {
  position: absolute;
  width: 6px;
  height: 6px;
  pointer-events: none;
  z-index: 1;
}

.g-tooltip__corner::before,
.g-tooltip__corner::after {
  content: '';
  position: absolute;
  background-color: var(--tooltip-accent, #00d4d4);
}

.g-tooltip__corner--tl {
  top: 0;
  left: 0;
}
.g-tooltip__corner--tl::before {
  top: 0;
  left: 0;
  width: 6px;
  height: 1px;
}
.g-tooltip__corner--tl::after {
  top: 0;
  left: 0;
  width: 1px;
  height: 6px;
}

.g-tooltip__corner--tr {
  top: 0;
  right: 0;
}
.g-tooltip__corner--tr::before {
  top: 0;
  right: 0;
  width: 6px;
  height: 1px;
}
.g-tooltip__corner--tr::after {
  top: 0;
  right: 0;
  width: 1px;
  height: 6px;
}

.g-tooltip__corner--bl {
  bottom: 0;
  left: 0;
}
.g-tooltip__corner--bl::before {
  bottom: 0;
  left: 0;
  width: 6px;
  height: 1px;
}
.g-tooltip__corner--bl::after {
  bottom: 0;
  left: 0;
  width: 1px;
  height: 6px;
}

.g-tooltip__corner--br {
  bottom: 0;
  right: 0;
}
.g-tooltip__corner--br::before {
  bottom: 0;
  right: 0;
  width: 6px;
  height: 1px;
}
.g-tooltip__corner--br::after {
  bottom: 0;
  right: 0;
  width: 1px;
  height: 6px;
}

/* --------------------------------------------
   CONTENT
   -------------------------------------------- */

.g-tooltip__content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* --------------------------------------------
   ICON
   -------------------------------------------- */

.g-tooltip__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  color: var(--tooltip-accent, #00d4d4);
  margin-bottom: 2px;
}

.g-tooltip__icon svg {
  width: 14px;
  height: 14px;
}

/* --------------------------------------------
   TITLE
   -------------------------------------------- */

.g-tooltip__title {
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--tooltip-title, #e0e4ea);
  line-height: 1.2;
}

/* --------------------------------------------
   TEXT
   -------------------------------------------- */

.g-tooltip__text {
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--tooltip-text, #8892a2);
  line-height: 1.4;
}

/* --------------------------------------------
   WIDGET SLOT
   -------------------------------------------- */

.g-tooltip__widget {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--tooltip-divider, #1e2632);
}

/* --------------------------------------------
   HOTKEY
   -------------------------------------------- */

.g-tooltip__hotkey {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  padding-top: 6px;
  border-top: 1px solid var(--tooltip-divider, #1e2632);
}

.g-tooltip__key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 5px;

  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 10px;
  font-weight: 400;
  color: var(--tooltip-key-text, #e0e4ea);

  background-color: var(--tooltip-key-bg, #1c232e);
  border: 1px solid var(--tooltip-key-border, #2a3444);
  border-radius: 2px;
}

/* --------------------------------------------
   ARROW
   -------------------------------------------- */

.g-tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: var(--tooltip-bg, #0f1218);
  border: 1px solid var(--tooltip-border, #2a3444);
  transform: rotate(45deg);
  pointer-events: none;
}

/* Arrow positions */
.g-tooltip--top .g-tooltip__arrow,
.g-tooltip--top-start .g-tooltip__arrow,
.g-tooltip--top-end .g-tooltip__arrow {
  bottom: -5px;
  border-top: none;
  border-left: none;
}

.g-tooltip--top .g-tooltip__arrow {
  left: 50%;
  margin-left: -4px;
}

.g-tooltip--top-start .g-tooltip__arrow {
  left: 12px;
}

.g-tooltip--top-end .g-tooltip__arrow {
  right: 12px;
}

.g-tooltip--bottom .g-tooltip__arrow,
.g-tooltip--bottom-start .g-tooltip__arrow,
.g-tooltip--bottom-end .g-tooltip__arrow {
  top: -5px;
  border-bottom: none;
  border-right: none;
}

.g-tooltip--bottom .g-tooltip__arrow {
  left: 50%;
  margin-left: -4px;
}

.g-tooltip--bottom-start .g-tooltip__arrow {
  left: 12px;
}

.g-tooltip--bottom-end .g-tooltip__arrow {
  right: 12px;
}

.g-tooltip--left .g-tooltip__arrow,
.g-tooltip--left-start .g-tooltip__arrow,
.g-tooltip--left-end .g-tooltip__arrow {
  right: -5px;
  border-bottom: none;
  border-left: none;
}

.g-tooltip--left .g-tooltip__arrow {
  top: 50%;
  margin-top: -4px;
}

.g-tooltip--left-start .g-tooltip__arrow {
  top: 10px;
}

.g-tooltip--left-end .g-tooltip__arrow {
  bottom: 10px;
}

.g-tooltip--right .g-tooltip__arrow,
.g-tooltip--right-start .g-tooltip__arrow,
.g-tooltip--right-end .g-tooltip__arrow {
  left: -5px;
  border-top: none;
  border-right: none;
}

.g-tooltip--right .g-tooltip__arrow {
  top: 50%;
  margin-top: -4px;
}

.g-tooltip--right-start .g-tooltip__arrow {
  top: 10px;
}

.g-tooltip--right-end .g-tooltip__arrow {
  bottom: 10px;
}

/* --------------------------------------------
   SIZES
   -------------------------------------------- */

/* Small */
.g-tooltip--small {
  padding: 6px 10px;
}

.g-tooltip--small .g-tooltip__title {
  font-size: 10px;
}

.g-tooltip--small .g-tooltip__text {
  font-size: 10px;
}

.g-tooltip--small .g-tooltip__icon svg {
  width: 12px;
  height: 12px;
}

/* Medium */
.g-tooltip--medium {
  padding: 8px 12px;
}

.g-tooltip--medium .g-tooltip__title {
  font-size: 11px;
}

.g-tooltip--medium .g-tooltip__text {
  font-size: 11px;
}

/* Large */
.g-tooltip--large {
  padding: 10px 14px;
}

.g-tooltip--large .g-tooltip__title {
  font-size: 12px;
}

.g-tooltip--large .g-tooltip__text {
  font-size: 12px;
}

.g-tooltip--large .g-tooltip__icon svg {
  width: 16px;
  height: 16px;
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Default */
.g-tooltip--default {
  --tooltip-bg: #0f1218;
  --tooltip-border: #2a3444;
  --tooltip-accent: #00d4d4;
  --tooltip-glow: rgba(0, 212, 212, 0.1);
  --tooltip-title: #e0e4ea;
  --tooltip-text: #8892a2;
  --tooltip-divider: #1e2632;
  --tooltip-key-bg: #1c232e;
  --tooltip-key-border: #2a3444;
  --tooltip-key-text: #e0e4ea;
}

/* Primary */
.g-tooltip--primary {
  --tooltip-bg: rgba(0, 212, 212, 0.08);
  --tooltip-border: rgba(0, 212, 212, 0.4);
  --tooltip-accent: #00d4d4;
  --tooltip-glow: rgba(0, 212, 212, 0.2);
  --tooltip-title: #00ffff;
  --tooltip-text: #00d4d4;
  --tooltip-divider: rgba(0, 212, 212, 0.2);
  --tooltip-key-bg: rgba(0, 212, 212, 0.1);
  --tooltip-key-border: rgba(0, 212, 212, 0.3);
  --tooltip-key-text: #00d4d4;
}

/* Danger */
.g-tooltip--danger {
  --tooltip-bg: rgba(255, 51, 68, 0.08);
  --tooltip-border: rgba(255, 51, 68, 0.4);
  --tooltip-accent: #ff3344;
  --tooltip-glow: rgba(255, 51, 68, 0.2);
  --tooltip-title: #ff6677;
  --tooltip-text: #ff3344;
  --tooltip-divider: rgba(255, 51, 68, 0.2);
  --tooltip-key-bg: rgba(255, 51, 68, 0.1);
  --tooltip-key-border: rgba(255, 51, 68, 0.3);
  --tooltip-key-text: #ff3344;
}

/* Warning */
.g-tooltip--warning {
  --tooltip-bg: rgba(255, 153, 34, 0.08);
  --tooltip-border: rgba(255, 153, 34, 0.4);
  --tooltip-accent: #ff9922;
  --tooltip-glow: rgba(255, 153, 34, 0.2);
  --tooltip-title: #ffaa44;
  --tooltip-text: #ff9922;
  --tooltip-divider: rgba(255, 153, 34, 0.2);
  --tooltip-key-bg: rgba(255, 153, 34, 0.1);
  --tooltip-key-border: rgba(255, 153, 34, 0.3);
  --tooltip-key-text: #ff9922;
}

/* Success */
.g-tooltip--success {
  --tooltip-bg: rgba(0, 204, 102, 0.08);
  --tooltip-border: rgba(0, 204, 102, 0.4);
  --tooltip-accent: #00cc66;
  --tooltip-glow: rgba(0, 204, 102, 0.2);
  --tooltip-title: #00ff7f;
  --tooltip-text: #00cc66;
  --tooltip-divider: rgba(0, 204, 102, 0.2);
  --tooltip-key-bg: rgba(0, 204, 102, 0.1);
  --tooltip-key-border: rgba(0, 204, 102, 0.3);
  --tooltip-key-text: #00cc66;
}

/* Info */
.g-tooltip--info {
  --tooltip-bg: rgba(68, 136, 255, 0.08);
  --tooltip-border: rgba(68, 136, 255, 0.4);
  --tooltip-accent: #4488ff;
  --tooltip-glow: rgba(68, 136, 255, 0.2);
  --tooltip-title: #66aaff;
  --tooltip-text: #4488ff;
  --tooltip-divider: rgba(68, 136, 255, 0.2);
  --tooltip-key-bg: rgba(68, 136, 255, 0.1);
  --tooltip-key-border: rgba(68, 136, 255, 0.3);
  --tooltip-key-text: #4488ff;
}

/* --------------------------------------------
   TRANSITIONS
   -------------------------------------------- */

.g-tooltip-enter-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.g-tooltip-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}

.g-tooltip-enter-from,
.g-tooltip-leave-to {
  opacity: 0;
}

/* Direction-based transforms */
.g-tooltip--top.g-tooltip-enter-from,
.g-tooltip--top.g-tooltip-leave-to,
.g-tooltip--top-start.g-tooltip-enter-from,
.g-tooltip--top-start.g-tooltip-leave-to,
.g-tooltip--top-end.g-tooltip-enter-from,
.g-tooltip--top-end.g-tooltip-leave-to {
  transform: translateY(4px);
}

.g-tooltip--bottom.g-tooltip-enter-from,
.g-tooltip--bottom.g-tooltip-leave-to,
.g-tooltip--bottom-start.g-tooltip-enter-from,
.g-tooltip--bottom-start.g-tooltip-leave-to,
.g-tooltip--bottom-end.g-tooltip-enter-from,
.g-tooltip--bottom-end.g-tooltip-leave-to {
  transform: translateY(-4px);
}

.g-tooltip--left.g-tooltip-enter-from,
.g-tooltip--left.g-tooltip-leave-to,
.g-tooltip--left-start.g-tooltip-enter-from,
.g-tooltip--left-start.g-tooltip-leave-to,
.g-tooltip--left-end.g-tooltip-enter-from,
.g-tooltip--left-end.g-tooltip-leave-to {
  transform: translateX(4px);
}

.g-tooltip--right.g-tooltip-enter-from,
.g-tooltip--right.g-tooltip-leave-to,
.g-tooltip--right-start.g-tooltip-enter-from,
.g-tooltip--right-start.g-tooltip-leave-to,
.g-tooltip--right-end.g-tooltip-enter-from,
.g-tooltip--right-end.g-tooltip-leave-to {
  transform: translateX(-4px);
}
</style>
