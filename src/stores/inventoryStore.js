import {defineStore} from 'pinia';
import {ref, computed} from 'vue';

/**
 * Hotbar Store
 * Manages hotbar inventory slots (typically 9 slots like Minecraft)
 */
export const useHotbarStore = defineStore('hotbar', () => {
  // State
  const slots = ref([
    {slotIndex: 0, item: null},
    {
      slotIndex: 1, item: {
        id: "a",
        stack: 5,
        durability: 0.65
      }
      /*null*/,
    }
  ]);

  // Getters
  const getSlot = computed(() => {
    return (index) => {
      if (index < 0 || index >= slots.value.length) {
        console.warn(`[useHotbarStore] Invalid slot index: ${index}`);
        return null;
      }
      return slots.value[index];
    };
  });

  const hasItem = computed(() => {
    return (index) => {
      const slot = getSlot.value(index);
      return slot && slot.item !== null && slot.item !== undefined;
    };
  });

  const emptySlots = computed(() => {
    return slots.value.filter(slot => slot.item === null);
  });

  const filledSlots = computed(() => {
    return slots.value.filter(slot => slot.item !== null);
  });

  const slotCount = computed(() => slots.value.length);

  const updateCallbacks = ref([]);

  // Actions


  const updateItemStr = (index, str) => {
    const item = JSON.parse(str);
    updateItem(index, item);
  };

  /**
   * Update item at specific slot index
   * @param {number} index - Slot index (0-8)
   * @param {Object|null} item - Item data with { name, icon, stack?, durability? }
   */
  const updateItem = (index, item) => {
    console.log(`[useHotbarStore] updateItem[${index}]: ${JSON.stringify(item)}`);
    if (index < 0 || index >= slots.value.length) {
      console.error(`[useHotbarStore] Cannot update item: invalid index ${index}`);
      return false;
    }

    // Validate item structure if not null
    /*    if (item !== null && item !== undefined) {
          if (!item.name || !item.icon) {
            console.error('[useHotbarStore] Item must have name and icon properties');
            return false;
          }
        }*/

    slots.value[index].item = item;
    notifyUpdate(index, "updateItem", slots.value[index].item);
    return true;
  };

  /**
   * Reset item at specific slot (set to null)
   * @param {number} index - Slot index (0-8)
   */
  const resetItem = (index) => {
    if (index < 0 || index >= slots.value.length) {
      console.error(`[useHotbarStore] Cannot reset item: invalid index ${index}`);
      return false;
    }

    slots.value[index].item = null;

    notifyUpdate(index, "resetItem", null);
    return true;
  };


  /**
   * Set entire inventory from array of slots
   * @param {String} str - JSON array string of objects
   */
  const setInventoryStr = (str) => {
    const arr = JSON.parse(str);
    setInventory(arr);
  }


  /**
   * Set entire inventory from array of slots
   * @param {Array} newSlots - Array of slot objects
   */
  const setInventory = (newSlots) => {
    console.log(`[useHotbarStore] setInventory: ${JSON.stringify(newSlots)}`);
    if (!Array.isArray(newSlots)) {
      console.error('[useHotbarStore] setInventory requires an array');
      return false;
    }

    // Validate each slot has required structure
    const isValid = newSlots.every((slot, index) => {
      if (typeof slot.slotIndex !== 'number') {
        console.error(`[useHotbarStore] Slot at index ${index} missing slotIndex`);
        return false;
      }

      /*if (slot.item !== null && slot.item !== undefined) {
        if (!slot.item.name /!*|| !slot.item.icon*!/) {
          console.error(`[useHotbarStore] Item at slot ${index} missing name or icon`);
          return false;
        }
      }*/

      return true;
    });

    if (!isValid) {
      console.error('[useHotbarStore] Invalid slot data provided');
      return false;
    }

    slots.value = newSlots;
    return true;
  };

  /**
   * Clear all items from hotbar
   */
  const clearAll = () => {
    slots.value.forEach(slot => {
      slot.item = null;
    });
  };

  /**
   * Swap items between two slots
   * @param {number} fromIndex - Source slot index
   * @param {number} toIndex - Destination slot index
   */
  const swapItems = (fromIndex, toIndex) => {
    if (fromIndex < 0 || fromIndex >= slots.value.length ||
      toIndex < 0 || toIndex >= slots.value.length) {
      console.error('[useHotbarStore] Invalid indices for swap');
      return false;
    }

    const temp = slots.value[fromIndex].item;
    slots.value[fromIndex].item = slots.value[toIndex].item;
    slots.value[toIndex].item = temp;

    notifyUpdate(fromIndex, "swapItemsFrom", slots.value[fromIndex].item);
    notifyUpdate(toIndex, "swapItemsTo", slots.value[toIndex].item);
    return true;
  };

  /**
   * Find first empty slot index
   * @returns {number} Index of first empty slot, or -1 if none
   */
  const findEmptySlot = () => {
    const emptySlot = slots.value.find(slot => slot.item === null);
    return emptySlot ? emptySlot.slotIndex : -1;
  };

  /**
   * Add item to first available slot
   * @param {Object} item - Item data
   * @returns {number} Index where item was added, or -1 if hotbar full
   */
  const addItem = (item) => {
    const emptyIndex = findEmptySlot();
    if (emptyIndex === -1) {
      console.warn('[useHotbarStore] Hotbar is full');
      return -1;
    }

    updateItem(emptyIndex, item);
    return emptyIndex;
  };

  /**
   * Update item stack count
   * @param {number} index - Slot index
   * @param {number} newStack - New stack count
   */
  const updateStack = (index, newStack) => {
    if (index < 0 || index >= slots.value.length) {
      console.error(`[useHotbarStore] Invalid index ${index}`);
      return false;
    }

    const slot = slots.value[index];
    if (!slot.item) {
      console.warn(`[useHotbarStore] No item at slot ${index}`);
      return false;
    }

    if (typeof newStack !== 'number' || newStack < 1) {
      console.error('[useHotbarStore] Stack count must be a positive number');
      return false;
    }

    slot.item.stack = newStack;

    notifyUpdate(index, "updateStack", slot.item);
    return true;
  };

  /**
   * Update item durability
   * @param {number} index - Slot index
   * @param {number} newDurability - New durability (0-1)
   */
  const updateDurability = (index, newDurability) => {
    if (index < 0 || index >= slots.value.length) {
      console.error(`[useHotbarStore] Invalid index ${index}`);
      return false;
    }

    const slot = slots.value[index];
    if (!slot.item) {
      console.warn(`[useHotbarStore] No item at slot ${index}`);
      return false;
    }

    if (typeof newDurability !== 'number' || newDurability < 0 || newDurability > 1) {
      console.error('[useHotbarStore] Durability must be between 0 and 1');
      return false;
    }

    slot.item.durability = newDurability;

    notifyUpdate(index, "updateDurability", slot.item);
    return true;
  };

  // Helper to notify listeners
  const notifyUpdate = (slotIndex, action, item) => {
    updateCallbacks.value.forEach(callback => {
      callback({slotIndex, action, item});
    });
  };

  // Register callback for updates
  const onItemUpdate = (callback) => {
    updateCallbacks.value.push(callback);

    // Return unsubscribe function
    return () => {
      const index = updateCallbacks.value.indexOf(callback);
      if (index > -1) {
        updateCallbacks.value.splice(index, 1);
      }
    };
  };

  return {
    // State
    slots,

    // Getters
    getSlot,
    hasItem,
    emptySlots,
    filledSlots,
    slotCount,

    // Actions
    updateItem,
    updateItemStr,
    resetItem,
    setInventory,
    setInventoryStr,
    clearAll,
    swapItems,
    findEmptySlot,
    addItem,
    updateStack,
    updateDurability,
    onItemUpdate,
    updateCallbacks
  };
});
