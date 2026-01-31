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

<style scoped>
/* ============================================
   G-CARD
   Space Horror UI Component
   ============================================ */

.g-card {
  position: relative;
  display: flex;
  flex-direction: column;

  background-color: var(--card-bg, #0f1218);
  border: 1px solid var(--card-border, #2a3444);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

/* --------------------------------------------
   CORNER ACCENTS
   -------------------------------------------- */

.g-card__corner {
  position: absolute;
  width: 12px;
  height: 12px;
  pointer-events: none;
  z-index: 5;
  transition: all 0.2s ease;
}

.g-card__corner::before,
.g-card__corner::after {
  content: '';
  position: absolute;
  background-color: var(--card-accent, #00d4d4);
  transition: background-color 0.2s ease;
}

.g-card__corner--tl {
  top: -1px;
  left: -1px;
}
.g-card__corner--tl::before {
  top: 0;
  left: 0;
  width: 12px;
  height: 1px;
}
.g-card__corner--tl::after {
  top: 0;
  left: 0;
  width: 1px;
  height: 12px;
}

.g-card__corner--tr {
  top: -1px;
  right: -1px;
}
.g-card__corner--tr::before {
  top: 0;
  right: 0;
  width: 12px;
  height: 1px;
}
.g-card__corner--tr::after {
  top: 0;
  right: 0;
  width: 1px;
  height: 12px;
}

.g-card__corner--bl {
  bottom: -1px;
  left: -1px;
}
.g-card__corner--bl::before {
  bottom: 0;
  left: 0;
  width: 12px;
  height: 1px;
}
.g-card__corner--bl::after {
  bottom: 0;
  left: 0;
  width: 1px;
  height: 12px;
}

.g-card__corner--br {
  bottom: -1px;
  right: -1px;
}
.g-card__corner--br::before {
  bottom: 0;
  right: 0;
  width: 12px;
  height: 1px;
}
.g-card__corner--br::after {
  bottom: 0;
  right: 0;
  width: 1px;
  height: 12px;
}

/* --------------------------------------------
   MEDIA
   -------------------------------------------- */

.g-card__media {
  position: relative;
  overflow: hidden;
  line-height: 0;
}

.g-card__media img,
.g-card__media video {
  width: 100%;
  height: auto;
  display: block;
}

.g-card__media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 60%,
    var(--card-bg, #0f1218) 100%
  );
  pointer-events: none;
}

/* --------------------------------------------
   HEADER
   -------------------------------------------- */

.g-card__header {
  flex-shrink: 0;
}

.g-card__header--clickable {
  cursor: pointer;
}

.g-card__header--clickable:hover .g-card__title {
  color: var(--card-accent, #00d4d4);
}

.g-card__header-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Status indicator */
.g-card__status {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.g-card__status-dot {
  width: 6px;
  height: 6px;
  background-color: var(--card-accent, #00d4d4);
  box-shadow: 0 0 6px var(--card-accent, #00d4d4);
  animation: g-card-status-pulse 2s ease-in-out infinite;
}

@keyframes g-card-status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Icon */
.g-card__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--card-accent, #00d4d4);
}

.g-card__icon svg {
  width: 100%;
  height: 100%;
}

/* Title */
.g-card__title-wrapper {
  flex: 1;
  min-width: 0;
}

.g-card__title {
  margin: 0;

  font-family: 'Bebas Neue', 'Arial Black', sans-serif;
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--card-title, #e0e4ea);

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  transition: color 0.15s ease;
}

.g-card__subtitle {
  margin: 2px 0 0 0;

  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--card-text-muted, #505868);

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Header actions */
.g-card__header-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Collapse button */
.g-card__collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;

  background: transparent;
  border: 1px solid var(--card-border, #2a3444);
  color: var(--card-text-muted, #505868);
  cursor: pointer;

  transition: all 0.15s ease;
}

.g-card__collapse-btn:hover {
  border-color: var(--card-accent, #00d4d4);
  color: var(--card-accent, #00d4d4);
}

.g-card__collapse-btn:focus-visible {
  outline: none;
  border-color: var(--card-accent, #00d4d4);
  box-shadow: 0 0 0 1px var(--card-accent, #00d4d4);
}

.g-card__collapse-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.g-card--collapsed .g-card__collapse-icon {
  transform: rotate(-90deg);
}

/* Header divider */
.g-card__header-divider {
  position: relative;
  height: 1px;
  margin-top: 12px;
  background: linear-gradient(
    90deg,
    var(--card-accent, #00d4d4),
    var(--card-border, #2a3444) 25%,
    var(--card-border, #2a3444) 75%,
    var(--card-accent, #00d4d4)
  );
}

.g-card__header-divider-glow {
  position: absolute;
  top: -2px;
  left: 0;
  width: 40px;
  height: 5px;
  background: linear-gradient(
    90deg,
    var(--card-accent, #00d4d4),
    transparent
  );
  opacity: 0.4;
  filter: blur(2px);
}

/* --------------------------------------------
   BODY & CONTENT
   -------------------------------------------- */

.g-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.g-card__content {
  flex: 1;

  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--card-text, #e0e4ea);
}

/* --------------------------------------------
   FOOTER
   -------------------------------------------- */

.g-card__footer {
  flex-shrink: 0;
}

.g-card__footer-divider {
  position: relative;
  height: 1px;
  margin-bottom: 12px;
  background: linear-gradient(
    90deg,
    var(--card-accent, #00d4d4),
    var(--card-border, #2a3444) 25%,
    var(--card-border, #2a3444) 75%,
    var(--card-accent, #00d4d4)
  );
}

.g-card__footer-divider-glow {
  position: absolute;
  top: -2px;
  right: 0;
  width: 40px;
  height: 5px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--card-accent, #00d4d4)
  );
  opacity: 0.4;
  filter: blur(2px);
}

.g-card__footer-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* --------------------------------------------
   LOADING
   -------------------------------------------- */

.g-card__loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  background-color: rgba(10, 12, 16, 0.9);
  backdrop-filter: blur(2px);
  z-index: 10;
}

.g-card__loading-bar {
  width: 60px;
  height: 3px;
  background-color: var(--card-border, #2a3444);
  overflow: hidden;
  position: relative;
}

.g-card__loading-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: -30px;
  width: 30px;
  height: 100%;
  background-color: var(--card-accent, #00d4d4);
  box-shadow: 0 0 10px var(--card-accent, #00d4d4);
  animation: g-card-loading-bar 1s ease-in-out infinite;
}

@keyframes g-card-loading-bar {
  0% { left: -30px; }
  100% { left: 60px; }
}

.g-card__loading-text {
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--card-accent, #00d4d4);
  animation: g-card-loading-text 1s ease-in-out infinite;
}

@keyframes g-card-loading-text {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* --------------------------------------------
   SCAN LINE (Active state)
   -------------------------------------------- */

.g-card__scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--card-accent, #00d4d4),
    transparent
  );
  opacity: 0.6;
  pointer-events: none;
  animation: g-card-scan 3s ease-in-out infinite;
}

@keyframes g-card-scan {
  0% { top: 0; opacity: 0; }
  5% { opacity: 0.6; }
  95% { opacity: 0.6; }
  100% { top: calc(100% - 2px); opacity: 0; }
}

/* --------------------------------------------
   SIZES
   -------------------------------------------- */

/* Compact */
.g-card--compact .g-card__header {
  padding: 10px 12px 0 12px;
}

.g-card--compact .g-card__header-divider {
  margin-top: 8px;
}

.g-card--compact .g-card__content {
  padding: 10px 12px;
}

.g-card--compact .g-card__footer {
  padding: 0 12px 10px 12px;
}

.g-card--compact .g-card__footer-divider {
  margin-bottom: 8px;
}

.g-card--compact .g-card__title {
  font-size: 14px;
}

.g-card--compact .g-card__content {
  font-size: 12px;
}

/* Default */
.g-card--default .g-card__header {
  padding: 14px 16px 0 16px;
}

.g-card--default .g-card__content {
  padding: 14px 16px;
}

.g-card--default .g-card__footer {
  padding: 0 16px 14px 16px;
}

/* Relaxed */
.g-card--relaxed .g-card__header {
  padding: 20px 24px 0 24px;
}

.g-card--relaxed .g-card__header-divider {
  margin-top: 16px;
}

.g-card--relaxed .g-card__content {
  padding: 20px 24px;
}

.g-card--relaxed .g-card__footer {
  padding: 0 24px 20px 24px;
}

.g-card--relaxed .g-card__footer-divider {
  margin-bottom: 16px;
}

.g-card--relaxed .g-card__title {
  font-size: 18px;
}

.g-card--relaxed .g-card__content {
  font-size: 14px;
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Default (Cyan) */
.g-card--default {
  --card-bg: #0f1218;
  --card-border: #2a3444;
  --card-accent: #00d4d4;
  --card-title: #e0e4ea;
  --card-text: #e0e4ea;
  --card-text-muted: #505868;
}

/* Primary */
.g-card--primary {
  --card-bg: rgba(0, 212, 212, 0.03);
  --card-border: rgba(0, 212, 212, 0.25);
  --card-accent: #00d4d4;
  --card-title: #00d4d4;
  --card-text: #e0e4ea;
  --card-text-muted: #007070;
}

/* Danger */
.g-card--danger {
  --card-bg: rgba(255, 51, 68, 0.03);
  --card-border: rgba(255, 51, 68, 0.25);
  --card-accent: #ff3344;
  --card-title: #ff3344;
  --card-text: #e0e4ea;
  --card-text-muted: #992233;
}

.g-card--danger .g-card__status-dot {
  animation: g-card-status-danger 0.5s ease-in-out infinite;
}

@keyframes g-card-status-danger {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* Warning */
.g-card--warning {
  --card-bg: rgba(255, 153, 34, 0.03);
  --card-border: rgba(255, 153, 34, 0.25);
  --card-accent: #ff9922;
  --card-title: #ff9922;
  --card-text: #e0e4ea;
  --card-text-muted: #996611;
}

/* Success */
.g-card--success {
  --card-bg: rgba(0, 204, 102, 0.03);
  --card-border: rgba(0, 204, 102, 0.25);
  --card-accent: #00cc66;
  --card-title: #00cc66;
  --card-text: #e0e4ea;
  --card-text-muted: #007744;
}

/* Creep (Horror/Anomaly) */
.g-card--creep {
  --card-bg: rgba(136, 68, 170, 0.03);
  --card-border: rgba(136, 68, 170, 0.25);
  --card-accent: #8844aa;
  --card-title: #8844aa;
  --card-text: #e0e4ea;
  --card-text-muted: #553366;
}

.g-card--creep .g-card__scan-line {
  animation: g-card-scan-creep 2s ease-in-out infinite;
}

@keyframes g-card-scan-creep {
  0% { top: 0; opacity: 0; }
  5% { opacity: 0.8; }
  50% { opacity: 0.3; }
  95% { opacity: 0.8; }
  100% { top: calc(100% - 2px); opacity: 0; }
}

/* Ghost */
.g-card--ghost {
  --card-bg: transparent;
  --card-border: rgba(42, 52, 68, 0.5);
  --card-accent: #8892a2;
  --card-title: #8892a2;
  --card-text: #e0e4ea;
  --card-text-muted: #505868;

  box-shadow: none;
}

.g-card--ghost .g-card__corner::before,
.g-card--ghost .g-card__corner::after {
  opacity: 0.5;
}

/* --------------------------------------------
   MODIFIERS
   -------------------------------------------- */

/* Hoverable */
.g-card--hoverable {
  cursor: pointer;
}

.g-card--hoverable:hover {
  border-color: var(--card-accent, #00d4d4);
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.4),
    0 0 20px var(--card-glow, rgba(0, 212, 212, 0.1)),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transform: translateY(-2px);
}

.g-card--hoverable:hover .g-card__corner::before,
.g-card--hoverable:hover .g-card__corner::after {
  background-color: var(--card-accent, #00d4d4);
  box-shadow: 0 0 4px var(--card-accent, #00d4d4);
}

/* Flat */
.g-card--flat {
  box-shadow: none;
}

/* Outlined */
.g-card--outlined {
  background-color: transparent;
}

/* Disabled */
.g-card--disabled {
  pointer-events: none;
  opacity: 0.5;
}

.g-card--disabled .g-card__status-dot {
  animation: none;
  opacity: 0.3;
}

/* Active */
.g-card--active {
  border-color: var(--card-accent, #00d4d4);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.3),
    0 0 15px var(--card-glow, rgba(0, 212, 212, 0.15)),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
}

/* --------------------------------------------
   TRANSITIONS
   -------------------------------------------- */

/* Collapse transition */
.g-card-collapse-enter-active,
.g-card-collapse-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.g-card-collapse-enter-from,
.g-card-collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.g-card-collapse-enter-to,
.g-card-collapse-leave-from {
  max-height: 500px;
}

/* Fade transition */
.g-card-fade-enter-active,
.g-card-fade-leave-active {
  transition: opacity 0.2s ease;
}

.g-card-fade-enter-from,
.g-card-fade-leave-to {
  opacity: 0;
}
</style>
