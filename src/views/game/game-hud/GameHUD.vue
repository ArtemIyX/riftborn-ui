<style scoped src="./GameHUD.css"/>

<template>
  <div class="version-container">
    <GameVersion/>
  </div>

  <AlphaBadge variant="creep" :pulse="true" :glitch="true"/>

  <div class="hotbar-inventory">
    <inventory-container ref="inventoryContainerRef"
                         :slots="hotbarStore.slots"
                         :rows="1"
    />
  </div>

</template>


<script setup>
import {emitter, ueHandler} from "@/assets/js/eventBus.js";
import {onMounted, onUnmounted, ref} from "vue";
import GameVersion from "@/components/game/misc/game-version/GameVersion.vue";
import AlphaBadge from "@/components/game/misc/alpha-badge/AlphaBadge.vue";
import InventorySlot from "@/components/game/inventory/inventory-slot/InventorySlot.vue";
import InventoryContainer
  from "@/components/game/inventory/inventory-container/InventoryContainer.vue";
import {useHotbarStore} from "@/stores/inventoryStore.js";

const hotbarStore = useHotbarStore();

const inventoryContainerRef = ref(null);
let unsubscribe = null;

onMounted(() => {

  unsubscribe = hotbarStore.onItemUpdate(({slotIndex, action, item}) => {
    console.log(`[GameHUD] Item ${action} at slot ${slotIndex}`);

    if (inventoryContainerRef.value) {
      inventoryContainerRef.value.playSlotAnimation(slotIndex);
    } else {
      console.warn("invalid inventoryContainerRef")
    }
  });

  emitter.emit('ue:view', {
    name: "game"
  });
})

onUnmounted(() => {
  // Clean up subscription
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>
