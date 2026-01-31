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

<style scoped>
/* ============================================
   G-MODAL
   Space Horror UI Component
   ============================================ */

.g-modal {
  position: fixed;
  inset: 0;
  z-index: v-bind(zIndex);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* --------------------------------------------
   OVERLAY
   -------------------------------------------- */

.g-modal__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 12, 16, 0.95) 0%,
    rgba(15, 18, 24, 0.9) 50%,
    rgba(10, 12, 16, 0.95) 100%
  );
  backdrop-filter: blur(4px);
}

/* Scanlines on overlay */
.g-modal__scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  pointer-events: none;
  opacity: 0.5;
}

/* --------------------------------------------
   CONTAINER
   -------------------------------------------- */

.g-modal__container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* --------------------------------------------
   DIALOG
   -------------------------------------------- */

.g-modal__dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 48px);

  background-color: var(--modal-bg, #0a0c10);
  border: 1px solid var(--modal-border, #2a3444);
  box-shadow:
    0 0 60px var(--modal-glow, rgba(0, 212, 212, 0.1)),
    0 25px 50px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);

  pointer-events: auto;
  outline: none;
  overflow: hidden;
}

.g-modal__dialog--shake {
  animation: g-modal-shake 0.3s ease;
}

@keyframes g-modal-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

/* --------------------------------------------
   CORNER ACCENTS
   -------------------------------------------- */

.g-modal__corner {
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
  z-index: 10;
}

.g-modal__corner::before,
.g-modal__corner::after {
  content: '';
  position: absolute;
  background-color: var(--modal-accent, #00d4d4);
  transition: all 0.3s ease;
}

.g-modal__corner--tl {
  top: -1px;
  left: -1px;
}
.g-modal__corner--tl::before {
  top: 0;
  left: 0;
  width: 20px;
  height: 2px;
}
.g-modal__corner--tl::after {
  top: 0;
  left: 0;
  width: 2px;
  height: 20px;
}

.g-modal__corner--tr {
  top: -1px;
  right: -1px;
}
.g-modal__corner--tr::before {
  top: 0;
  right: 0;
  width: 20px;
  height: 2px;
}
.g-modal__corner--tr::after {
  top: 0;
  right: 0;
  width: 2px;
  height: 20px;
}

.g-modal__corner--bl {
  bottom: -1px;
  left: -1px;
}
.g-modal__corner--bl::before {
  bottom: 0;
  left: 0;
  width: 20px;
  height: 2px;
}
.g-modal__corner--bl::after {
  bottom: 0;
  left: 0;
  width: 2px;
  height: 20px;
}

.g-modal__corner--br {
  bottom: -1px;
  right: -1px;
}
.g-modal__corner--br::before {
  bottom: 0;
  right: 0;
  width: 20px;
  height: 2px;
}
.g-modal__corner--br::after {
  bottom: 0;
  right: 0;
  width: 2px;
  height: 20px;
}

/* --------------------------------------------
   BORDER GLOW
   -------------------------------------------- */

.g-modal__border-glow {
  position: absolute;
  inset: -1px;
  border: 1px solid transparent;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.g-modal__dialog:hover .g-modal__border-glow {
  opacity: 1;
  box-shadow: 0 0 20px var(--modal-glow, rgba(0, 212, 212, 0.2));
}

/* --------------------------------------------
   HEADER
   -------------------------------------------- */

.g-modal__header {
  flex-shrink: 0;
  padding: 16px 20px 0 20px;
}

.g-modal__header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.g-modal__status-indicator {
  width: 8px;
  height: 8px;
  background-color: var(--modal-accent, #00d4d4);
  box-shadow: 0 0 8px var(--modal-accent, #00d4d4);
  animation: g-modal-pulse 2s ease-in-out infinite;
}

@keyframes g-modal-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.g-modal__title {
  flex: 1;
  margin: 0;

  font-family: 'Bebas Neue', 'Arial Black', sans-serif;
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--modal-title, #e0e4ea);
}

.g-modal__header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Close button */
.g-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;

  background: transparent;
  border: 1px solid var(--modal-border, #2a3444);
  color: var(--modal-text-muted, #505868);
  cursor: pointer;
  transition: all 0.15s ease;
}

.g-modal__close:hover {
  background-color: rgba(255, 51, 68, 0.1);
  border-color: #ff3344;
  color: #ff3344;
}

.g-modal__close:focus-visible {
  outline: none;
  border-color: var(--modal-accent, #00d4d4);
  box-shadow: 0 0 0 1px var(--modal-accent, #00d4d4);
}

.g-modal__close svg {
  width: 16px;
  height: 16px;
}

/* Header decoration line */
.g-modal__header-line {
  position: relative;
  height: 1px;
  margin-top: 16px;
  background: linear-gradient(
    90deg,
    var(--modal-accent, #00d4d4),
    var(--modal-border, #2a3444) 30%,
    var(--modal-border, #2a3444) 70%,
    var(--modal-accent, #00d4d4)
  );
}

.g-modal__header-line-glow {
  position: absolute;
  top: -2px;
  left: 0;
  width: 60px;
  height: 5px;
  background: linear-gradient(
    90deg,
    var(--modal-accent, #00d4d4),
    transparent
  );
  opacity: 0.5;
  filter: blur(2px);
}

/* --------------------------------------------
   CONTENT
   -------------------------------------------- */

.g-modal__content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;

  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
  color: var(--modal-text, #e0e4ea);
}

.g-modal__content--no-header {
  padding-top: 24px;
}

.g-modal__content--no-footer {
  padding-bottom: 24px;
}

.g-modal--scrollable .g-modal__content {
  overflow-y: auto;
}

/* Scrollbar */
.g-modal__content::-webkit-scrollbar {
  width: 6px;
}

.g-modal__content::-webkit-scrollbar-track {
  background: var(--modal-bg, #0a0c10);
}

.g-modal__content::-webkit-scrollbar-thumb {
  background: var(--modal-border, #2a3444);
  border-radius: 3px;
}

.g-modal__content::-webkit-scrollbar-thumb:hover {
  background: var(--modal-accent, #00d4d4);
}

/* --------------------------------------------
   FOOTER
   -------------------------------------------- */

.g-modal__footer {
  flex-shrink: 0;
  padding: 0 20px 16px 20px;
}

/* Footer decoration line */
.g-modal__footer-line {
  position: relative;
  height: 1px;
  margin-bottom: 16px;
  background: linear-gradient(
    90deg,
    var(--modal-accent, #00d4d4),
    var(--modal-border, #2a3444) 30%,
    var(--modal-border, #2a3444) 70%,
    var(--modal-accent, #00d4d4)
  );
}

.g-modal__footer-line-glow {
  position: absolute;
  top: -2px;
  right: 0;
  width: 60px;
  height: 5px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--modal-accent, #00d4d4)
  );
  opacity: 0.5;
  filter: blur(2px);
}

.g-modal__footer-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.g-modal__footer-content--left {
  justify-content: flex-start;
}

.g-modal__footer-content--center {
  justify-content: center;
}

.g-modal__footer-content--right {
  justify-content: flex-end;
}

.g-modal__footer-content--space-between {
  justify-content: space-between;
}

/* --------------------------------------------
   SCAN EFFECT
   -------------------------------------------- */

.g-modal__scan-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--modal-accent, #00d4d4),
    transparent
  );
  opacity: 0;
  pointer-events: none;
  animation: g-modal-scan 4s ease-in-out infinite;
}

@keyframes g-modal-scan {
  0% {
    top: 0;
    opacity: 0;
  }
  5% {
    opacity: 0.6;
  }
  95% {
    opacity: 0.6;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

/* --------------------------------------------
   SIZES
   -------------------------------------------- */

.g-modal--small .g-modal__dialog {
  width: 360px;
}

.g-modal--medium .g-modal__dialog {
  width: 500px;
}

.g-modal--large .g-modal__dialog {
  width: 700px;
}

.g-modal--xlarge .g-modal__dialog {
  width: 900px;
}

.g-modal--fullscreen .g-modal__dialog {
  width: calc(100vw - 48px);
  height: calc(100vh - 48px);
  max-height: none;
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Default (Cyan) */
.g-modal--default {
  --modal-bg: #0a0c10;
  --modal-border: #2a3444;
  --modal-accent: #00d4d4;
  --modal-glow: rgba(0, 212, 212, 0.15);
  --modal-title: #e0e4ea;
  --modal-text: #e0e4ea;
  --modal-text-muted: #505868;
}

/* Primary (Strong Cyan) */
.g-modal--primary {
  --modal-bg: #0a0c10;
  --modal-border: rgba(0, 212, 212, 0.3);
  --modal-accent: #00d4d4;
  --modal-glow: rgba(0, 212, 212, 0.25);
  --modal-title: #00d4d4;
  --modal-text: #e0e4ea;
  --modal-text-muted: #007070;
}

.g-modal--primary .g-modal__dialog {
  border-color: rgba(0, 212, 212, 0.3);
}

/* Danger (Red) */
.g-modal--danger {
  --modal-bg: #0a0c10;
  --modal-border: rgba(255, 51, 68, 0.3);
  --modal-accent: #ff3344;
  --modal-glow: rgba(255, 51, 68, 0.2);
  --modal-title: #ff3344;
  --modal-text: #e0e4ea;
  --modal-text-muted: #992233;
}

.g-modal--danger .g-modal__dialog {
  border-color: rgba(255, 51, 68, 0.3);
}

.g-modal--danger .g-modal__status-indicator {
  animation: g-modal-danger-pulse 0.5s ease-in-out infinite;
}

@keyframes g-modal-danger-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Warning (Orange) */
.g-modal--warning {
  --modal-bg: #0a0c10;
  --modal-border: rgba(255, 153, 34, 0.3);
  --modal-accent: #ff9922;
  --modal-glow: rgba(255, 153, 34, 0.2);
  --modal-title: #ff9922;
  --modal-text: #e0e4ea;
  --modal-text-muted: #996611;
}

.g-modal--warning .g-modal__dialog {
  border-color: rgba(255, 153, 34, 0.3);
}

/* Success (Green) */
.g-modal--success {
  --modal-bg: #0a0c10;
  --modal-border: rgba(0, 204, 102, 0.3);
  --modal-accent: #00cc66;
  --modal-glow: rgba(0, 204, 102, 0.2);
  --modal-title: #00cc66;
  --modal-text: #e0e4ea;
  --modal-text-muted: #007744;
}

.g-modal--success .g-modal__dialog {
  border-color: rgba(0, 204, 102, 0.3);
}

/* Creep (Purple - Horror/Anomaly) */
.g-modal--creep {
  --modal-bg: #0a0c10;
  --modal-border: rgba(136, 68, 170, 0.3);
  --modal-accent: #8844aa;
  --modal-glow: rgba(136, 68, 170, 0.25);
  --modal-title: #8844aa;
  --modal-text: #e0e4ea;
  --modal-text-muted: #553366;
}

.g-modal--creep .g-modal__dialog {
  border-color: rgba(136, 68, 170, 0.3);
}

.g-modal--creep .g-modal__scan-effect {
  animation: g-modal-creep-scan 3s ease-in-out infinite;
}

@keyframes g-modal-creep-scan {
  0% {
    top: 0;
    opacity: 0;
  }
  5% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.3;
  }
  95% {
    opacity: 0.8;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

/* --------------------------------------------
   TRANSITIONS
   -------------------------------------------- */

/* Fade transition for modal container */
.g-modal-fade-enter-active,
.g-modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.g-modal-fade-enter-from,
.g-modal-fade-leave-to {
  opacity: 0;
}

/* Dialog transition */
.g-modal-dialog-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.g-modal-dialog-leave-active {
  transition: all 0.2s ease-in;
}

.g-modal-dialog-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

.g-modal-dialog-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* --------------------------------------------
   RESPONSIVE
   -------------------------------------------- */

@media (max-width: 600px) {
  .g-modal {
    padding: 16px;
  }

  .g-modal--small .g-modal__dialog,
  .g-modal--medium .g-modal__dialog,
  .g-modal--large .g-modal__dialog,
  .g-modal--xlarge .g-modal__dialog {
    width: 100%;
    max-width: 100%;
  }

  .g-modal__title {
    font-size: 16px;
  }

  .g-modal__content {
    font-size: 13px;
  }
}
</style>
