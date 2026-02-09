<style scoped src="./GameHUD.css"/>

<template>
  <div class="version-container">
    <GameVersion/>
  </div>
</template>


<script setup>
import {emitter, ueHandler} from "@/assets/js/eventBus.js";
import {onMounted, ref} from "vue";
import GameVersion from "@/components/game/misc/game-version/GameVersion.vue";


onMounted(() => {

  emitter.emit('ue:view', {
    name: "game"
  });
})
</script>
