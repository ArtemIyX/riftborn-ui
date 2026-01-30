<template>
  <label
    class="g-checkbox"
    :class="[
      `g-checkbox--${variant}`,
      `g-checkbox--${size}`,
      {
        'g-checkbox--checked': isChecked,
        'g-checkbox--disabled': disabled,
        'g-checkbox--indeterminate': indeterminate
      }
    ]"
  >
    <!-- Hidden input -->
    <input
      ref="inputRef"
      type="checkbox"
      class="g-checkbox__input"
      :checked="isChecked"
      :disabled="disabled"
      :indeterminate="indeterminate"
      v-bind="$attrs"
      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

    <!-- Custom checkbox -->
    <span
      class="g-checkbox__box"
      :class="{ 'g-checkbox__box--focused': isFocused }"
    >
      <!-- Check icon -->
      <svg
        v-if="isChecked && !indeterminate"
        class="g-checkbox__icon g-checkbox__icon--check"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>

      <!-- Indeterminate icon -->
      <svg
        v-if="indeterminate"
        class="g-checkbox__icon g-checkbox__icon--indeterminate"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
      >
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>

      <!-- Corner accents -->
      <span class="g-checkbox__corner g-checkbox__corner--tl"></span>
      <span class="g-checkbox__corner g-checkbox__corner--br"></span>
    </span>

    <!-- Label -->
    <span v-if="label || $slots.default" class="g-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({
  name: 'GCheckbox',
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: [Boolean, Array],
    default: false
  },
  value: {
    type: [String, Number, Boolean, Object],
    default: true
  },
  label: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'danger', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// Refs
const inputRef = ref(null)
const isFocused = ref(false)

// Computed
const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return props.modelValue === true
})

// Methods
const onChange = (e) => {
  if (props.disabled) return

  let newValue

  if (Array.isArray(props.modelValue)) {
    newValue = [...props.modelValue]
    if (e.target.checked) {
      newValue.push(props.value)
    } else {
      const index = newValue.indexOf(props.value)
      if (index > -1) newValue.splice(index, 1)
    }
  } else {
    newValue = e.target.checked
  }

  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

// Expose
defineExpose({
  focus,
  blur,
  inputRef
})
</script>

<style scoped>
/* ============================================
   G-CHECKBOX
   Space Horror UI Component
   ============================================ */

.g-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

/* --------------------------------------------
   HIDDEN INPUT
   -------------------------------------------- */

.g-checkbox__input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

/* --------------------------------------------
   BOX
   -------------------------------------------- */

.g-checkbox__box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background-color: var(--check-bg, #0f1218);
  border: 1px solid var(--check-border, #2a3444);

  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.g-checkbox:hover .g-checkbox__box {
  background-color: var(--check-bg-hover, #161b24);
  border-color: var(--check-border-hover, #3a4a5e);
}

.g-checkbox__box--focused {
  border-color: var(--check-accent, #00d4d4);
  box-shadow: 0 0 8px var(--check-glow, rgba(0, 212, 212, 0.2));
}

.g-checkbox--checked .g-checkbox__box,
.g-checkbox--indeterminate .g-checkbox__box {
  background-color: var(--check-bg-active, rgba(0, 212, 212, 0.15));
  border-color: var(--check-accent, #00d4d4);
}

/* --------------------------------------------
   ICON
   -------------------------------------------- */

.g-checkbox__icon {
  color: var(--check-accent, #00d4d4);
  opacity: 0;
  transform: scale(0.5);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.g-checkbox--checked .g-checkbox__icon--check,
.g-checkbox--indeterminate .g-checkbox__icon--indeterminate {
  opacity: 1;
  transform: scale(1);
}

/* --------------------------------------------
   CORNER ACCENTS
   -------------------------------------------- */

.g-checkbox__corner {
  position: absolute;
  width: 4px;
  height: 4px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.g-checkbox__corner::before,
.g-checkbox__corner::after {
  content: '';
  position: absolute;
  background-color: var(--check-accent, #00d4d4);
}

.g-checkbox__corner--tl {
  top: -1px;
  left: -1px;
}
.g-checkbox__corner--tl::before {
  top: 0;
  left: 0;
  width: 4px;
  height: 1px;
}
.g-checkbox__corner--tl::after {
  top: 0;
  left: 0;
  width: 1px;
  height: 4px;
}

.g-checkbox__corner--br {
  bottom: -1px;
  right: -1px;
}
.g-checkbox__corner--br::before {
  bottom: 0;
  right: 0;
  width: 4px;
  height: 1px;
}
.g-checkbox__corner--br::after {
  bottom: 0;
  right: 0;
  width: 1px;
  height: 4px;
}

.g-checkbox--checked .g-checkbox__corner,
.g-checkbox--indeterminate .g-checkbox__corner {
  opacity: 1;
}

/* --------------------------------------------
   LABEL
   -------------------------------------------- */

.g-checkbox__label {
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--check-label, #e0e4ea);
  transition: color 0.15s ease;
}

.g-checkbox:hover .g-checkbox__label {
  color: var(--check-label-hover, #fff);
}

.g-checkbox--checked .g-checkbox__label {
  color: var(--check-accent, #00d4d4);
}

/* --------------------------------------------
   SIZES
   -------------------------------------------- */

.g-checkbox--small .g-checkbox__box {
  width: 14px;
  height: 14px;
}

.g-checkbox--small .g-checkbox__icon {
  width: 10px;
  height: 10px;
}

.g-checkbox--small .g-checkbox__label {
  font-size: 11px;
}

.g-checkbox--medium .g-checkbox__box {
  width: 18px;
  height: 18px;
}

.g-checkbox--medium .g-checkbox__icon {
  width: 12px;
  height: 12px;
}

.g-checkbox--medium .g-checkbox__label {
  font-size: 12px;
}

.g-checkbox--large .g-checkbox__box {
  width: 22px;
  height: 22px;
}

.g-checkbox--large .g-checkbox__icon {
  width: 14px;
  height: 14px;
}

.g-checkbox--large .g-checkbox__label {
  font-size: 14px;
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Default */
.g-checkbox--default {
  --check-bg: #0f1218;
  --check-bg-hover: #161b24;
  --check-bg-active: rgba(0, 212, 212, 0.15);
  --check-border: #2a3444;
  --check-border-hover: #3a4a5e;
  --check-accent: #00d4d4;
  --check-glow: rgba(0, 212, 212, 0.2);
  --check-label: #e0e4ea;
  --check-label-hover: #fff;
}

/* Primary */
.g-checkbox--primary {
  --check-bg: rgba(0, 212, 212, 0.05);
  --check-bg-hover: rgba(0, 212, 212, 0.1);
  --check-bg-active: rgba(0, 212, 212, 0.2);
  --check-border: rgba(0, 212, 212, 0.3);
  --check-border-hover: rgba(0, 212, 212, 0.5);
  --check-accent: #00d4d4;
  --check-glow: rgba(0, 212, 212, 0.25);
  --check-label: #00d4d4;
  --check-label-hover: #00ffff;
}

/* Danger */
.g-checkbox--danger {
  --check-bg: rgba(255, 51, 68, 0.05);
  --check-bg-hover: rgba(255, 51, 68, 0.1);
  --check-bg-active: rgba(255, 51, 68, 0.2);
  --check-border: rgba(255, 51, 68, 0.3);
  --check-border-hover: rgba(255, 51, 68, 0.5);
  --check-accent: #ff3344;
  --check-glow: rgba(255, 51, 68, 0.25);
  --check-label: #ff3344;
  --check-label-hover: #ff6677;
}

/* Success */
.g-checkbox--success {
  --check-bg: rgba(0, 204, 102, 0.05);
  --check-bg-hover: rgba(0, 204, 102, 0.1);
  --check-bg-active: rgba(0, 204, 102, 0.2);
  --check-border: rgba(0, 204, 102, 0.3);
  --check-border-hover: rgba(0, 204, 102, 0.5);
  --check-accent: #00cc66;
  --check-glow: rgba(0, 204, 102, 0.25);
  --check-label: #00cc66;
  --check-label-hover: #00ff7f;
}

/* --------------------------------------------
   DISABLED
   -------------------------------------------- */

.g-checkbox--disabled {
  pointer-events: none;
}

.g-checkbox--disabled .g-checkbox__box {
  --check-bg: rgba(80, 88, 104, 0.05);
  --check-border: rgba(80, 88, 104, 0.2);
  --check-accent: #505868;
}

.g-checkbox--disabled .g-checkbox__label {
  color: #505868;
}

.g-checkbox--disabled .g-checkbox__corner {
  display: none;
}
</style>
