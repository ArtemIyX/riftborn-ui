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
import {ref, computed, watch, nextTick, onMounted, onBeforeUnmount} from 'vue'

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
        ? {bottom: `${window.innerHeight - rect.top + 4}px`}
        : {top: `${rect.bottom + 4}px`}
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
      highlighted.scrollIntoView({block: 'nearest'})
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

<style src="./GCombobox.css" scoped/>
