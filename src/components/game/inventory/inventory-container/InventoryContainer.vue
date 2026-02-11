<template>
  <div
    class="inventory-container"
    :style="containerStyle"
  >
    <!-- Grid of inventory slots -->
    <div class="inventory-container__grid">
      <inventory-slot
        v-for="slot in slots"
        :key="slot.slotIndex"
        :slot="slot"
        class="inventory-container__slot"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, toRef } from 'vue';
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
const slotsRef = toRef(props, 'slots');

// Calculate grid columns based on slots and rows
const columns = computed(() => {
  if (slotsRef.value.length === 0) return 1;
  // Columns = slots per row (ceiling to handle incomplete last row)
  return Math.ceil(slotsRef.value.length / props.rows);
});

// Dynamic grid style
const containerStyle = computed(() => ({
  '--inventory-rows': props.rows,
  '--inventory-columns': columns.value
}));
</script>

<style src="./InventoryContainer.css" scoped/>
