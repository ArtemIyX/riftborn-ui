<template>
  <div
    class="ue-image"
    :class="[
      `ue-image--${fit}`,
      {
        'ue-image--loading': isLoading,
        'ue-image--error': hasError,
        'ue-image--loaded': isLoaded,
        'ue-image--rounded': rounded
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
      class="ue-image__img"
      :class="{ 'ue-image__img--fade-in': fadeIn && isLoaded }"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Error State -->
    <div v-if="hasError" class="ue-image__error">
      <div class="ue-image__error-content">
        <!-- Error Icon (UE style) -->
        <svg
          class="ue-image__error-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 22H22L12 2ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z"
            fill="currentColor"
          />
        </svg>

        <!-- Error Text -->
        <span v-if="errorText" class="ue-image__error-text">
          {{ errorText }}
        </span>

        <!-- Asset Path Display -->
        <span v-if="showAssetPath" class="ue-image__asset-path">
          {{ assetPath }}
        </span>

<!--        &lt;!&ndash; Retry Button &ndash;&gt;
        <button
          v-if="showRetry"
          class="ue-image__retry-btn"
          @click="handleRetry"
        >
          <svg
            class="ue-image__retry-icon"
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
        </button>-->
      </div>

      <!-- Corner accents for error state -->
      <span v-if="showCorners" class="ue-image__corner ue-image__corner--tl"></span>
      <span v-if="showCorners" class="ue-image__corner ue-image__corner--tr"></span>
      <span v-if="showCorners" class="ue-image__corner ue-image__corner--bl"></span>
      <span v-if="showCorners" class="ue-image__corner ue-image__corner--br"></span>
    </div>

    <!-- Loading overlay (optional, for progressive loading) -->
    <div v-if="isLoading && !showSkeleton" class="ue-image__loading-overlay">
      <div class="ue-image__spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import {useUnrealStore} from "@/stores/useUnrealStore.js";

defineOptions({
  name: 'UEImage'
})

const props = defineProps({
  // Unreal Engine asset path (e.g., "Game/Images/MyImage" or "/Game/Textures/UI/Icon")
  assetPath: {
    type: String,
    required: true
  },
/*  // Query parameters to append
  queryParams: {
    type: Object,
    default: () => ({})
  },*/
  // Fallback asset path if primary fails
  fallbackAssetPath: {
    type: String,
    default: null
  },
  // Alt text for accessibility
  alt: {
    type: String,
    default: 'Unreal Engine Asset'
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
    default: 'Failed to load UE asset'
  },
/*  showRetry: {
    type: Boolean,
    default: true
  },*/
  showAssetPath: {
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
/*  // Retry options
  maxRetries: {
    type: Number,
    default: 3
  },
  retryDelay: {
    type: Number,
    default: 1000
  },*/
  // Image format/quality options
/*  format: {
    type: String,
    default: null,
    validator: (value) => !value || ['png', 'jpg', 'jpeg', 'webp'].includes(value)
  },*/
 /* quality: {
    type: Number,
    default: null,
    validator: (value) => !value || (value >= 1 && value <= 100)
  },*/
  // Cache control
/*  noCache: {
    type: Boolean,
    default: false
  }*/
})

const emit = defineEmits(['load', 'error', 'retry', 'path-change'])

// Pinia store
const UnrealStore = useUnrealStore();

// State
const imageRef = ref(null)
const isLoading = ref(true)
const isLoaded = ref(false)
const hasError = ref(false)
const retryCount = ref(0)
const currentSrc = ref('')
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

const buildImageUrl = (assetPath) => {


  // Use Pinia store to build URL
  return UnrealStore.BuildImageUrl(assetPath);
}

// Methods
const handleLoad = () => {
  isLoading.value = false
  isLoaded.value = true
  hasError.value = false
  retryCount.value = 0
  emit('load', {
    assetPath: props.assetPath,
    url: currentSrc.value
  })
}

const handleError = () => {
  isLoading.value = false
  isLoaded.value = false

  // Try fallback asset path first
  if (props.fallbackAssetPath && currentSrc.value !== buildImageUrl(props.fallbackAssetPath)) {
    currentSrc.value = buildImageUrl(props.fallbackAssetPath)
    return
  }

/*  // Try retry if available
  if (retryCount.value < props.maxRetries) {
    setTimeout(() => {
      retryCount.value++
      currentSrc.value = buildImageUrl(props.assetPath, true)
    }, props.retryDelay)
    return
  }*/

  // Show error state
  hasError.value = true
  emit('error', {
    assetPath: props.assetPath,
    url: currentSrc.value,
    retries: retryCount.value
  })
}

/*const handleRetry = () => {
  hasError.value = false
  isLoading.value = true
  retryCount.value = 0
  currentSrc.value = buildImageUrl(props.assetPath, true)
  emit('retry', {
    assetPath: props.assetPath,
    url: currentSrc.value
  })
}*/

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
watch(() => props.assetPath, (newPath) => {
  isLoading.value = true
  isLoaded.value = false
  hasError.value = false
  retryCount.value = 0
  currentSrc.value = buildImageUrl(newPath)
  emit('path-change', { assetPath: newPath })
})

/*watch(() => [props.format, props.quality, props.queryParams], () => {
  // Rebuild URL when params change
  if (!hasError.value) {
    currentSrc.value = buildImageUrl(props.assetPath)
  }
}, { deep: true })*/

// Watch store changes to rebuild URL
watch(() => UnrealStore.BaseUrl, () => {
  if (!hasError.value && !isLoading.value) {
    // Store configuration changed, rebuild URL
    currentSrc.value = buildImageUrl(props.assetPath)
  }
})

// Lifecycle
onMounted(() => {
  // Initialize the image URL using Pinia store
  currentSrc.value = buildImageUrl(props.assetPath)

  console.warn(`Loading image from ${currentSrc.value}`);
  setupIntersectionObserver()
})

onBeforeUnmount(() => {
  observer.value?.disconnect()
})
</script>

<style src="./UImage.css" scoped/>
