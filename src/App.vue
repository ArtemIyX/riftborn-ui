<template>
  <GToastContainer/>
  <router-view/>

</template>

<style>
#app {
  padding: 1rem;
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

