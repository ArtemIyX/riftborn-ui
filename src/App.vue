<template>

  <g-button variant="primary" text="Hello world" @click="hello"/>
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

  <g-input
    variant="default"
    v-model="shipName"
    label="Vessel Designation"
    placeholder="Enter name..."
    clearable
    required
  />

  <g-input
    v-model="frequency"
    variant="primary"
    label="Frequency"
    suffix="MHz"
    type="number"
  />

  <g-input
    v-model="coordinates"
    variant="ghost"
    placeholder="Search coordinates..."
    error="Invalid format"
  />

  <g-textarea
    v-model="logEntry"
    label="Captain's Log"
    placeholder="Enter log entry..."
    :rows="6"
    show-count
    :maxlength="500"
  />

  <g-textarea
    v-model="distressSignal"
    variant="primary"
    label="Distress Message"
    hint="Broadcast on all frequencies"
    required
  />

  <g-textarea
    v-model="notes"
    variant="ghost"
    placeholder="Quick notes..."
    resize
  />

  <g-divider/>

  <!-- Single -->
  <g-checkbox v-model="autoSave" label="Auto-save enabled" />

  <!-- Variants -->
  <g-checkbox v-model="confirmed" variant="success" label="Systems nominal" />
  <g-checkbox v-model="override" variant="danger" label="Override safety" />

  <g-divider/>

  <g-toggle :model-value="isActive('autopilot')" @change="toggle('autopilot')" label="Autopilot" />
  <g-toggle :model-value="isActive('shields')" @change="toggle('shields')" label="Shields" />
  <g-toggle :model-value="isActive('selfDestruct')" @change="toggle('selfDestruct')" label="Self Destruct" />

  <g-divider/>
  <!-- Radio group - all share same v-model -->
  <g-radio v-model="selectedSystem_radio" value="navigation" label="Navigation" />
  <g-radio v-model="selectedSystem_radio" value="weapons" label="Weapons" />
  <g-radio v-model="selectedSystem_radio" value="shields" label="Shields" />
  <g-radio v-model="selectedSystem_radio" value="engines" label="Engines" />

  <!-- With variants -->
  <g-radio v-model="priority" value="low" variant="success" label="Low" />
  <g-radio v-model="priority" value="medium" variant="primary" label="Medium" />
  <g-radio v-model="priority" value="critical" variant="danger" label="Critical" />

</template>

<script setup>
import GButton from "@/components/shared/buttons/GButton.vue";
import GButtonAdv from "@/components/shared/buttons/GButtonAdv.vue";
import GButtonCommon from "@/components/shared/buttons/GButtonCommon.vue";
import GCombobox from "@/components/shared/GCombobox.vue";

import GInput from "@/components/shared/GInput.vue";

import {ref} from 'vue'
import GTextarea from "@/components/shared/GTextarea.vue";
import GCheckbox from "@/components/shared/GCheckbox.vue";
import GToggle from "@/components/shared/GToggle.vue";
import GDivider from "@/components/shared/GDivider.vue";
import GRadio from "@/components/shared/GRadio.vue";

const activeSystem = ref(null)

const selectedSystem_radio = ref(null)
const priority = ref(null)
const isActive = (key) => activeSystem.value === key
const toggle = (key) => {
  activeSystem.value = activeSystem.value === key ? null : key
}

const hello = () => {
  console.log("Hello world");
}


const shipName = ref(null)
const frequency = ref(null)
const coordinates = ref(null)
const logEntry = ref(null)
const distressSignal = ref(null)
const notes = ref(null)

const systems_check = ref([]);
const autoSave = ref(false);
const override = ref(false);
const confirmed = ref(false);
const someSelected = ref(false)


const selectedSystem = ref(null)
const systems = [
  {value: 'life-support', label: 'Life Support'},
  {value: 'navigation', label: 'Navigation'},
  {value: 'weapons', label: 'Weapons Array'},
  {value: 'sonar', label: 'Sonar Systems'}
]

const changed = () => {

}

</script>

<style scoped>

</style>
