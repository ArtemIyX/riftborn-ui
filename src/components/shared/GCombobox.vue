<template>
  <div
    class="g-combobox"
    :class="[
      `g-combobox--${variant}`,
      `g-combobox--${size}`,
      {
        'g-combobox--open': isOpen,
        'g-combobox--disabled': disabled
      }
    ]"
    ref="comboboxRef"
  >
    <!-- Trigger -->
    <button
      type="button"
      class="g-combobox__trigger"
      :disabled="disabled"
      @click="toggle"
      @keydown="onTriggerKeydown"
      ref="triggerRef"
    >
      <span class="g-combobox__value">
        <slot name="selected" :selected="selectedOption">
          {{ selectedLabel || placeholder }}
        </slot>
      </span>
      <span class="g-combobox__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </button>

    <!-- Dropdown -->
    <Teleport to="body">
      <Transition name="g-combobox-dropdown">
        <div
          v-if="isOpen"
          class="g-combobox__dropdown"
          :class="`g-combobox__dropdown--${variant}`"
          :style="dropdownStyle"
          ref="dropdownRef"
        >
          <!-- Search (optional) -->
          <div v-if="searchable" class="g-combobox__search">
            <input
              type="text"
              class="g-combobox__search-input"
              :placeholder="searchPlaceholder"
              v-model="searchQuery"
              @keydown="onSearchKeydown"
              ref="searchInputRef"
            />
            <span class="g-combobox__search-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </span>
          </div>

          <!-- Options list -->
          <div class="g-combobox__options" ref="optionsRef">
            <div
              v-for="(option, index) in filteredOptions"
              :key="option.value"
              class="g-combobox__option"
              :class="{
                'g-combobox__option--selected': isSelected(option),
                'g-combobox__option--highlighted': highlightedIndex === index
              }"
              @click="select(option)"
              @mouseenter="highlightedIndex = index"
            >
              <slot name="option" :option="option" :selected="isSelected(option)">
                {{ option.label }}
              </slot>
              <span v-if="isSelected(option)" class="g-combobox__option-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
            </div>

            <!-- Empty state -->
            <div v-if="filteredOptions.length === 0" class="g-combobox__empty">
              {{ emptyText }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'GCombobox'
})

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null
  },
  options: {
    type: Array,
    default: () => [],
    validator: (value) => value.every(opt =>
      typeof opt === 'object' && 'value' in opt && 'label' in opt
    )
  },
  placeholder: {
    type: String,
    default: 'Select...'
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'danger'].includes(value)
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
  searchable: {
    type: Boolean,
    default: false
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  emptyText: {
    type: String,
    default: 'No results found'
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'open', 'close'])

// Refs
const comboboxRef = ref(null)
const triggerRef = ref(null)
const dropdownRef = ref(null)
const searchInputRef = ref(null)
const optionsRef = ref(null)

// State
const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(0)
const dropdownStyle = ref({})

// Computed
const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue) || null
})

const selectedLabel = computed(() => {
  return selectedOption.value?.label || ''
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt =>
    opt.label.toLowerCase().includes(query)
  )
})

// Methods
const toggle = () => {
  if (props.disabled) return
  isOpen.value ? close() : open()
}

const open = () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  highlightedIndex.value = selectedOption.value
    ? filteredOptions.value.findIndex(opt => opt.value === props.modelValue)
    : 0
  if (highlightedIndex.value < 0) highlightedIndex.value = 0

  nextTick(() => {
    updateDropdownPosition()
    if (props.searchable && searchInputRef.value) {
      searchInputRef.value.focus()
    }
  })
  emit('open')
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  searchQuery.value = ''
  highlightedIndex.value = 0
  emit('close')
}

const select = (option) => {
  emit('update:modelValue', option.value)
  emit('change', option)
  close()
  triggerRef.value?.focus()
}

const isSelected = (option) => {
  return option.value === props.modelValue
}

const updateDropdownPosition = () => {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const dropdownHeight = 250

  const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

  dropdownStyle.value = {
    position: 'fixed',
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    ...(openAbove
        ? { bottom: `${window.innerHeight - rect.top + 4}px` }
        : { top: `${rect.bottom + 4}px` }
    )
  }
}

// Keyboard navigation
const onTriggerKeydown = (e) => {
  switch (e.key) {
    case 'Enter':
    case ' ':
    case 'ArrowDown':
      e.preventDefault()
      open()
      break
    case 'Escape':
      close()
      break
  }
}

const onSearchKeydown = (e) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredOptions.value.length - 1
      )
      scrollToHighlighted()
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      scrollToHighlighted()
      break
    case 'Enter':
      e.preventDefault()
      if (filteredOptions.value[highlightedIndex.value]) {
        select(filteredOptions.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      close()
      triggerRef.value?.focus()
      break
  }
}

const scrollToHighlighted = () => {
  nextTick(() => {
    const container = optionsRef.value
    const highlighted = container?.querySelector('.g-combobox__option--highlighted')
    if (highlighted && container) {
      highlighted.scrollIntoView({ block: 'nearest' })
    }
  })
}

// Click outside
const onClickOutside = (e) => {
  if (
    isOpen.value &&
    comboboxRef.value &&
    !comboboxRef.value.contains(e.target) &&
    dropdownRef.value &&
    !dropdownRef.value.contains(e.target)
  ) {
    close()
  }
}

// Watchers
watch(searchQuery, () => {
  highlightedIndex.value = 0
})

watch(isOpen, (val) => {
  if (val) {
    window.addEventListener('scroll', updateDropdownPosition, true)
    window.addEventListener('resize', updateDropdownPosition)
  } else {
    window.removeEventListener('scroll', updateDropdownPosition, true)
    window.removeEventListener('resize', updateDropdownPosition)
  }
})

// Lifecycle
onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
  window.removeEventListener('scroll', updateDropdownPosition, true)
  window.removeEventListener('resize', updateDropdownPosition)
})
</script>

<style scoped>
/* ============================================
   G-COMBOBOX
   Space Horror UI Component
   ============================================ */

.g-combobox {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 17.5rem;
}

/* --------------------------------------------
   TRIGGER
   -------------------------------------------- */

.g-combobox__trigger {
  /* Reset */
  border: none;
  background: none;
  cursor: pointer;
  outline: none;
  text-align: left;

  /* Layout */
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;

  /* Typography */
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-weight: 500;
  letter-spacing: 0.04em;

  /* Styling */
  background-color: var(--combo-bg, #0f1218);
  color: var(--combo-color, #e0e4ea);
  border: 0.0625rem solid var(--combo-border, #2a3444);

  /* Transitions */
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.g-combobox__trigger:hover {
  background-color: var(--combo-bg-hover, #161b24);
  border-color: var(--combo-border-hover, #3a4a5e);
}

.g-combobox--open .g-combobox__trigger {
  border-color: var(--combo-accent, #00d4d4);
  box-shadow: 0 0 0.75rem var(--combo-glow, rgba(0, 212, 212, 0.15));
}

.g-combobox__trigger:focus-visible {
  border-color: var(--combo-accent, #00d4d4);
  box-shadow: 0 0 0 0.0625rem var(--combo-accent, #00d4d4);
}

/* --------------------------------------------
   VALUE & ICON
   -------------------------------------------- */

.g-combobox__value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.g-combobox__icon {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  color: var(--combo-icon, #8892a2);
  transition: transform 0.2s ease, color 0.15s ease;
}

.g-combobox__icon svg {
  width: 100%;
  height: 100%;
}

.g-combobox--open .g-combobox__icon {
  transform: rotate(180deg);
  color: var(--combo-accent, #00d4d4);
}

/* --------------------------------------------
   SIZES
   -------------------------------------------- */

.g-combobox--small .g-combobox__trigger {
  padding: 0.375rem 0.625rem;
  font-size: 0.6875rem;
}

.g-combobox--medium .g-combobox__trigger {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
}

.g-combobox--large .g-combobox__trigger {
  padding: 0.625rem 0.875rem;
  font-size: 0.8125rem;
}

/* --------------------------------------------
   DROPDOWN
   -------------------------------------------- */

.g-combobox__dropdown {
  z-index: 9999;
  min-width: 10rem;
  max-height: 15.625rem;
  overflow: hidden;

  background-color: #0f1218;
  border: 0.0625rem solid var(--combo-border, #2a3444);
  box-shadow:
    0 0.5rem 2rem rgba(0, 0, 0, 0.5),
    0 0 1rem var(--combo-glow, rgba(0, 212, 212, 0.1));

  display: flex;
  flex-direction: column;
}

/* Dropdown variants */
.g-combobox__dropdown--default {
  --combo-accent: #00d4d4;
  --combo-glow: rgba(0, 212, 212, 0.1);
}

.g-combobox__dropdown--primary {
  --combo-accent: #00d4d4;
  --combo-glow: rgba(0, 212, 212, 0.15);
}

.g-combobox__dropdown--danger {
  --combo-accent: #ff3344;
  --combo-glow: rgba(255, 51, 68, 0.15);
}

/* --------------------------------------------
   SEARCH
   -------------------------------------------- */

.g-combobox__search {
  position: relative;
  padding: 0.5rem;
  border-bottom: 0.0625rem solid #1e2632;
}

.g-combobox__search-input {
  width: 100%;
  padding: 0.375rem 0.625rem 0.375rem 1.875rem;

  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;

  background-color: #161b24;
  color: #e0e4ea;
  border: 0.0625rem solid #2a3444;
  outline: none;

  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.g-combobox__search-input::placeholder {
  color: #505868;
}

.g-combobox__search-input:focus {
  border-color: var(--combo-accent, #00d4d4);
  box-shadow: 0 0 0.5rem var(--combo-glow, rgba(0, 212, 212, 0.15));
}

.g-combobox__search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.875rem;
  height: 0.875rem;
  color: #505868;
  pointer-events: none;
}

.g-combobox__search-icon svg {
  width: 100%;
  height: 100%;
}

/* --------------------------------------------
   OPTIONS
   -------------------------------------------- */

.g-combobox__options {
  flex: 1;
  overflow-y: auto;
  padding: 0.25rem 0;
}

.g-combobox__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;

  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #e0e4ea;

  cursor: pointer;
  transition: background-color 0.1s ease, color 0.1s ease;
}

.g-combobox__option:hover,
.g-combobox__option--highlighted {
  background-color: #1c232e;
}

.g-combobox__option--selected {
  color: var(--combo-accent, #00d4d4);
  background-color: var(--combo-glow, rgba(0, 212, 212, 0.08));
}

.g-combobox__option--selected:hover,
.g-combobox__option--selected.g-combobox__option--highlighted {
  background-color: rgba(0, 212, 212, 0.12);
}

.g-combobox__option-check {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--combo-accent, #00d4d4);
}

.g-combobox__option-check svg {
  width: 100%;
  height: 100%;
}

/* --------------------------------------------
   EMPTY STATE
   -------------------------------------------- */

.g-combobox__empty {
  padding: 1rem 0.75rem;
  text-align: center;

  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  color: #505868;
}

/* --------------------------------------------
   VARIANTS
   -------------------------------------------- */

/* Default */
.g-combobox--default {
  --combo-bg: #0f1218;
  --combo-bg-hover: #161b24;
  --combo-color: #e0e4ea;
  --combo-border: #2a3444;
  --combo-border-hover: #3a4a5e;
  --combo-accent: #00d4d4;
  --combo-glow: rgba(0, 212, 212, 0.15);
  --combo-icon: #8892a2;
}

/* Primary */
.g-combobox--primary {
  --combo-bg: rgba(0, 212, 212, 0.05);
  --combo-bg-hover: rgba(0, 212, 212, 0.08);
  --combo-color: #00d4d4;
  --combo-border: rgba(0, 212, 212, 0.3);
  --combo-border-hover: rgba(0, 212, 212, 0.5);
  --combo-accent: #00d4d4;
  --combo-glow: rgba(0, 212, 212, 0.15);
  --combo-icon: #00a0a0;
}

/* Danger */
.g-combobox--danger {
  --combo-bg: rgba(255, 51, 68, 0.05);
  --combo-bg-hover: rgba(255, 51, 68, 0.08);
  --combo-color: #ff3344;
  --combo-border: rgba(255, 51, 68, 0.3);
  --combo-border-hover: rgba(255, 51, 68, 0.5);
  --combo-accent: #ff3344;
  --combo-glow: rgba(255, 51, 68, 0.15);
  --combo-icon: #cc2936;
}

/* --------------------------------------------
   DISABLED STATE
   -------------------------------------------- */

.g-combobox--disabled {
  pointer-events: none;
}

.g-combobox--disabled .g-combobox__trigger {
  --combo-bg: rgba(80, 88, 104, 0.05);
  --combo-color: #505868;
  --combo-border: rgba(80, 88, 104, 0.15);
  --combo-icon: #505868;
  cursor: not-allowed;
}

/* --------------------------------------------
   DROPDOWN ANIMATION
   -------------------------------------------- */

.g-combobox-dropdown-enter-active,
.g-combobox-dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.g-combobox-dropdown-enter-from,
.g-combobox-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}

/* --------------------------------------------
   SCROLLBAR
   -------------------------------------------- */

.g-combobox__options::-webkit-scrollbar {
  width: 0.375rem;
}

.g-combobox__options::-webkit-scrollbar-track {
  background: #0f1218;
}

.g-combobox__options::-webkit-scrollbar-thumb {
  background: #2a3444;
  border-radius: 0.1875rem;
}

.g-combobox__options::-webkit-scrollbar-thumb:hover {
  background: #3a4a5e;
}
</style>
