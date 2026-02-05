import {defineStore} from 'pinia'
import {markRaw, ref} from 'vue'

import {emitter} from '@/assets/js/eventBus.js';
import GButtonCommon from "@/components/shared/buttons/GButtonCommon.vue";
import {ST_MENU} from "@/assets/js/localizationConstants.js";


export const useSettingsStore = defineStore('settings', () => {
  const settingsButtons = ref([
    {
      table: ST_MENU,
      key: '#Graphics',
      text: 'Graphics',
      component: markRaw(GButtonCommon),
      click: () => emitter.emit('menu:settings:button:graphics')
    },
    {
      table: ST_MENU,
      key: '#Audio',
      text: 'Audio',
      component: markRaw(GButtonCommon),
      click: () => emitter.emit('menu:settings:button:audio')
    },
    {
      table: ST_MENU,
      key: '#Input',
      text: 'Input',
      component: markRaw(GButtonCommon),
      click: () => emitter.emit('menu:settings:button:input')
    },
    {
      table: ST_MENU,
      key: '#Misc',
      text: 'Misc',
      component: markRaw(GButtonCommon),
      click: () => emitter.emit('menu:settings:button:misc')
    },
    {
      table: ST_MENU,
      key: '#Mods',
      text: 'Mods',
      component: markRaw(GButtonCommon),
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
