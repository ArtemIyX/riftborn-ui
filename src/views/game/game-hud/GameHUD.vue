<style scoped src="./GameHUD.css"/>

<template>
  <div class="version-container">
    <GameVersion/>
  </div>



  <AlphaBadge variant="creep" :pulse="true" :glitch="true"/>

  <inventory-container
    :slots="hotbarSlots"
    :rows="2"
  />
</template>


<script setup>
import {emitter, ueHandler} from "@/assets/js/eventBus.js";
import {onMounted, ref} from "vue";
import GameVersion from "@/components/game/misc/game-version/GameVersion.vue";
import AlphaBadge from "@/components/game/misc/alpha-badge/AlphaBadge.vue";
import InventorySlot from "@/components/game/inventory/inventory-slot/InventorySlot.vue";
import InventoryContainer
  from "@/components/game/inventory/inventory-container/InventoryContainer.vue";

const hotbarSlots = ref([
  { slotIndex: 0, item: null },
  { slotIndex: 1, item: { name: 'Sword', icon: '/icons/sword.png', durability: 0.8 } },
  { slotIndex: 2, item: { name: 'Health Potion', icon: '/icons/potion.png', stack: 5 } },
  { slotIndex: 3, item: null },
  { slotIndex: 4, item: null },
  { slotIndex: 5, item: null },
  { slotIndex: 6, item: null },
  { slotIndex: 7, item: null },
  { slotIndex: 8, item: null }
]);



onMounted(() => {

  emitter.emit('ue:view', {
    name: "game"
  });
})
</script>
