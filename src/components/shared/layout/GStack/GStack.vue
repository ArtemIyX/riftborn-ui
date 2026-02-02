<template>
  <div
    :class="['g-stack', stackClasses]"
    :style="stackStyles"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // Direction: 'row' (horizontal) or 'column' (vertical)
  direction: {
    type: String,
    default: 'column',
    validator: (value) => ['row', 'column', 'row-reverse', 'column-reverse'].includes(value)
  },

  // Spacing between items (0-12)
  spacing: {
    type: [Number, String],
    default: 2
  },

  // Alignment along main axis (justify-content)
  justify: {
    type: String,
    default: 'start',
    validator: (value) => [
      'start', 'center', 'end',
      'space-between', 'space-around', 'space-evenly'
    ].includes(value)
  },

  // Alignment along cross axis (align-items)
  align: {
    type: String,
    default: 'stretch',
    validator: (value) => [
      'start', 'center', 'end', 'stretch', 'baseline'
    ].includes(value)
  },

  // Allow wrapping
  wrap: {
    type: Boolean,
    default: false
  },

  // Use flexbox gap instead of margins
  useFlexGap: {
    type: Boolean,
    default: true
  },

  // Fill height of parent
  fillHeight: {
    type: Boolean,
    default: false
  },

  // Inline flex
  inline: {
    type: Boolean,
    default: false
  },

  // Divider element (will be rendered between children)
  divider: {
    type: Boolean,
    default: false
  }
});

const stackClasses = computed(() => {
  return {
    'g-stack--inline': props.inline,
    'g-stack--wrap': props.wrap,
    'g-stack--fill-height': props.fillHeight,
    'g-stack--with-divider': props.divider,
    [`g-stack--direction-${props.direction}`]: true,
    [`g-stack--justify-${props.justify}`]: true,
    [`g-stack--align-${props.align}`]: true
  };
});

const stackStyles = computed(() => {
  const styles = {};
  const spacingValue = Number(props.spacing) * 0.25;

  if (props.useFlexGap && spacingValue > 0) {
    styles.gap = `${spacingValue}rem`;
  } else if (!props.useFlexGap && spacingValue > 0) {
    // For legacy browsers, we'll use margin on children via CSS
    styles['--stack-spacing'] = `${spacingValue}rem`;
  }

  return styles;
});
</script>

<style src="./GStack.css" scoped/>
