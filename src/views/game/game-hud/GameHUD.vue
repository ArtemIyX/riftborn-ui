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
                         @slot-drop="slotDropHandle"
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

/*
const slotDragStartHandle = () => {

};

const slotDragEndHandle = () => {

};
*/

const slotDropHandle = (data) => {
  /*  const sourceIndex = data.sourceSlotIndex;
    const sourceItem = data.sourceItem;
    const targetSlotIndex = data.targetSlotIndex;
    const targetItem = data.targetItem;
    const ev = data.e;
    console.log(JSON.stringify(data));*/
  emitter.emit("ue:inv:drop", data);
};

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
