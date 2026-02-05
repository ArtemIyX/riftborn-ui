<!-- components/ModComponent.vue -->
<script setup>
import { computed } from 'vue'
import {modSystem} from "@/assets/mods/ModSystem.js";

const props = defineProps({
  // The component name to render
  name: {
    type: String,
    required: true
  },
  // Custom props to pass to the component
  props: {
    type: Object,
    default: () => ({})
  },
  // Custom data/config
  data: {
    type: Object,
    default: () => ({})
  },
  // Mod ID (optional, for disambiguation)
  modId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['component-mounted', 'component-error'])

// Get the component from the mod system
const component = computed(() => {
  try {
    // Try to get from globally registered components first
    const app = modSystem.getApp()
    if (app && app.component(props.name)) {
      return app.component(props.name)
    }

    // If modId is specified, get from specific mod
    if (props.modId) {
      const mod = modSystem.getMod(props.modId)
      if (mod && mod.components && mod.components[props.name]) {
        return mod.components[props.name]
      }
    }

    // Search through all mods
    for (const mod of modSystem.mods) {
      if (mod.components && mod.components[props.name]) {
        return mod.components[props.name]
      }
    }

    console.warn(`Component "${props.name}" not found in any mod`)
    return null
  } catch (error) {
    console.error(`Error loading component "${props.name}":`, error)
    emit('component-error', error)
    return null
  }
})

// Merge props and data
const componentProps = computed(() => ({
  ...props.props,
  ...props.data
}))

// Handle component mounted
const onMounted = () => {
  emit('component-mounted', props.name)
}
</script>

<template>
  <div class="mod-component-wrapper">
    <component
      v-if="component"
      :is="component"
      v-bind="componentProps"
      @mounted="onMounted"
    />
    <div v-else class="mod-component-error">
      <p>⚠️ Component "{{ name }}" not found</p>
      <p v-if="modId" class="mod-id">Mod ID: {{ modId }}</p>
    </div>
  </div>
</template>

<style scoped>
.mod-component-wrapper {
  display: contents;
}

.mod-component-error {
  padding: 20px;
  border: 2px dashed #ff6b6b;
  border-radius: 8px;
  background: #ffe0e0;
  color: #c92a2a;
  text-align: center;
}

.mod-component-error .mod-id {
  font-size: 0.9em;
  opacity: 0.8;
  margin-top: 5px;
}
</style>
