<style src="./SettingsInput.css" scoped/>

<template>
  <GHeading>
    <GLocText key="#Input" table="ST_Menu">
      Input
    </GLocText>
  </GHeading>

  <!-- Flex container -->
  <div class="input-settings-container">

    <!-- Occupies free space + scroll bar -->
    <div class="settings-main">

      <!-- For each category -->
      <div v-for="category in inputStore.inputs" :key="category.name">

        <!-- Category title -->
        <GDivider>
          <GLocText :key="category.key" :table="category.table">
            {{ category.name }}
          </GLocText>
        </GDivider>

        <!-- Category input items -->
        <div class="input-grid">
          <div class="setting-row" v-for="inputData in category.keyBindings" :key="inputData.name">
            <GLabel>
              <GLocText :key="inputData.key" :table="category.table">
                {{ inputData.name }}
              </GLocText>
            </GLabel>
            <GKey
              :ref="(el) => setKeyRef(category.name, inputData.name, el)"
              v-model="inputData.currentKey"
              @change-start="handleChangeStart(category.name, inputData.name)"
              @change-complete="(newValue) => handleChangeComplete(category.name, inputData.name, newValue)"
              @change-cancel="handleChangeCancel"
            >
            </GKey>
          </div>
        </div>
      </div>
    </div>

    <!-- Always on bottom of page -->
    <div class="settings-footer">
      <GButtonCommon @click="resetToDefaults" style="width: 100%">
        <GLocText key="#ResetToDefaults" table="ST_Menu">
          Reset to defaults
        </GLocText>
      </GButtonCommon>
    </div>
  </div>
</template>

<script setup>

import {reactive, ref} from "vue";
import {useInputStore} from "@/stores/inputStore.js";

const inputStore = useInputStore();

// Track which key is currently being listened to
const activeListeningKey = ref(null);

// Store refs to all GKey components
const keyRefs = ref({});

const setKeyRef = (categoryName, keyName, el) => {
  if (el) {
    const refKey = `${categoryName}_${keyName}`;
    keyRefs.value[refKey] = el;
  }
};

const handleChangeStart = (categoryName, keyName) => {
  const currentRefKey = `${categoryName}_${keyName}`;

  // If there's already an active key being listened to and it's not this one
  if (activeListeningKey.value && activeListeningKey.value !== currentRefKey) {
    // Cancel the previously listening key
    const previousKey = keyRefs.value[activeListeningKey.value];
    if (previousKey && previousKey.cancel) {
      previousKey.cancel();
    }
  }

  // Set this key as the active listening key
  activeListeningKey.value = currentRefKey;
};

const handleChangeComplete = (categoryName, keyName, newValue) => {
  // Update the store with the new key value
  inputStore.setCurrentKey(categoryName, keyName, newValue);

  // Clear the active listening key
  activeListeningKey.value = null;
};

const handleChangeCancel = () => {
  // Clear the active listening key
  activeListeningKey.value = null;
};

const resetToDefaults = () => {
  // Cancel any active listening
  if (activeListeningKey.value) {
    const activeKey = keyRefs.value[activeListeningKey.value];
    if (activeKey && activeKey.cancel) {
      activeKey.cancel();
    }
    activeListeningKey.value = null;
  }

  // Reset all keys to defaults
  inputStore.resetAllKeys();
};

</script>
