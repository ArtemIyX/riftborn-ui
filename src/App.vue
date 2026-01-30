

<template>

  <g-button variant="primary" text="Hello world"  @click="hello"/>
  <g-button-adv variant="success" text="Hello world" @click="hello"/>
  <g-button-common variant="danger" text="Hello world" @click="hello"/>

  <g-combobox
    v-model="selectedSystem"
    :options="systems"
    placeholder="Select system..."
    searchable
  />

  <g-combobox
    v-model="selectedSystem"
    :options="systems"
    variant="primary"
    placeholder="OVERRIDE TARGET"
  />
</template>

<script setup>
import GButton from "@/components/shared/buttons/GButton.vue";
import GButtonAdv from "@/components/shared/buttons/GButtonAdv.vue";
import GButtonCommon from "@/components/shared/buttons/GButtonCommon.vue";
import GCombobox from "@/components/shared/GCombobox.vue";

import { ref } from 'vue'


const hello = () => {
  console.log("Hello world");
}

const selectedSystem = ref(null)
const systems = [
  { value: 'life-support', label: 'Life Support' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'weapons', label: 'Weapons Array' },
  { value: 'sonar', label: 'Sonar Systems' }
]
</script>

<style scoped>

</style>
