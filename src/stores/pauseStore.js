// stores/menuStore.js
import {defineStore} from 'pinia'
import {markRaw, ref, shallowRef} from 'vue'

import {emitter} from '@/assets/js/eventBus.js';
import GButton from "@/components/shared/buttons/GButton.vue";
import {ST_MENU} from "@/assets/js/localizationConstants.js";

export const usePauseStore = defineStore('pause', () => {
  // State: array of menu button objects
  const pauseButtons = ref([
    {
      table: ST_MENU,
      key: '#Continue',
      text: 'Continue',
      component: markRaw(GButton),
      click: () => emitter.emit('pause:button:continue')
    },
    {
      table: ST_MENU,
      key: '#Settings',
      text: 'Settings',
      component: markRaw(GButton),
      click: () => emitter.emit('pause:button:settings')
    },
    {
      table: ST_MENU,
      key: '#ExitToMenu',
      text: 'Exit to menu',
      component: markRaw(GButton),
      click: () => emitter.emit('pause:button:exit')
    }
  ])

  // Getters
  const getButtonByKey = (key) => {
    return pauseButtons.value.find(button => button.key === key)
  }

  const getButtonsByTable = (table) => {
    return pauseButtons.value.filter(button => button.table === table)
  }

  // Actions
  const addButton = (button) => {
    pauseButtons.value.push(button)
  }

  const removeButton = (key) => {
    const index = pauseButtons.value.findIndex(button => button.key === key)
    if (index !== -1) {
      pauseButtons.value.splice(index, 1)
    }
  }

  const updateButton = (key, updatedButton) => {
    const index = pauseButtons.value.findIndex(button => button.key === key)
    if (index !== -1) {
      pauseButtons.value[index] = {...pauseButtons.value[index], ...updatedButton}
    }
  }

  const setButtons = (buttons) => {
    pauseButtons.value = buttons
  }

  return {
    // State
    pauseButtons,

    // Getters
    getButtonByKey,
    getButtonsByTable,

    // Actions
    addButton,
    removeButton,
    updateButton,
    setButtons
  }
})
