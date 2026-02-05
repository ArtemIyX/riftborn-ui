// stores/menuStore.js
import {defineStore} from 'pinia'
import {markRaw, ref, shallowRef} from 'vue'

import {emitter} from '@/assets/js/eventBus.js';
import GButton from "@/components/shared/buttons/GButton.vue";
import {ST_MENU} from "@/assets/js/localizationConstants.js";

export const useMenuStore = defineStore('menu', () => {
  // State: array of menu button objects
  const menuButtons = ref([
    {
      table: ST_MENU,
      key: '#Play',
      text: 'Find Servers',
      component: markRaw(GButton),
      click: () => emitter.emit('menu:button:play')
    },
    {
      table: ST_MENU,
      key: '#Host',
      text: 'Host server',
      component: markRaw(GButton),
      click: () => emitter.emit('menu:button:host')
    },
    {
      table: ST_MENU,
      key: '#Settings',
      text: 'Settings',
      component: markRaw(GButton),
      click: () => emitter.emit('menu:button:settings')
    },
    {
      table: ST_MENU,
      key: '#Credits',
      text: 'Credits',
      component: markRaw(GButton),
      click: () => emitter.emit('menu:button:credits')
    },
    {
      table: ST_MENU,
      key: '#Social',
      text: 'Social',
      component: markRaw(GButton),
      click: () => emitter.emit('menu:button:social')
    },
    {
      table: ST_MENU,
      key: '#Quit',
      text: 'Quit',
      component: markRaw(GButton),
      click: () => {
        emitter.emit('menu:button:quit');
      }
    }
  ])

  // Getters
  const getButtonByKey = (key) => {
    return menuButtons.value.find(button => button.key === key)
  }

  const getButtonsByTable = (table) => {
    return menuButtons.value.filter(button => button.table === table)
  }

  // Actions
  const addButton = (button) => {
    menuButtons.value.push(button)
  }

  const removeButton = (key) => {
    const index = menuButtons.value.findIndex(button => button.key === key)
    if (index !== -1) {
      menuButtons.value.splice(index, 1)
    }
  }

  const updateButton = (key, updatedButton) => {
    const index = menuButtons.value.findIndex(button => button.key === key)
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
