import {defineStore} from 'pinia'
import {ref} from 'vue'

import {emitter} from '@/assets/js/eventBus.js';

export const useInputStore = defineStore('settings', () => {

  const inputs = ref([
    {
      name: "Movement",
      key: '#Category_Input_Movement',
      table: 'ST_Menu',
      keyBindings: [
        {
          name: 'Move_Forward',
          key: '#Move_Forward',
          table: 'ST_Menu',
          defaultKey: 'W',
          currentKey: 'W',
        },
        {
          name: 'Move_Backward',
          key: '#Move_Backward',
          table: 'ST_Menu',
          defaultKey: 'S',
          currentKey: 'S',
        },
        {
          name: 'Move_Right',
          key: '#Move_Right',
          table: 'ST_Menu',
          defaultKey: 'D',
          currentKey: 'D',
        },
        {
          name: 'Move_Left',
          key: '#Move_Right',
          table: 'ST_Menu',
          defaultKey: 'A',
          currentKey: 'A',
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
