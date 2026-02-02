<template>
  <div
    class="g-card"
    :class="[
      `g-card--${variant}`,
      `g-card--${size}`,
      {
        'g-card--collapsible': collapsible,
        'g-card--collapsed': isCollapsed,
        'g-card--loading': loading,
        'g-card--hoverable': hoverable,
        'g-card--flat': flat,
        'g-card--outlined': outlined,
        'g-card--disabled': disabled,
        'g-card--active': active
      }
    ]"
  >
    <!-- Corner accents -->
    <span v-if="!flat" class="g-card__corner g-card__corner--tl"></span>
    <span v-if="!flat" class="g-card__corner g-card__corner--tr"></span>
    <span v-if="!flat" class="g-card__corner g-card__corner--bl"></span>
    <span v-if="!flat" class="g-card__corner g-card__corner--br"></span>

    <!-- Media slot (top) -->
    <div v-if="$slots.media" class="g-card__media">
      <slot name="media"></slot>
      <div class="g-card__media-overlay"></div>
    </div>

    <!-- Header -->
    <header
      v-if="!noHeader && (title || $slots.header || $slots.title || $slots['header-actions'])"
      class="g-card__header"
      :class="{ 'g-card__header--clickable': collapsible }"
      @click="onHeaderClick"
    >
      <slot name="header">
        <div class="g-card__header-content">
          <!-- Status indicator -->
          <span v-if="showStatus" class="g-card__status">
            <span class="g-card__status-dot"></span>
          </span>

          <!-- Icon -->
          <span v-if="$slots.icon" class="g-card__icon">
            <slot name="icon"></slot>
          </span>

          <!-- Title area -->
          <div class="g-card__title-wrapper">
            <h3 class="g-card__title">
              <slot name="title">{{ title }}</slot>
            </h3>
            <p v-if="subtitle" class="g-card__subtitle">{{ subtitle }}</p>
          </div>

          <!-- Header actions -->
          <div v-if="$slots['header-actions'] || collapsible" class="g-card__header-actions">
            <slot name="header-actions"></slot>

            <!-- Collapse toggle -->
            <button
              v-if="collapsible"
              type="button"
              class="g-card__collapse-btn"
              :aria-expanded="!isCollapsed"
              aria-label="Toggle content"
              @click.stop="toggle"
            >
              <svg
                class="g-card__collapse-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Header divider -->
        <div class="g-card__header-divider">
          <span class="g-card__header-divider-glow"></span>
        </div>
      </slot>
    </header>

    <!-- Content -->
    <Transition name="g-card-collapse">
      <div
        v-show="!isCollapsed"
        class="g-card__body"
        ref="bodyRef"
      >
        <div class="g-card__content">
          <slot></slot>
        </div>

        <!-- Footer -->
        <footer v-if="$slots.footer" class="g-card__footer">
          <div class="g-card__footer-divider">
            <span class="g-card__footer-divider-glow"></span>
          </div>
          <div class="g-card__footer-content">
            <slot name="footer"></slot>
          </div>
        </footer>
      </div>
    </Transition>

    <!-- Loading overlay -->
    <Transition name="g-card-fade">
      <div v-if="loading" class="g-card__loading">
        <div class="g-card__loading-bar"></div>
        <span class="g-card__loading-text">{{ loadingText }}</span>
      </div>
    </Transition>

    <!-- Active scan effect -->
    <div v-if="active" class="g-card__scan-line"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

defineOptions({
  name: 'GCard'
})

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'danger', 'warning', 'success', 'creep', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['compact', 'default', 'relaxed'].includes(value)
  },
  collapsible: {
    type: Boolean,
    default: false
  },
  collapsed: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'LOADING...'
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  flat: {
    type: Boolean,
    default: false
  },
  outlined: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  },
  showStatus: {
    type: Boolean,
    default: false
  },
  noHeader: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:collapsed', 'collapse', 'expand'])

// Refs
const bodyRef = ref(null)

// State
const isCollapsed = ref(props.collapsed)

// Methods
const toggle = () => {
  if (props.disabled) return

  isCollapsed.value = !isCollapsed.value
  emit('update:collapsed', isCollapsed.value)

  if (isCollapsed.value) {
    emit('collapse')
  } else {
    emit('expand')
  }
}

const expand = () => {
  if (!isCollapsed.value) return
  isCollapsed.value = false
  emit('update:collapsed', false)
  emit('expand')
}

const collapse = () => {
  if (isCollapsed.value) return
  isCollapsed.value = true
  emit('update:collapsed', true)
  emit('collapse')
}

const onHeaderClick = () => {
  if (props.collapsible) {
    toggle()
  }
}

// Watchers
watch(() => props.collapsed, (newVal) => {
  isCollapsed.value = newVal
})

// Expose
defineExpose({
  toggle,
  expand,
  collapse,
  isCollapsed
})
</script>

<style src="./GCard.css" scoped/>

