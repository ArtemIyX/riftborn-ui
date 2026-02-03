<template>
  <div id="app">
    <GToastContainer/>
    <router-view/>
  </div>
</template>

<style>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>

<script setup>

import ModComponent from "@/components/mod/ModComponent.vue";
import {modSystem} from './assets/mods/ModSystem.js'
import {ref} from "vue";

const counterMod = modSystem.getMod('counter-mod')

// List all available components
console.log('Available mod components:', modSystem.listComponents())

const customData = ref({
  title: 'My Custom Counter',
  showHistory: true,
  multiplier: 2
})

</script>

