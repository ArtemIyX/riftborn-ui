<style scoped src="./GameHUD.css"/>

<template>
  <div class="version-container">
    <GameVersion/>
  </div>

  <InventorySlot :slot="slotA"/>

  <AlphaBadge variant="creep" :pulse="true" :glitch="true"/>
</template>


<script setup>
import {emitter, ueHandler} from "@/assets/js/eventBus.js";
import {onMounted, ref} from "vue";
import GameVersion from "@/components/game/misc/game-version/GameVersion.vue";
import AlphaBadge from "@/components/game/misc/alpha-badge/AlphaBadge.vue";
import InventorySlot from "@/components/game/inventory/inventory-slot/InventorySlot.vue";

const slotA = ref({
  slotIndex: 0,
  item: null
});

onMounted(() => {

  emitter.emit('ue:view', {
    name: "game"
  });
})
</script>
