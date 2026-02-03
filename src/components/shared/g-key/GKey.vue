<style src="./GKey.css" scoped/>

<template>
  <button
    ref="keyButtonRef"
    class="g-key"
    :class="[
      `g-key--${size}`,
      `g-key--${variant}`,
      { 'g-key--listening': isListening },
      { 'g-key--disabled': disabled }
    ]"
    :disabled="disabled"
    @click="startListening"
    @blur="handleBlur"
  >
    <!-- Border layer -->
    <span class="g-key__border"></span>

    <!-- Glow layer -->
    <span class="g-key__glow"></span>

    <!-- Scanline effect -->
    <span class="g-key__scanline"></span>

    <!-- Content -->
    <span class="g-key__content">
      <span class="g-key__label">{{ displayValue }}</span>
    </span>

    <!-- Listening indicator -->
    <span v-if="isListening" class="g-key__pulse"></span>
  </button>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'warning', 'success'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'NONE'
  }
});

const emit = defineEmits(['update:modelValue', 'change-start', 'change-complete', 'change-cancel']);

const keyButtonRef = ref(null);
const isListening = ref(false);

const displayValue = computed(() => {
  if (isListening.value) {
    return '...';
  }
  return props.modelValue || props.placeholder;
});

const startListening = () => {
  if (props.disabled || isListening.value) {
    return;
  }

  isListening.value = true;
  emit('change-start');

  // Add keyboard event listener
  window.addEventListener('keydown', handleKeyDown);
};

const handleKeyDown = (event) => {
  event.preventDefault();
  event.stopPropagation();

  // Handle Escape key to cancel
  if (event.key === 'Escape') {
    cancel();
    return;
  }

  // Get the key name
  const keyName = formatKeyName(event);

  // Update the value
  isListening.value = false;
  emit('update:modelValue', keyName);
  emit('change-complete', keyName);

  // Remove event listener
  window.removeEventListener('keydown', handleKeyDown);

  // Blur the button
  if (keyButtonRef.value) {
    keyButtonRef.value.blur();
  }
};

const handleBlur = () => {
  if (isListening.value) {
    cancel();
  }
};

const cancel = () => {
  if (!isListening.value) {
    return;
  }

  isListening.value = false;
  emit('change-cancel');

  // Remove event listener
  window.removeEventListener('keydown', handleKeyDown);

  // Blur the button
  if (keyButtonRef.value) {
    keyButtonRef.value.blur();
  }
};

const formatKeyName = (event) => {
  let keyName = event.key;

  // Handle special keys
  const keyMap = {
    ' ': 'SPACE',
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'Control': 'CTRL',
    'Alt': 'ALT',
    'Shift': 'SHIFT',
    'Meta': 'META',
    'Enter': 'ENTER',
    'Tab': 'TAB',
    'Backspace': 'BACKSPACE',
    'Delete': 'DELETE',
    'Insert': 'INSERT',
    'Home': 'HOME',
    'End': 'END',
    'PageUp': 'PAGE UP',
    'PageDown': 'PAGE DOWN',
    'CapsLock': 'CAPS LOCK',
    'NumLock': 'NUM LOCK',
    'ScrollLock': 'SCROLL LOCK',
    'Pause': 'PAUSE',
    'PrintScreen': 'PRINT SCREEN'
  };

  if (keyMap[keyName]) {
    keyName = keyMap[keyName];
  } else {
    keyName = keyName.toUpperCase();
  }

  return keyName;
};

// Expose cancel method for external use
defineExpose({
  cancel
});

// Cleanup on unmount
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

