<template>
  <Teleport to="body">
    <Transition name="g-modal-fade">
      <div
        v-if="isOpen || eager"
        v-show="isOpen"
        class="g-modal"
        :class="[
          `g-modal--${variant}`,
          `g-modal--${size}`,
          {
            'g-modal--fullscreen': fullscreen,
            'g-modal--scrollable': scrollable
          }
        ]"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="contentId"
        @keydown.esc="onEscKey"
      >
        <!-- Overlay -->
        <div
          class="g-modal__overlay"
          :style="{ opacity: overlayOpacity }"
          @click="onOverlayClick"
        >
          <!-- Scanlines effect -->
          <div class="g-modal__scanlines"></div>
        </div>

        <!-- Dialog container -->
        <div class="g-modal__container" ref="containerRef">
          <Transition name="g-modal-dialog">
            <div
              v-if="isOpen"
              class="g-modal__dialog"
              :style="dialogStyle"
              ref="dialogRef"
              tabindex="-1"
            >
              <!-- Corner accents -->
              <span class="g-modal__corner g-modal__corner--tl"></span>
              <span class="g-modal__corner g-modal__corner--tr"></span>
              <span class="g-modal__corner g-modal__corner--bl"></span>
              <span class="g-modal__corner g-modal__corner--br"></span>

              <!-- Border glow -->
              <span class="g-modal__border-glow"></span>

              <!-- Header -->
              <header v-if="!noHeader" class="g-modal__header">
                <slot name="header">
                  <div class="g-modal__header-content">
                    <!-- Status indicator -->
                    <span class="g-modal__status-indicator"></span>

                    <!-- Title -->
                    <h2 :id="titleId" class="g-modal__title">
                      <slot name="title">{{ title }}</slot>
                    </h2>

                    <!-- Header actions -->
                    <div class="g-modal__header-actions">
                      <slot name="header-actions"></slot>

                      <!-- Close button -->
                      <button
                        v-if="closeButton"
                        type="button"
                        class="g-modal__close"
                        aria-label="Close"
                        @click="close"
                      >
                        <slot name="close-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </slot>
                      </button>
                    </div>
                  </div>

                  <!-- Header decoration line -->
                  <div class="g-modal__header-line">
                    <span class="g-modal__header-line-glow"></span>
                  </div>
                </slot>
              </header>

              <!-- Content -->
              <div
                :id="contentId"
                class="g-modal__content"
                :class="{ 'g-modal__content--no-header': noHeader, 'g-modal__content--no-footer': noFooter }"
                ref="contentRef"
              >
                <slot></slot>
              </div>

              <!-- Footer -->
              <footer v-if="!noFooter && ($slots.footer || $slots.actions)" class="g-modal__footer">
                <slot name="footer">
                  <!-- Footer decoration line -->
                  <div class="g-modal__footer-line">
                    <span class="g-modal__footer-line-glow"></span>
                  </div>

                  <div
                    class="g-modal__footer-content"
                    :class="`g-modal__footer-content--${actionsAlign}`"
                  >
                    <slot name="actions"></slot>
                  </div>
                </slot>
              </footer>

              <!-- Ambient scan effect -->
              <div class="g-modal__scan-effect"></div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'GModal'
})

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'SYSTEM DIALOG'
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'danger', 'warning', 'success', 'creep'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'xlarge'].includes(value)
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  width: {
    type: [String, Number],
    default: null
  },
  maxWidth: {
    type: [String, Number],
    default: null
  },
  maxHeight: {
    type: [String, Number],
    default: null
  },
  persistent: {
    type: Boolean,
    default: false
  },
  noHeader: {
    type: Boolean,
    default: false
  },
  noFooter: {
    type: Boolean,
    default: false
  },
  closeButton: {
    type: Boolean,
    default: true
  },
  overlayOpacity: {
    type: Number,
    default: 0.85
  },
  scrollable: {
    type: Boolean,
    default: true
  },
  retainFocus: {
    type: Boolean,
    default: true
  },
  eager: {
    type: Boolean,
    default: false
  },
  actionsAlign: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'center', 'right', 'space-between'].includes(value)
  },
  zIndex: {
    type: Number,
    default: 1000
  }
})

const emit = defineEmits([
  'update:modelValue',
  'open',
  'close',
  'before-open',
  'before-close',
  'after-open',
  'after-close',
  'click-outside'
])

// Refs
const containerRef = ref(null)
const dialogRef = ref(null)
const contentRef = ref(null)
const previousActiveElement = ref(null)

// State
const isOpen = ref(props.modelValue)
const isClosing = ref(false)

// Unique IDs
let idCounter = 0
const uniqueId = ++idCounter
const titleId = computed(() => `g-modal-title-${uniqueId}`)
const contentId = computed(() => `g-modal-content-${uniqueId}`)

// Computed
const dialogStyle = computed(() => {
  const style = {}

  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  if (props.maxWidth) {
    style.maxWidth = typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth
  }

  if (props.maxHeight) {
    style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  }

  return style
})

// Stack management for nested modals
const modalStack = []

const addToStack = () => {
  modalStack.push(uniqueId)
  updateBodyScroll()
}

const removeFromStack = () => {
  const index = modalStack.indexOf(uniqueId)
  if (index > -1) {
    modalStack.splice(index, 1)
  }
  updateBodyScroll()
}

const isTopModal = () => {
  return modalStack[modalStack.length - 1] === uniqueId
}

const updateBodyScroll = () => {
  if (modalStack.length > 0) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Methods
const open = async () => {
  if (isOpen.value) return

  emit('before-open')
  previousActiveElement.value = document.activeElement

  isOpen.value = true
  emit('update:modelValue', true)
  addToStack()

  await nextTick()

  // Focus the dialog
  if (dialogRef.value && props.retainFocus) {
    dialogRef.value.focus()
  }

  emit('open')

  // Emit after-open after transition
  setTimeout(() => {
    emit('after-open')
  }, 300)
}

const close = async () => {
  if (!isOpen.value || isClosing.value) return

  emit('before-close')
  isClosing.value = true

  isOpen.value = false
  emit('update:modelValue', false)
  removeFromStack()

  emit('close')

  // Restore focus
  if (previousActiveElement.value && props.retainFocus) {
    previousActiveElement.value.focus()
  }

  // Emit after-close after transition
  setTimeout(() => {
    isClosing.value = false
    emit('after-close')
  }, 300)
}

const onOverlayClick = () => {
  emit('click-outside')

  if (!props.persistent) {
    close()
  } else {
    // Shake effect for persistent modal
    if (dialogRef.value) {
      dialogRef.value.classList.add('g-modal__dialog--shake')
      setTimeout(() => {
        dialogRef.value?.classList.remove('g-modal__dialog--shake')
      }, 300)
    }
  }
}

const onEscKey = (e) => {
  if (!isTopModal()) return

  if (!props.persistent) {
    close()
  } else {
    // Shake effect
    if (dialogRef.value) {
      dialogRef.value.classList.add('g-modal__dialog--shake')
      setTimeout(() => {
        dialogRef.value?.classList.remove('g-modal__dialog--shake')
      }, 300)
    }
  }
}

// Focus trap
const trapFocus = (e) => {
  if (!isOpen.value || !dialogRef.value || !props.retainFocus) return
  if (!isTopModal()) return

  const focusableElements = dialogRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  if (focusableElements.length === 0) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (e.shiftKey && document.activeElement === firstElement) {
    e.preventDefault()
    lastElement.focus()
  } else if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault()
    firstElement.focus()
  }
}

// Watchers
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    open()
  } else {
    close()
  }
})

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && isOpen.value) {
      trapFocus(e)
    }
  })

  if (props.modelValue) {
    open()
  }
})

onBeforeUnmount(() => {
  removeFromStack()
})

// Expose
defineExpose({
  open,
  close,
  dialogRef,
  contentRef
})
</script>

<style src="./GModal.css" scoped/>
