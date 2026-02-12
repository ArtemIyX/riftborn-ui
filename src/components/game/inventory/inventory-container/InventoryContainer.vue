<template>
  <div
    class="inventory-container"
    :style="containerStyle"
  >
    <!-- Grid of inventory slots -->
    <div class="inventory-container__grid">
      <inventory-slot
        v-for="slot in slots"
        :ref="el => setSlotRef(el, slot.slotIndex)"
        :key="slot.slotIndex"
        :slot="slot"
        class="inventory-container__slot"
        @drag-start="onDragStart"
        @drag-end="onDragEnd"
        @drag-enter="$emit('slot-drag-enter', $event)"
        @drag-leave="$emit('slot-drag-leave', $event)"
        @drop="$emit('slot-drop', $event)"
      />
    </div>

    <!-- Drag preview (follows cursor) -->
    <teleport to="body">
      <div
        v-if="dragPreview.isActive"
        class="inventory-drag-preview"
        :style="dragPreviewStyle"
      >
        <div class="inventory-drag-preview__background">
          <span class="inventory-drag-preview__corner inventory-drag-preview__corner--tl"></span>
          <span class="inventory-drag-preview__corner inventory-drag-preview__corner--tr"></span>
          <span class="inventory-drag-preview__corner inventory-drag-preview__corner--bl"></span>
          <span class="inventory-drag-preview__corner inventory-drag-preview__corner--br"></span>
        </div>
        <u-image
          v-if="dragPreview.item"
          :lazyLoad="false"
          :asset-path="dragPreview.item.icon"
          :alt="dragPreview.item.name || 'Item'"
          fit="contain"
          :show-skeleton="false"
          :show-corners="false"
          :fade-in="false"
          class="inventory-drag-preview__image"
        />
        <div v-if="dragPreview.item?.stack > 1" class="inventory-drag-preview__stack">
          <div class="inventory-drag-preview__stack-bg"></div>
          <g-text
            class="inventory-drag-preview__stack-text"
            size="xs"
            weight="bold"
            variant="default"
            family="mono"
          >
            {{ dragPreview.item.stack }}
          </g-text>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import {computed, ref, toRef} from 'vue';
import InventorySlot from "@/components/game/inventory/inventory-slot/InventorySlot.vue";

defineOptions({
  name: 'InventoryContainer'
});

defineEmits([
  'slot-drag-start',
  'slot-drag-end',
  'slot-drag-enter',
  'slot-drag-leave',
  'slot-drop'
]);

const props = defineProps({
  slots: {
    type: Array,
    required: true,
    validator: (value) => {
      return Array.isArray(value) && value.every(slot =>
        typeof slot.slotIndex === 'number' &&
        (slot.item === null || typeof slot.item === 'object')
      );
    }
  },
  rows: {
    type: Number,
    default: 1,
    validator: (value) => value > 0
  }
});

// Make slots reactive to external changes
const slotsData = toRef(props, 'slots');


// Store refs to slot components (COMPONENT INSTANCES)
const slotRefs = ref({});

const setSlotRef = (el, slotIndex) => {
  if (el) {
    slotRefs.value[slotIndex] = el;
  } else {
    delete slotRefs.value[slotIndex];
  }
};

// Play animation on specific slot by index
const playSlotAnimation = (slotIndex) => {
  const slotComponent = slotRefs.value[slotIndex];
  if (slotComponent && slotComponent.playAnimation) {
    slotComponent.playAnimation();
  } else {
    console.warn(`Slot with index ${slotIndex} not found`);
  }
};

// Expose method to parent components
defineExpose({
  playSlotAnimation
});

// Calculate grid columns based on slots and rows
const columns = computed(() => {
  if (slotsData.value.length === 0) return 1;
  // Columns = slots per row (ceiling to handle incomplete last row)
  return Math.ceil(slotsData.value.length / props.rows);
});

// Dynamic grid style
const containerStyle = computed(() => ({
  '--inventory-rows': props.rows,
  '--inventory-columns': columns.value
}));

// --- Drag Preview ---
const dragPreview = ref({
  isActive: false,
  item: null,
  x: 0,
  y: 0
});

const dragPreviewStyle = computed(() => ({
  left: `${dragPreview.value.x}px`,
  top: `${dragPreview.value.y}px`,
  transform: 'translate(-50%, -50%)'
}));


const onDragStart = (event) => {
  dragPreview.value.isActive = true;
  dragPreview.value.item = event.item;
  dragPreview.value.x = event.e.clientX;
  dragPreview.value.y = event.e.clientY;

  // Track pointer movement
  document.addEventListener('pointermove', updateDragPreview);

  emit('slot-drag-start', event);
};

const onDragEnd = (event) => {
  dragPreview.value.isActive = false;
  dragPreview.value.item = null;

  document.removeEventListener('pointermove', updateDragPreview);

  emit('slot-drag-end', event);
};

const updateDragPreview = (event) => {
  if (dragPreview.value.isActive) {
    dragPreview.value.x = event.clientX;
    dragPreview.value.y = event.clientY;
  }
};
</script>

<style src="./InventoryContainer.css" scoped/>
