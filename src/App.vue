<template>
  <div id="app">
    <h1>Mod Component System Demo</h1>

    <!-- Example 1: Simple usage -->
    <ModComponent name="CounterWidget" />

    <!-- Example 2: With custom props -->
    <ModComponent
      name="CounterDisplay"
      :props="{
        title: 'Basic Counter',
        showHistory: false
      }"
    />

    <!-- Example 3: With data object -->
    <ModComponent
      name="CounterDisplay"
      :data="customData"
    />

    <!-- Example 4: Specify mod ID -->
    <ModComponent
      name="CounterDisplay"
      mod-id="counter-mod"
      :props="{
        title: 'Specific Mod Counter',
        multiplier: 5
      }"
    />

    <!-- Example 5: With event handling -->
    <ModComponent
      name="CounterWidget"
      @component-mounted="(name) => console.log('Mounted:', name)"
      @component-error="(error) => console.error('Error:', error)"
    />

    <!-- Example 6: Using globally registered component directly -->
    <CounterWidget />
    <CounterDisplay :show-history="true" title="Direct Component" />
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
import { modSystem } from './assets/mods/ModSystem.js'
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

