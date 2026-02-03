<template>
  <div
    :class="[
      'g-box',
      `g-box--${variant}`,
      `g-box--${size}`,
      {
        'g-box--bordered': bordered,
        'g-box--glow': glow,
        'g-box--corners': corners,
        'g-box--angled': angled,
      },
    ]"
  >
    <!-- Corner accents (optional) -->
    <div v-if="corners" class="g-box__corners">
      <span class="g-box__corner g-box__corner--tl"></span>
      <span class="g-box__corner g-box__corner--tr"></span>
      <span class="g-box__corner g-box__corner--bl"></span>
      <span class="g-box__corner g-box__corner--br"></span>
    </div>

    <!-- Optional header -->
    <div v-if="title || $slots.header" class="g-box__header">
      <slot name="header">
        <h3 class="g-box__title">{{ title }}</h3>
      </slot>
    </div>

    <slot></slot>
<!--    &lt;!&ndash; Content &ndash;&gt;
    <div class="g-box__content">

    </div>-->

    <!-- Optional footer -->
    <div v-if="$slots.footer" class="g-box__footer">
      <slot name="footer"></slot>
    </div>

    <!-- Glow effect layer -->
    <div v-if="glow" class="g-box__glow"></div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) =>
      ['default', 'primary', 'secondary', 'danger', 'warning', 'success', 'info', 'creep'].includes(
        value
      ),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'none'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  glow: {
    type: Boolean,
    default: false,
  },
  corners: {
    type: Boolean,
    default: false,
  },
  angled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style src="./GBox.css" scoped/>
