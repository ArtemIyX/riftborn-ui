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

<style src="./GToast.css" scoped/>

