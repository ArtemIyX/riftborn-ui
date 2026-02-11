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
      />
    </div>
  </div>
</template>

<script setup>
import {computed, ref, toRef} from 'vue';
import InventorySlot from "@/components/game/inventory/inventory-slot/InventorySlot.vue";


defineOptions({
  name: 'InventoryContainer'
});

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
</script>

<style src="./InventoryContainer.css" scoped/>
