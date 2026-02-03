import {defineStore} from 'pinia'
import {ref} from 'vue'

import {emitter} from '@/assets/js/eventBus.js';
import GButtonCommon from "@/components/shared/buttons/GButtonCommon.vue";

export const useSettingsStore = defineStore('settings', () => {
  const settingsButtons = ref([
    {
      table: 'ST_Menu',
      key: '#Graphics',
      text: 'Graphics',
      component: GButtonCommon,
      click: () => emitter.emit('menu:settings:button:graphics')
    },
    {
      table: 'ST_Menu',
      key: '#Audio',
      text: 'Audio',
      component: GButtonCommon,
      click: () => emitter.emit('menu:settings:button:audio')
    },
    {
      table: 'ST_Menu',
      key: '#Input',
      text: 'Input',
      component: GButtonCommon,
      click: () => emitter.emit('menu:settings:button:input')
    },
    {
      table: 'ST_Menu',
      key: '#Misc',
      text: 'Misc',
      component: GButtonCommon,
      click: () => emitter.emit('menu:settings:button:misc')
    },
    {
      table: 'ST_Menu',
      key: '#Mods',
      text: 'Mods',
      component: GButtonCommon,
      click: () => emitter.emit('menu:settings:button:mods')
    }
  ]);

  const addButton = (button) => {
    settingsButtons.value.push(button)
  }

  return {
    settingsButtons,
    addButton
  };
});
