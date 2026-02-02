<template>
  <div
    :class="['g-col', colClasses]"
    :style="colStyles"
    :data-xs="xs"
    :data-sm="sm"
    :data-md="md"
    :data-lg="lg"
    :data-xl="xl"
    :data-offset-xs="offsetXs"
    :data-offset-sm="offsetSm"
    :data-offset-md="offsetMd"
    :data-offset-lg="offsetLg"
    :data-offset-xl="offsetXl"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';

const props = defineProps({
  // Column span for all breakpoints (1-12)
  cols: {
    type: [Number, String],
    default: 12
  },

  // Column span for xs breakpoint
  xs: {
    type: [Number, String],
    default: null
  },

  // Column span for sm breakpoint
  sm: {
    type: [Number, String],
    default: null
  },

  // Column span for md breakpoint
  md: {
    type: [Number, String],
    default: null
  },

  // Column span for lg breakpoint
  lg: {
    type: [Number, String],
    default: null
  },

  // Column span for xl breakpoint
  xl: {
    type: [Number, String],
    default: null
  },

  // Offset columns
  offset: {
    type: [Number, String],
    default: 0
  },

  // Offset for xs breakpoint
  offsetXs: {
    type: [Number, String],
    default: null
  },

  // Offset for sm breakpoint
  offsetSm: {
    type: [Number, String],
    default: null
  },

  // Offset for md breakpoint
  offsetMd: {
    type: [Number, String],
    default: null
  },

  // Offset for lg breakpoint
  offsetLg: {
    type: [Number, String],
    default: null
  },

  // Offset for xl breakpoint
  offsetXl: {
    type: [Number, String],
    default: null
  },

  // Order
  order: {
    type: [Number, String],
    default: null
  },

  // Auto width
  auto: {
    type: Boolean,
    default: false
  },

  // Grow to fill space
  grow: {
    type: Boolean,
    default: false
  },

  // Shrink when needed
  shrink: {
    type: Boolean,
    default: false
  },

  // Alignment override for this column
  alignSelf: {
    type: String,
    default: null,
    validator: (value) => !value || [
      'auto', 'start', 'center', 'end', 'stretch', 'baseline'
    ].includes(value)
  }
});

// Get gutter info from parent row
const rowGutter = inject('rowGutter', { gutter: 0.75 });

const colClasses = computed(() => {
  const classes = {
    'g-col--auto': props.auto,
    'g-col--grow': props.grow,
    'g-col--shrink': props.shrink
  };

  // Add alignment class
  if (props.alignSelf) {
    classes[`g-col--align-${props.alignSelf}`] = true;
  }

  // Add order class
  if (props.order !== null) {
    classes[`g-col--order-${props.order}`] = true;
  }

  return classes;
});

const colStyles = computed(() => {
  const styles = {};
  const gutterValue = rowGutter.value.gutter;

  // Apply padding (gutter)
  if (gutterValue > 0) {
    styles.padding = `${gutterValue}rem`;
  }

  // Calculate flex-basis based on cols
  if (!props.auto) {
    const calculateFlexBasis = (colSpan) => {
      if (!colSpan) return null;
      const span = Number(colSpan);
      if (span === 12) return '100%';
      return `${(span / 12) * 100}%`;
    };

    // Default flex-basis
    const flexBasis = calculateFlexBasis(props.cols);
    if (flexBasis) {
      styles.flexBasis = flexBasis;
      styles.maxWidth = flexBasis;
    }
  }

  // Calculate offset
  const calculateOffset = (offsetValue) => {
    if (!offsetValue || offsetValue === 0) return null;
    const offset = Number(offsetValue);
    return `${(offset / 12) * 100}%`;
  };

  const offsetMargin = calculateOffset(props.offset);
  if (offsetMargin) {
    styles.marginLeft = offsetMargin;
  }

  // Order
  if (props.order !== null) {
    styles.order = props.order;
  }

  // Grow/Shrink
  if (props.grow) {
    styles.flexGrow = 1;
  }
  if (props.shrink) {
    styles.flexShrink = 1;
  }

  return styles;
});
</script>

<style src="./GCol.css" scoped/>
