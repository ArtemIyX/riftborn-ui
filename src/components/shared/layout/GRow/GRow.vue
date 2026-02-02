<template>
  <div
    :class="['g-row', rowClasses]"
    :style="rowStyles"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, provide } from 'vue';

const props = defineProps({
  // Spacing between columns (gutter), 0-12
  spacing: {
    type: [Number, String],
    default: 3
  },

  // Remove all gutters
  noGutters: {
    type: Boolean,
    default: false
  },

  // Dense spacing (half of normal)
  dense: {
    type: Boolean,
    default: false
  },

  // Horizontal alignment: 'start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'
  justify: {
    type: String,
    default: 'start',
    validator: (value) => [
      'start', 'center', 'end',
      'space-between', 'space-around', 'space-evenly'
    ].includes(value)
  },

  // Vertical alignment: 'start', 'center', 'end', 'stretch', 'baseline'
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
    default: true
  },

  // Fill height
  fillHeight: {
    type: Boolean,
    default: false
  }
});

const rowClasses = computed(() => {
  return {
    'g-row--no-gutters': props.noGutters,
    'g-row--dense': props.dense,
    'g-row--no-wrap': !props.wrap,
    'g-row--fill-height': props.fillHeight,
    [`g-row--justify-${props.justify}`]: true,
    [`g-row--align-${props.align}`]: true
  };
});

const rowStyles = computed(() => {
  if (props.noGutters) {
    return {};
  }

  let gutterValue = Number(props.spacing) * 0.25;
  if (props.dense) {
    gutterValue = gutterValue / 2;
  }

  return {
    margin: `-${gutterValue}rem`,
    width: `calc(100% + ${gutterValue * 2}rem)`
  };
});

// Provide gutter info to child columns
const gutterInfo = computed(() => {
  if (props.noGutters) {
    return { gutter: 0 };
  }

  let gutterValue = Number(props.spacing) * 0.25;
  if (props.dense) {
    gutterValue = gutterValue / 2;
  }

  return { gutter: gutterValue };
});

provide('rowGutter', gutterInfo);
</script>

<style src="./GRow.css" scoped/>
