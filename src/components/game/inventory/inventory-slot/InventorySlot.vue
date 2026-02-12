<template>
  <div
    class="inventory-slot"
    :class="{
      'inventory-slot--has-item': hasItem,
      'inventory-slot--animating': isAnimating,
      'inventory-slot--dragging': isDragging,
      'inventory-slot--drag-over': isDragOver
    }"
    :draggable="hasItem"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover="onDragOver"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @drop="onDrop"
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
import {computed, ref} from 'vue';

defineOptions({
  name: 'InventorySlot'
});

const emit = defineEmits([
  'drag-start',
  'drag-end',
  'drop'
]);

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

const isAnimating = ref(false);
const isDragging = ref(false);
const isDragOver = ref(false);

// --- Drag & Drop ---

const onDragStart = (event) => {
  if (!hasItem.value) {
    event.preventDefault();
    return;
  }

  isDragging.value = true;

  // Store source slot index in dataTransfer
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('application/json', JSON.stringify({
    slotIndex: props.slot.slotIndex,
    item: props.slot.item
  }));

  console.log("drag start");
  emit('drag-start', {
    slotIndex: props.slot.slotIndex,
    item: props.slot.item,
    e: event
  });
};

const onDragEnd = (event) => {
  isDragging.value = false;

  console.log("drag end");
  emit('drag-end', {
    slotIndex: props.slot.slotIndex,
    e: event
  });
};

const onDragOver = (event) => {
  console.log("drag over");
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

const onDragEnter = (event) => {
  console.log("drag enter");
  event.preventDefault();
  isDragOver.value = true;
};

const onDragLeave = () => {
  console.log("drag leave");
  isDragOver.value = false;
};

const onDrop = (event) => {
  console.log("drag drop");
  event.preventDefault();
  isDragOver.value = false;

  let sourceData;
  try {
    sourceData = JSON.parse(event.dataTransfer.getData('application/json'));
  } catch {
    return;
  }

  if (sourceData.slotIndex === props.slot.slotIndex) return;

  emit('drop', {
    sourceSlotIndex: sourceData.slotIndex,
    sourceItem: sourceData.item,
    targetSlotIndex: props.slot.slotIndex,
    targetItem: props.slot.item,
    e: event
  });
};
// Play animation method exposed to parent
const playAnimation = () => {
  isAnimating.value = true;
  setTimeout(() => {
    isAnimating.value = false;
  }, 300);
};

// Expose the method so parent can call it
defineExpose({
  playAnimation
});

</script>

<style src="./InventorySlot.css" scoped/>
