<template>
  <GBox class="menu-buttons">
    <GStack>
      <component
        v-for="button in menuButtons"
        :key="button.key"
        :is="button.component"
        @click="button.click ? button.click() : undefined"
      >
        <GLocText :table="button.table" :code="button.key">{{ button.text }}</GLocText>
      </component>
    </GStack>
  </GBox>

</template>

<script setup>
import {ref} from "vue";
import {useMenuStore} from "@/stores/mainMenuStore.js";

const store = useMenuStore();
const menuButtons = store.menuButtons;
</script>


<style scoped>
.menu-buttons {
  /* Container sizing */
  width: clamp(200px, 25vw, 400px);
  min-height: min-content;
  max-height: 80vh;

  /* Spacing */
  padding: clamp(1rem, 2vw, 2rem);
  background-color: var(--bg-secondary);
}
</style>
