<template>
  <div
    class="g-progress"
    :class="[
      `g-progress--${variant}`,
      `g-progress--${size}`,
      {
        'g-progress--striped': striped,
        'g-progress--animated': animated,
        'g-progress--indeterminate': indeterminate
      }
    ]"
  >
    <!-- Label -->
    <div v-if="label || showValue" class="g-progress__header">
      <span v-if="label" class="g-progress__label">{{ label }}</span>
      <span v-if="showValue && !indeterminate" class="g-progress__value">
        {{ displayValue }}{{ suffix }}
      </span>
    </div>

    <!-- Track -->
    <div class="g-progress__track">
      <!-- Segments (optional) -->
      <div v-if="segments > 0" class="g-progress__segments">
        <span
          v-for="seg in segments"
          :key="seg"
          class="g-progress__segment"
        ></span>
      </div>

      <!-- Fill -->
      <div
        class="g-progress__fill"
        :style="fillStyle"
      >
        <span class="g-progress__fill-glow"></span>
        <span v-if="striped" class="g-progress__stripes"></span>
      </div>

      <!-- Indeterminate bar -->
      <div v-if="indeterminate" class="g-progress__indeterminate"></div>

      <!-- Threshold marker -->
      <div
        v-if="threshold !== null && !indeterminate"
        class="g-progress__threshold"
        :style="{ left: `${threshold}%` }"
      >
        <span class="g-progress__threshold-line"></span>
      </div>
    </div>

    <!-- Status text -->
    <div v-if="status" class="g-progress__status">{{ status }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'GProgress'
})

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  label: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: '%'
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
  showValue: {
    type: Boolean,
    default: true
  },
  striped: {
    type: Boolean,
    default: false
  },
  animated: {
    type: Boolean,
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  segments: {
    type: Number,
    default: 0
  },
  threshold: {
    type: Number,
    default: null
  }
})

// Computed
const percent = computed(() => {
  if (props.max === 0) return 0
  return Math.min(Math.max((props.value / props.max) * 100, 0), 100)
})

const displayValue = computed(() => {
  if (props.suffix === '%') {
    return Math.round(percent.value)
  }
  return props.value
})

const fillStyle = computed(() => {
  if (props.indeterminate) return {}
  return {
    width: `${percent.value}%`
  }
})
</script>

<style scoped>
/* ============================================
   G-PROGRESS
   Space Horror UI Component
   ============================================ */

.g-progress {
  position: relative;
  width: 100%;
  max-width: 400px;
}

/* --------------------------------------------
   HEADER
   -------------------------------------------- */

.g-progress__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.g-progress__label {
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--progress-label, #8892a2);
}

.g-progress__value {
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 12px;
  color: var(--progress-value, #00d4d4);
}

/* --------------------------------------------
   TRACK
   -------------------------------------------- */

.g-progress__track {
  position: relative;
  width: 100%;
  background-color: var(--progress-track-bg, #161b24);
  border: 1px solid var(--progress-border, #2a3444);
  overflow: hidden;
}

/* --------------------------------------------
   SEGMENTS
   -------------------------------------------- */

.g-progress__segments {
  position: absolute;
  inset: 0;
  display: flex;
  gap: 2px;
  padding: 0 1px;
  pointer-events: none;
  z-index: 2;
}

.g-progress__segment {
  flex: 1;
  border-left: 1px solid var(--progress-segment, rgba(10, 12, 16, 0.5));
}

.g-progress__segment:first-child {
  border-left: none;
}

/* --------------------------------------------
   FILL
   -------------------------------------------- */

.g-progress__fill {
  position: relative;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--progress-fill-start, rgba(0, 212, 212, 0.3)),
    var(--progress-fill-end, rgba(0, 212, 212, 0.6))
  );
  transition: width 0.3s ease;
}

.g-progress__fill-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--progress-accent, #00d4d4)
  );
  opacity: 0.6;
}

/* --------------------------------------------
   STRIPES
   -------------------------------------------- */

.g-progress__stripes {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.1) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
}

.g-progress--animated .g-progress__stripes {
  animation: g-progress-stripes 1s linear infinite;
}

@keyframes g-progress-stripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 0;
  }
}

/* --------------------------------------------
   INDETERMINATE
   -------------------------------------------- */

.g-progress__indeterminate {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--progress-fill-end, rgba(0, 212, 212, 0.6)),
    var(--progress-accent, #00d4d4),
    var(--progress-fill-end, rgba(0, 212, 212, 0.6)),
    transparent
  );
  animation: g-progress-indeterminate 1.5s ease-in-out infinite;
}

@keyframes g-progress-indeterminate {
  0% {
    left: -30%;
  }
  100% {
    left: 100%;
  }
}

/* --------------------------------------------
   THRESHOLD MARKER
   -------------------------------------------- */

.g-progress__threshold {
  position: absolute;
  top: -2px;
  bottom: -2px;
  width: 2px;
  transform: translateX(-50%);
  z-index: 3;
}

.g-progress__threshold-line {
  position: absolute;
  inset: 0;
  background-color: var(--progress-threshold, #ff3344);
  box-shadow: 0 0 6px var(--progress-threshold, #ff3344);
}

.g-progress__threshold::before,
.g-progress__threshold::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
}

.g-progress__threshold::before {
  top: -4px;
  border-top-color: var(--progress-threshold, #ff3344);
}

.g-progress__threshold::after {
  bottom: -4px;
  border-bottom-color: var(--progress-threshold, #ff3344);
}

/* --------------------------------------------
   STATUS
   -------------------------------------------- */

.g-progress__status {
  margin-top: 4px;
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--progress-status, #505868);
}

/* --------------------------------------------
   SIZES
   -------------------------------------------- */

/* Small */
.g-progress--small .g-progress__track {
  height: 8px;
}

.g-progress--small .g-progress__label {
  font-size: 10px;
}

.g-progress--small .g-progress__value {
  font-size: 10px;
}

/* Medium */
.g-progress--medium .g-progress__track {
  height: 16px;
}

/* Large */
.g-progress--large .g-progress__track {
  height: 24px;
}

.g-progress--large .g-progress__label {
  font-size: 12px;
}

.g-progress--large .g-progress__value {
  font-size: 14px;
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Default (Cyan) */
.g-progress--default {
  --progress-label: #8892a2;
  --progress-value: #00d4d4;
  --progress-track-bg: #161b24;
  --progress-border: #2a3444;
  --progress-fill-start: rgba(0, 212, 212, 0.2);
  --progress-fill-end: rgba(0, 212, 212, 0.5);
  --progress-accent: #00d4d4;
  --progress-segment: rgba(10, 12, 16, 0.5);
  --progress-threshold: #ff3344;
  --progress-status: #505868;
}

/* Primary */
.g-progress--primary {
  --progress-label: #00a0a0;
  --progress-value: #00d4d4;
  --progress-track-bg: rgba(0, 212, 212, 0.05);
  --progress-border: rgba(0, 212, 212, 0.3);
  --progress-fill-start: rgba(0, 212, 212, 0.3);
  --progress-fill-end: rgba(0, 212, 212, 0.7);
  --progress-accent: #00ffff;
  --progress-segment: rgba(10, 12, 16, 0.6);
  --progress-threshold: #ff3344;
  --progress-status: #007070;
}

/* Danger */
.g-progress--danger {
  --progress-label: #cc2936;
  --progress-value: #ff3344;
  --progress-track-bg: rgba(255, 51, 68, 0.05);
  --progress-border: rgba(255, 51, 68, 0.3);
  --progress-fill-start: rgba(255, 51, 68, 0.3);
  --progress-fill-end: rgba(255, 51, 68, 0.7);
  --progress-accent: #ff6677;
  --progress-segment: rgba(10, 12, 16, 0.6);
  --progress-threshold: #00d4d4;
  --progress-status: #992233;
}

/* Warning */
.g-progress--warning {
  --progress-label: #cc7a1b;
  --progress-value: #ff9922;
  --progress-track-bg: rgba(255, 153, 34, 0.05);
  --progress-border: rgba(255, 153, 34, 0.3);
  --progress-fill-start: rgba(255, 153, 34, 0.3);
  --progress-fill-end: rgba(255, 153, 34, 0.7);
  --progress-accent: #ffaa44;
  --progress-segment: rgba(10, 12, 16, 0.6);
  --progress-threshold: #ff3344;
  --progress-status: #996611;
}

/* Success */
.g-progress--success {
  --progress-label: #00994d;
  --progress-value: #00cc66;
  --progress-track-bg: rgba(0, 204, 102, 0.05);
  --progress-border: rgba(0, 204, 102, 0.3);
  --progress-fill-start: rgba(0, 204, 102, 0.3);
  --progress-fill-end: rgba(0, 204, 102, 0.7);
  --progress-accent: #00ff7f;
  --progress-segment: rgba(10, 12, 16, 0.6);
  --progress-threshold: #ff3344;
  --progress-status: #007744;
}

/* Info (Blue) */
.g-progress--info {
  --progress-label: #4466aa;
  --progress-value: #4488ff;
  --progress-track-bg: rgba(68, 136, 255, 0.05);
  --progress-border: rgba(68, 136, 255, 0.3);
  --progress-fill-start: rgba(68, 136, 255, 0.3);
  --progress-fill-end: rgba(68, 136, 255, 0.7);
  --progress-accent: #66aaff;
  --progress-segment: rgba(10, 12, 16, 0.6);
  --progress-threshold: #ff3344;
  --progress-status: #3366cc;
}
</style>
