<template>
  <button
    class="g-btn-adv"
    :class="[
      `g-btn-adv--${variant}`,
      `g-btn-adv--${size}`,
      { 'g-btn-adv--disabled': disabled }
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <!-- Corner accents -->
    <span class="g-btn-adv__corner g-btn-adv__corner--tl"></span>
    <span class="g-btn-adv__corner g-btn-adv__corner--tr"></span>
    <span class="g-btn-adv__corner g-btn-adv__corner--bl"></span>
    <span class="g-btn-adv__corner g-btn-adv__corner--br"></span>

    <!-- Animated background layers -->
    <span class="g-btn-adv__bg"></span>
    <span class="g-btn-adv__pulse"></span>

    <!-- Content -->
    <span class="g-btn-adv__content">
      <span class="g-btn-adv__icon-left">
        <slot name="icon-left"></slot>
      </span>
      <span class="g-btn-adv__text">
        <slot>{{ text }}</slot>
      </span>
      <span class="g-btn-adv__icon-right">
        <slot name="icon-right"></slot>
      </span>
    </span>

    <!-- Data stream effect -->
    <span class="g-btn-adv__stream"></span>
  </button>
</template>

<script setup>
defineOptions({
  name: 'GButtonAdv',
  inheritAttrs: false
})

defineProps({
  text: {
    type: String,
    default: 'INITIALIZE'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'warning', 'success', 'creep'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style src="./GButtonAdv.css" scoped/>
