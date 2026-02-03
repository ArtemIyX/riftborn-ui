// stores/menuStore.js
import {defineStore} from 'pinia'
import {ref} from 'vue'

import {emitter} from '@/assets/js/eventBus.js';
import GButton from "@/components/shared/buttons/GButton.vue";

export const useMenuStore = defineStore('menu', () => {
  // State: array of menu button objects
  const menuButtons = ref([
    {
      table: 'ST_Menu',
      key: '#Play',
      text: 'Find Servers',
      component: GButton,
      click: () => emitter.emit('menu:button:play')
    },
    {
      table: 'ST_Menu',
      key: '#Host',
      text: 'Host server',
      component: GButton,
      click: () => emitter.emit('menu:button:host')
    },
    {
      table: 'ST_Menu',
      key: '#Settings',
      text: 'Settings',
      component: GButton,
      click: () => emitter.emit('menu:button:settings')
    },
    {
      table: 'ST_Menu',
      key: '#Credits',
      text: 'Credits',
      component: GButton,
      click: () => emitter.emit('menu:button:credits')
    },
    {
      table: 'ST_Menu',
      key: '#Social',
      text: 'Social',
      component: GButton,
      click: () => emitter.emit('menu:button:social')
    },
    {
      table: 'ST_Menu',
      key: '#Quit',
      text: 'Quit',
      component: GButton,
      click: () => emitter.emit('menu:button:quit')
    }
  ])

  // Getters
  const getButtonByKey = (key) => {
    return menuButtons.value.find(button => button.keyToLocalize === key)
  }

  const getButtonsByTable = (table) => {
    return menuButtons.value.filter(button => button.tableToLocalize === table)
  }

  // Actions
  const addButton = (button) => {
    menuButtons.value.push(button)
  }

  const removeButton = (key) => {
    const index = menuButtons.value.findIndex(button => button.keyToLocalize === key)
    if (index !== -1) {
      menuButtons.value.splice(index, 1)
    }
  }

  const updateButton = (key, updatedButton) => {
    const index = menuButtons.value.findIndex(button => button.keyToLocalize === key)
    if (index !== -1) {
      menuButtons.value[index] = {...menuButtons.value[index], ...updatedButton}
    }
  }

  const setButtons = (buttons) => {
    menuButtons.value = buttons
  }

  return {
    // State
    menuButtons,

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
