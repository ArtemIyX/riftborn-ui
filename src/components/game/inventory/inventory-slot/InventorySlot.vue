<template>
  <div
    class="inventory-slot"
    :class="{
      'inventory-slot--has-item': hasItem,
      'inventory-slot--animating': isAnimating,
      'inventory-slot--dragging': isDragging,
      'inventory-slot--drag-over': isDragOver
    }"
    @pointerdown="onPointerDown"
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
import {computed, ref, onBeforeUnmount} from 'vue';

defineOptions({
  name: 'InventorySlot'
});

const emit = defineEmits([
  'drag-start',
  'drag-end',
  'drop',
  'drag-enter',
  'drag-leave'
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

// Drag state
const dragState = ref({
  isDragging: false,
  startX: 0,
  startY: 0,
  dragThreshold: 5 // Minimum pixels to move before starting drag
});

// --- Pointer-based Drag & Drop ---

const onPointerDown = (event) => {
  if (!hasItem.value) return;

  // Only handle left mouse button or touch
  if (event.button !== undefined && event.button !== 0) return;

  dragState.value.startX = event.clientX;
  dragState.value.startY = event.clientY;
  dragState.value.isDragging = false;

  // Capture pointer to continue receiving events even if pointer leaves element
  event.target.setPointerCapture(event.pointerId);

  // Attach move and up handlers
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerCancel);

  // Prevent default to avoid text selection
  event.preventDefault();
};

const onPointerMove = (event) => {
  const deltaX = Math.abs(event.clientX - dragState.value.startX);
  const deltaY = Math.abs(event.clientY - dragState.value.startY);
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Start dragging if moved beyond threshold
  if (!dragState.value.isDragging && distance > dragState.value.dragThreshold) {
    dragState.value.isDragging = true;
    isDragging.value = true;

    console.log("drag start");
    emit('drag-start', {
      slotIndex: props.slot.slotIndex,
      item: props.slot.item,
      e: event
    });
  }

  // If dragging, check for drag over events
  if (dragState.value.isDragging) {
    // Get element at current pointer position
    const elementBelow = document.elementFromPoint(event.clientX, event.clientY);

    if (elementBelow) {
      // Find the closest inventory slot
      const slotElement = elementBelow.closest('.inventory-slot');

      if (slotElement) {
        const customEvent = new CustomEvent('inventory-drag-over', {
          bubbles: true,
          detail: {
            sourceSlotIndex: props.slot.slotIndex,
            sourceItem: props.slot.item,
            clientX: event.clientX,
            clientY: event.clientY
          }
        });
        slotElement.dispatchEvent(customEvent);
      }
    }
  }
};

const onPointerUp = (event) => {
  if (dragState.value.isDragging) {
    console.log("drag end");

    // Get element at drop position
    const elementBelow = document.elementFromPoint(event.clientX, event.clientY);

    if (elementBelow) {
      // Find the closest inventory slot
      const slotElement = elementBelow.closest('.inventory-slot');

      if (slotElement) {
        // Dispatch drop event to target slot
        const customEvent = new CustomEvent('inventory-drop', {
          bubbles: true,
          detail: {
            sourceSlotIndex: props.slot.slotIndex,
            sourceItem: props.slot.item
          }
        });
        slotElement.dispatchEvent(customEvent);
      }
    }

    emit('drag-end', {
      slotIndex: props.slot.slotIndex,
      e: event
    });

    isDragging.value = false;
  }

  // Clean up
  cleanupPointerEvents();
};

const onPointerCancel = (event) => {
  if (dragState.value.isDragging) {
    console.log("drag cancel");

    emit('drag-end', {
      slotIndex: props.slot.slotIndex,
      e: event
    });

    isDragging.value = false;
  }

  cleanupPointerEvents();
};

const cleanupPointerEvents = () => {
  document.removeEventListener('pointermove', onPointerMove);
  document.removeEventListener('pointerup', onPointerUp);
  document.removeEventListener('pointercancel', onPointerCancel);
  dragState.value.isDragging = false;
};

// Handle custom drag over event from other slots
const handleDragOver = (event) => {
  if (!dragState.value.isDragging && event.detail.sourceSlotIndex !== props.slot.slotIndex) {
    if (!isDragOver.value) {
      console.log("drag enter");
      isDragOver.value = true;
      emit('drag-enter', {
        sourceSlotIndex: event.detail.sourceSlotIndex,
        sourceItem: event.detail.sourceItem,
        targetSlotIndex: props.slot.slotIndex,
        targetItem: props.slot.item
      });
    }
  }
};

// Handle custom drop event
const handleDrop = (event) => {
  console.log("drag drop");
  isDragOver.value = false;

  if (event.detail.sourceSlotIndex === props.slot.slotIndex) return;

  emit('drop', {
    sourceSlotIndex: event.detail.sourceSlotIndex,
    sourceItem: event.detail.sourceItem,
    targetSlotIndex: props.slot.slotIndex,
    targetItem: props.slot.item,
    e: event
  });

  emit('drag-leave', {
    targetSlotIndex: props.slot.slotIndex
  });
};

// Play animation method exposed to parent
const playAnimation = () => {
  isAnimating.value = true;
  setTimeout(() => {
    isAnimating.value = false;
  }, 300);
};

// Set up custom event listeners
const setupCustomEvents = () => {
  const element = document.querySelector(`[data-slot-index="${props.slot.slotIndex}"]`);
  if (element) {
    element.addEventListener('inventory-drag-over', handleDragOver);
    element.addEventListener('inventory-drop', handleDrop);
  }
};

// Use mounted lifecycle to set up listeners (since we need DOM access)
import {onMounted, getCurrentInstance} from 'vue';

onMounted(() => {
  const instance = getCurrentInstance();
  const element = instance?.vnode?.el;

  if (element) {
    // Add data attribute for easy selection
    element.setAttribute('data-slot-index', props.slot.slotIndex);
    element.addEventListener('inventory-drag-over', handleDragOver);
    element.addEventListener('inventory-drop', handleDrop);

    // Clean up drag over state when pointer leaves
    element.addEventListener('pointerleave', () => {
      if (isDragOver.value && !dragState.value.isDragging) {
        console.log("drag leave");
        isDragOver.value = false;
        emit('drag-leave', {
          targetSlotIndex: props.slot.slotIndex
        });
      }
    });
  }
});

// Clean up event listeners on unmount
onBeforeUnmount(() => {
  cleanupPointerEvents();

  const instance = getCurrentInstance();
  const element = instance?.vnode?.el;

  if (element) {
    element.removeEventListener('inventory-drag-over', handleDragOver);
    element.removeEventListener('inventory-drop', handleDrop);
  }
});

// Expose the method so parent can call it
defineExpose({
  playAnimation
});

</script>

<style src="./InventorySlot.css" scoped/>
