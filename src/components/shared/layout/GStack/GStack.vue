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

<style scoped>
.g-stack {
  display: flex;
  box-sizing: border-box;
}

.g-stack--inline {
  display: inline-flex;
}

/* Direction */
.g-stack--direction-row {
  flex-direction: row;
}

.g-stack--direction-column {
  flex-direction: column;
}

.g-stack--direction-row-reverse {
  flex-direction: row-reverse;
}

.g-stack--direction-column-reverse {
  flex-direction: column-reverse;
}

/* Wrapping */
.g-stack--wrap {
  flex-wrap: wrap;
}

/* Fill height */
.g-stack--fill-height {
  height: 100%;
}

/* Justify content (main axis) */
.g-stack--justify-start {
  justify-content: flex-start;
}

.g-stack--justify-center {
  justify-content: center;
}

.g-stack--justify-end {
  justify-content: flex-end;
}

.g-stack--justify-space-between {
  justify-content: space-between;
}

.g-stack--justify-space-around {
  justify-content: space-around;
}

.g-stack--justify-space-evenly {
  justify-content: space-evenly;
}

/* Align items (cross axis) */
.g-stack--align-start {
  align-items: flex-start;
}

.g-stack--align-center {
  align-items: center;
}

.g-stack--align-end {
  align-items: flex-end;
}

.g-stack--align-stretch {
  align-items: stretch;
}

.g-stack--align-baseline {
  align-items: baseline;
}

/* Legacy spacing support (when useFlexGap is false) */
.g-stack:not(.g-stack--wrap) > :not(:last-child) {
  margin-right: 0;
  margin-bottom: 0;
}

.g-stack--direction-row:not(.g-stack--wrap) > :not(:last-child) {
  margin-right: var(--stack-spacing, 0);
}

.g-stack--direction-column:not(.g-stack--wrap) > :not(:last-child) {
  margin-bottom: var(--stack-spacing, 0);
}

.g-stack--direction-row-reverse:not(.g-stack--wrap) > :not(:last-child) {
  margin-left: var(--stack-spacing, 0);
  margin-right: 0;
}

.g-stack--direction-column-reverse:not(.g-stack--wrap) > :not(:last-child) {
  margin-top: var(--stack-spacing, 0);
  margin-bottom: 0;
}

/* Divider styling */
.g-stack--with-divider.g-stack--direction-row > :not(:last-child)::after {
  content: '';
  display: inline-block;
  width: 0.0625rem;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.12);
  margin-left: calc(var(--stack-spacing, 0.5rem) / 2);
  margin-right: calc(var(--stack-spacing, 0.5rem) / 2);
}

.g-stack--with-divider.g-stack--direction-column > :not(:last-child)::after {
  content: '';
  display: block;
  width: 100%;
  height: 0.0625rem;
  background-color: rgba(0, 0, 0, 0.12);
  margin-top: calc(var(--stack-spacing, 0.5rem) / 2);
  margin-bottom: calc(var(--stack-spacing, 0.5rem) / 2);
}
</style>
