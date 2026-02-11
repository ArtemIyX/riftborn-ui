<template>
  <div
    class="inventory-slot"
    :class="{ 'inventory-slot--has-item': hasItem }"
  >
    <!-- Slot background with corners -->
    <div class="inventory-slot__background">
      <span class="inventory-slot__corner inventory-slot__corner--tl"></span>
      <span class="inventory-slot__corner inventory-slot__corner--tr"></span>
      <span class="inventory-slot__corner inventory-slot__corner--bl"></span>
      <span class="inventory-slot__corner inventory-slot__corner--br"></span>
    </div>

    <!-- Item container -->
    <div v-if="hasItem" class="inventory-slot__item">
      <!-- Item image using UImage -->
      <u-image
        :lazyLoad="false"
        :asset-path="slot.item.icon"
        :alt="slot.item.name || 'Item'"
        fit="contain"
        :show-skeleton="false"
        :show-corners="false"
        :fade-in="true"
        class="inventory-slot__image"
      />

      <!-- Stack count (bottom-right corner) -->
      <div v-if="showStackCount" class="inventory-slot__stack">
        <div class="inventory-slot__stack-bg"></div>
        <g-text
          class="inventory-slot__stack-text"
          size="xs"
          weight="bold"
          variant="default"
          family="mono"
        >
          {{ slot.item.stack }}
        </g-text>
      </div>

      <!-- Durability bar -->
      <div v-if="hasDurability" class="inventory-slot__durability">
        <g-progress
          :value="durabilityPercent"
          :max="100"
          size="small"
          :variant="durabilityVariant"
          :striped="isBroken"
          :animated="isBroken"
          :segments="0"
        />
      </div>
    </div>

    <!-- Slot index indicator (top-left) -->
    <div class="inventory-slot__index">
      <g-text
        size="xs"
        variant="dim"
        family="mono"
      >
        {{ String(slot.slotIndex).padStart(2, '0') }}
      </g-text>
    </div>

    <!-- Glow effect when item present -->
    <div v-if="hasItem" class="inventory-slot__glow"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

defineOptions({
  name: 'InventorySlot'
});

const props = defineProps({
  slot: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        typeof value.slotIndex === 'number' &&
        (value.item === null || typeof value.item === 'object')
      );
    }
  }
});

const hasItem = computed(() => {
  return props.slot.item !== null && props.slot.item !== undefined;
});

const hasDurability = computed(() => {
  return (
    hasItem.value &&
    props.slot.item.durability !== null &&
    props.slot.item.durability !== undefined
  );
});

const showStackCount = computed(() => {
  return (
    hasItem.value &&
    props.slot.item.stack !== null &&
    props.slot.item.stack !== undefined &&
    props.slot.item.stack > 1
  );
});

const isBroken = computed(() => {
  return hasDurability.value && props.slot.item.durability <= 0;
});

const durabilityPercent = computed(() => {
  if (!hasDurability.value) return 0;
  return Math.max(0, Math.min(1, props.slot.item.durability)) * 100;
});

const durabilityVariant = computed(() => {
  if (!hasDurability.value) return 'default';

  const durability = props.slot.item.durability;

  if (durability <= 0) return 'default'; // Gray for broken
  if (durability < 0.3) return 'danger';  // Red
  if (durability < 0.6) return 'warning'; // Orange
  return 'success'; // Green
});
</script>

<style src="./InventorySlot.css" scoped/>
