<style scoped src="./GameVersion.css"/>

<template>

  <GText variant="muted">{{ version }}</GText>

</template>

<script setup>
import {ueHandler} from "@/assets/js/eventBus.js";
import {onMounted, ref} from "vue";

const version = ref("1.0.0.0");

const fetchVersion = async () => {
  if (ueHandler.isUnrealAvailable) {
    try {
      const versionFromUE = await window.ue.handler.version();
      if (versionFromUE) {
        version.value = versionFromUE;
      }
    } catch (error) {
      console.error("Failed to retrieve version from UE:", error);
    }
  }
}

onMounted(() => {
  fetchVersion();
});
</script>
