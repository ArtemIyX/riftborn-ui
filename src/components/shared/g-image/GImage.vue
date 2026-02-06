<template>
  <div
    class="g-image"
    :class="[
      `g-image--${fit}`,
      {
        'g-image--loading': isLoading,
        'g-image--error': hasError,
        'g-image--loaded': isLoaded,
        'g-image--rounded': rounded
      }
    ]"
    :style="imageContainerStyle"
  >
    <!-- Skeleton Loading State -->
    <g-skeleton
      v-if="isLoading && showSkeleton"
      variant="image"
      :animation="skeletonAnimation"
      :width="width"
      :height="height"
      :aspect-ratio="aspectRatio"
      :rounded="rounded"
      :show-corners="showCorners"
    />

    <!-- Actual Image -->
    <img
      v-show="isLoaded"
      ref="imageRef"
      :src="currentSrc"
      :alt="alt"
      :loading="lazyLoad ? 'lazy' : 'eager'"
      class="g-image__img"
      :class="{ 'g-image__img--fade-in': fadeIn && isLoaded }"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Error State -->
    <div v-if="hasError" class="g-image__error">
      <div class="g-image__error-content">
        <!-- Error Icon -->
        <svg
          class="g-image__error-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            d="M12 2L2 22H22L12 2ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z"
            fill="currentColor"
          />
        </svg>

        <!-- Error Text -->
        <span v-if="errorText" class="g-image__error-text">
          {{ errorText }}
        </span>

        <!-- Retry Button -->
        <button
          v-if="showRetry"
          class="g-image__retry-btn"
          @click="handleRetry"
        >
          <svg
            class="g-image__retry-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z"
              fill="currentColor"
            />
          </svg>
          Retry
        </button>
      </div>

      <!-- Corner accents for error state -->
      <span v-if="showCorners" class="g-image__corner g-image__corner--tl"></span>
      <span v-if="showCorners" class="g-image__corner g-image__corner--tr"></span>
      <span v-if="showCorners" class="g-image__corner g-image__corner--bl"></span>
      <span v-if="showCorners" class="g-image__corner g-image__corner--br"></span>
    </div>

    <!-- Loading overlay (optional, for progressive loading) -->
    <div v-if="isLoading && !showSkeleton" class="g-image__loading-overlay">
      <div class="g-image__spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'


defineOptions({
  name: 'GImage'
})

const props = defineProps({
  // Image source
  src: {
    type: String,
    required: true
  },
  // Fallback image if src fails
  fallbackSrc: {
    type: String,
    default: null
  },
  // Alt text for accessibility
  alt: {
    type: String,
    default: 'Image'
  },
  // Dimensions
  width: {
    type: [String, Number],
    default: null
  },
  height: {
    type: [String, Number],
    default: null
  },
  aspectRatio: {
    type: String,
    default: null
  },
  // Object fit (how image fills container)
  fit: {
    type: String,
    default: 'cover',
    validator: (value) => ['contain', 'cover', 'fill', 'none', 'scale-down'].includes(value)
  },
  // Styling
  rounded: {
    type: Boolean,
    default: false
  },
  // Skeleton options
  showSkeleton: {
    type: Boolean,
    default: true
  },
  skeletonAnimation: {
    type: String,
    default: 'shimmer',
    validator: (value) => ['pulse', 'wave', 'shimmer', 'scan', 'glitch', 'none'].includes(value)
  },
  showCorners: {
    type: Boolean,
    default: false
  },
  // Error handling
  errorText: {
    type: String,
    default: 'Failed to load image'
  },
  showRetry: {
    type: Boolean,
    default: true
  },
  // Loading behavior
  lazyLoad: {
    type: Boolean,
    default: true
  },
  fadeIn: {
    type: Boolean,
    default: true
  },
  // Intersection Observer options (for lazy loading)
  rootMargin: {
    type: String,
    default: '50px'
  },
  threshold: {
    type: Number,
    default: 0.01
  },
  // Retry options
  maxRetries: {
    type: Number,
    default: 3
  },
  retryDelay: {
    type: Number,
    default: 1000
  }
})

const emit = defineEmits(['load', 'error', 'retry'])

// State
const imageRef = ref(null)
const isLoading = ref(true)
const isLoaded = ref(false)
const hasError = ref(false)
const retryCount = ref(0)
const currentSrc = ref(props.src)
const observer = ref(null)

// Computed
const imageContainerStyle = computed(() => {
  const style = {}

  if (props.width !== null) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  if (props.height !== null) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  if (props.aspectRatio) {
    style.aspectRatio = props.aspectRatio
  }

  return style
})

// Methods
const handleLoad = () => {
  isLoading.value = false
  isLoaded.value = true
  hasError.value = false
  retryCount.value = 0
  emit('load', { src: currentSrc.value })
}

const handleError = () => {
  isLoading.value = false
  isLoaded.value = false

  // Try fallback image first
  if (props.fallbackSrc && currentSrc.value !== props.fallbackSrc) {
    currentSrc.value = props.fallbackSrc
    return
  }

  // Try retry if available
  if (retryCount.value < props.maxRetries) {
    setTimeout(() => {
      retryCount.value++
      currentSrc.value = `${props.src}?retry=${retryCount.value}`
    }, props.retryDelay)
    return
  }

  // Show error state
  hasError.value = true
  emit('error', { src: currentSrc.value, retries: retryCount.value })
}

const handleRetry = () => {
  hasError.value = false
  isLoading.value = true
  retryCount.value = 0
  currentSrc.value = `${props.src}?retry=${Date.now()}`
  emit('retry', { src: currentSrc.value })
}

const setupIntersectionObserver = () => {
  if (!props.lazyLoad || !imageRef.value) return

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Image is in viewport, browser will load it
          observer.value?.disconnect()
        }
      })
    },
    {
      rootMargin: props.rootMargin,
      threshold: props.threshold
    }
  )

  observer.value.observe(imageRef.value)
}

// Watchers
watch(() => props.src, (newSrc) => {
  if (newSrc !== currentSrc.value) {
    isLoading.value = true
    isLoaded.value = false
    hasError.value = false
    retryCount.value = 0
    currentSrc.value = newSrc
  }
})

// Lifecycle
onMounted(() => {
  setupIntersectionObserver()
})

onBeforeUnmount(() => {
  observer.value?.disconnect()
})
</script>

<style src="./GImage.css" scoped/>
