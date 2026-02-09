<template>
  <GToastContainer/>
  <router-view/>

</template>

<style>
#app {
  padding: 1rem;
}

.dev-body {
  background-color: var(--bg-primary);
}
</style>

<script setup>

import ModComponent from "@/components/mod/ModComponent.vue";
import {modSystem} from './assets/mods/ModSystem.js'
import {onMounted, onUnmounted, ref} from "vue";
import {ueHandler} from "@/assets/js/eventBus.js";

const counterMod = modSystem.getMod('counter-mod')

// List all available components
console.log('Available mod components:', modSystem.listComponents())

const customData = ref({
  title: 'My Custom Counter',
  showHistory: true,
  multiplier: 2
})


onMounted(() => {
  if (!ueHandler.isUnrealAvailable) {
    document.body.classList.add('dev-body');
  }

});

onUnmounted(() => {
  if (!ueHandler.isUnrealAvailable) {
    document.body.classList.remove('dev-body');
  }
});

</script>

