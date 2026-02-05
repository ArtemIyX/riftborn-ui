<template>
  <GBox class="button-container">

    <component
      class="settings-button"
      v-for="button in settingsButtons"
      :key="button.key"
      :is="button.component"
      @click="button.click ? button.click() : undefined"
    >
      <GLocText :table="button.table" :code="button.key">{{ button.text }}</GLocText>
    </component>

  </GBox>

</template>

<script setup>

import {useSettingsStore} from "@/stores/settingsStore.js";
const store = useSettingsStore();
const settingsButtons = store.settingsButtons;

</script>

<style scoped>

.button-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0; /* Prevents shrinking */

}

</style>
