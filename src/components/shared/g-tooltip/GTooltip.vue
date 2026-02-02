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

<style src="./GTooltip.css" scoped/>
