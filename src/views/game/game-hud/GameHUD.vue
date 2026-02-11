<style scoped src="./GameHUD.css"/>

<template>
  <div class="version-container">
    <GameVersion/>
  </div>

  <AlphaBadge variant="creep" :pulse="true" :glitch="true"/>

  <div class="hotbar-inventory">
    <inventory-container
                         :slots="hotbarStore.slots"
                         :rows="1"
    />
  </div>

</template>


<script setup>
import {emitter, ueHandler} from "@/assets/js/eventBus.js";
import {onMounted, ref} from "vue";
import GameVersion from "@/components/game/misc/game-version/GameVersion.vue";
import AlphaBadge from "@/components/game/misc/alpha-badge/AlphaBadge.vue";
import InventorySlot from "@/components/game/inventory/inventory-slot/InventorySlot.vue";
import InventoryContainer
  from "@/components/game/inventory/inventory-container/InventoryContainer.vue";
import {useHotbarStore} from "@/stores/inventoryStore.js";

const hotbarStore = useHotbarStore();


onMounted(() => {

  emitter.emit('ue:view', {
    name: "game"
  });
})
</script>
