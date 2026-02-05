import {defineStore} from 'pinia'
import {ref} from 'vue'

import {emitter} from '@/assets/js/eventBus.js';
import {ST_MENU} from "@/assets/js/localizationConstants.js";

export const useInputStore = defineStore('input', () => {

  const inputs = ref([
    {
      name: "Movement",
      key: '#Category_Input_Movement',
      table: ST_MENU,
      keyBindings: [
        {
          name: 'Move Forward',
          key: '#Move_Forward',
          table: ST_MENU,
          defaultKey: 'W',
          currentKey: 'W',
        },
        {
          name: 'Move Backward',
          key: '#Move_Backward',
          table: ST_MENU,
          defaultKey: 'S',
          currentKey: 'S',
        },
        {
          name: 'Move Right',
          key: '#Move_Right',
          table: ST_MENU,
          defaultKey: 'D',
          currentKey: 'D',
        },
        {
          name: 'Move Left',
          key: '#Move_Right',
          table: ST_MENU,
          defaultKey: 'A',
          currentKey: 'A',
        }
      ]
    },
    {
      name: "Action",
      key: '#Category_Input_Action',
      table: ST_MENU,
      keyBindings: [
        {
          name: 'Interact',
          key: '#Interact',
          table: ST_MENU,
          defaultKey: 'E',
          currentKey: 'E',
        },
        {
          name: 'Jump',
          key: '#Jump',
          table: ST_MENU,
          defaultKey: 'Space',
          currentKey: 'Space',
        }
      ]
    }
  ]);

  const addCategory = (categoryName, key, table) => {
    const existingCategory = inputs.value.find(cat => cat.name === categoryName);
    if (existingCategory) {
      console.warn(`Category "${categoryName}" already exists`);
      return false;
    }

    inputs.value.push({
      name: categoryName,
      key: key,
      table: table,
      keyBindings: []
    });
    return true;
  };

  const addInput = (categoryName, keyBinding) => {
    const category = inputs.value.find(cat => cat.name === categoryName);
    if (!category) {
      console.error(`Category "${categoryName}" not found`);
      return false;
    }

    const existingBinding = category.keyBindings.find(kb => kb.name === keyBinding.name);
    if (existingBinding) {
      console.warn(`Key binding "${keyBinding.name}" already exists in category "${categoryName}"`);
      return false;
    }

    category.keyBindings.push({
      ...keyBinding,
      currentKey: keyBinding.currentKey || keyBinding.defaultKey
    });
    return true;
  };

  const setCurrentKey = (categoryName, keyName, newValue) => {
    const category = inputs.value.find(cat => cat.name === categoryName);
    if (!category) {
      console.error(`Category "${categoryName}" not found`);
      return false;
    }

    const keyBinding = category.keyBindings.find(kb => kb.name === keyName);
    if (!keyBinding) {
      console.error(`Key binding "${keyName}" not found in category "${categoryName}"`);
      return false;
    }

    keyBinding.currentKey = newValue;
    return true;
  };

  const getCurrentKey = (categoryName, keyName) => {
    const category = inputs.value.find(cat => cat.name === categoryName);
    if (!category) {
      console.error(`Category "${categoryName}" not found`);
      return null;
    }

    const keyBinding = category.keyBindings.find(kb => kb.name === keyName);
    if (!keyBinding) {
      console.error(`Key binding "${keyName}" not found in category "${categoryName}"`);
      return null;
    }

    return keyBinding.currentKey;
  };

  const getKeyObject = (categoryName, keyName) => {
    const category = inputs.value.find(cat => cat.name === categoryName);
    if (!category) {
      console.error(`Category "${categoryName}" not found`);
      return null;
    }

    const keyBinding = category.keyBindings.find(kb => kb.name === keyName);
    if (!keyBinding) {
      console.error(`Key binding "${keyName}" not found in category "${categoryName}"`);
      return null;
    }

    return keyBinding;
  };


  const resetKey = (categoryName, keyName) => {
    const category = inputs.value.find(cat => cat.name === categoryName);
    if (!category) {
      console.error(`Category "${categoryName}" not found`);
      return false;
    }

    const keyBinding = category.keyBindings.find(kb => kb.name === keyName);
    if (!keyBinding) {
      console.error(`Key binding "${keyName}" not found in category "${categoryName}"`);
      return false;
    }

    keyBinding.currentKey = keyBinding.defaultKey;
    return true;
  };

  const resetAllKeys = () => {
    inputs.value.forEach(category => {
      category.keyBindings.forEach(keyBinding => {
        keyBinding.currentKey = keyBinding.defaultKey;
      });
    });
  };


  return {
    inputs,
    addCategory,
    addInput,
    setCurrentKey,
    getCurrentKey,
    getKeyObject,
    resetKey,
    resetAllKeys
  }
});
