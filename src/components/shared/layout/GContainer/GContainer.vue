<template>
  <div
    :class="['g-container', containerClasses]"
    :style="containerStyles"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // If true, container takes full width
  fluid: {
    type: Boolean,
    default: false
  },

  // Max width for non-fluid container
  // Can be: 'xs', 'sm', 'md', 'lg', 'xl', 'xxl' or custom pixel value
  maxWidth: {
    type: [String, Number],
    default: 'lg'
  },

  // Padding size: 0-12
  padding: {
    type: [Number, String],
    default: 3
  },

  // Remove padding
  noPadding: {
    type: Boolean,
    default: false
  },

  // Custom tag to render
  tag: {
    type: String,
    default: 'div'
  },

  // Fill height
  fillHeight: {
    type: Boolean,
    default: false
  }
});

const containerClasses = computed(() => {
  return {
    'g-container--fluid': props.fluid,
    'g-container--fill-height': props.fillHeight,
    'g-container--no-padding': props.noPadding
  };
});

const containerStyles = computed(() => {
  const styles = {};

  // Apply padding if not disabled
  if (!props.noPadding) {
    const paddingValue = `${Number(props.padding) * 4}px`;
    styles.padding = paddingValue;
  }

  // Apply max-width for non-fluid containers
  if (!props.fluid && props.maxWidth) {
    if (typeof props.maxWidth === 'number') {
      styles.maxWidth = `${props.maxWidth}px`;
    }
  }

  return styles;
});
</script>

<style src="./GContainer.css" scoped/>
