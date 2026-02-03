<style src="./SettingsInput.css" scoped/>

<template>
  <GHeading>
    <GLocText key="#Input" table="ST_Menu">
      Input
    </GLocText>
  </GHeading>

  <div class="input-settings-container">
    <div class="settings-main">
      <div  >
        <GDivider>
          <GLocText key="#Interact" table="ST_Menu">
            Movement
          </GLocText>
        </GDivider>

        <div class="input-grid">
          <div class="setting-row">
            <GLabel size="large" class="setting-label">Move Forward</GLabel>
            <GKey
              v-model="keyBindings.moveForward"
              size="medium"
              variant="primary"
              @change-start="handleChangeStart('moveForward')"
              @change-complete="handleChangeComplete"
              @change-cancel="handleChangeCancel"
            />
          </div>

          <div class="setting-row">
            <GLabel size="large" class="setting-label">Move Backward</GLabel>
            <GKey
              ref="moveBackwardKey"
              v-model="keyBindings.moveBackward"
              size="medium"
              variant="primary"
              @change-start="handleChangeStart('moveBackward')"
              @change-complete="handleChangeComplete"
              @change-cancel="handleChangeCancel"
            />
          </div>

          <div class="setting-row">
            <GLabel size="large" class="setting-label">Move Left</GLabel>
            <GKey
              ref="moveLeftKey"
              v-model="keyBindings.moveLeft"
              size="medium"
              variant="primary"
              @change-start="handleChangeStart('moveLeft')"
              @change-complete="handleChangeComplete"
              @change-cancel="handleChangeCancel"
            />
          </div>

          <div class="setting-row">
            <GLabel size="large" e class="setting-label">Move Right</GLabel>
            <GKey
              ref="moveRightKey"
              v-model="keyBindings.moveRight"
              size="medium"
              variant="primary"
              @change-start="handleChangeStart('moveRight')"
              @change-complete="handleChangeComplete"
              @change-cancel="handleChangeCancel"
            />
          </div>
        </div>
      </div>
      <div>
        <GDivider>
          <GLocText key="#Interact" table="ST_Menu">
            Interaction
          </GLocText>
        </GDivider>

        <div class="input-grid">
          <div class="setting-row">
            <GLabel size="large" class="setting-label">Interact</GLabel>
            <GKey
              ref="interactKey"
              v-model="keyBindings.interact"
              size="medium"
              variant="secondary"
              @change-start="handleChangeStart('interact')"
              @change-complete="handleChangeComplete"
              @change-cancel="handleChangeCancel"
            />
          </div>

          <div class="setting-row">
            <GLabel size="large" class="setting-label">Fire Weapon</GLabel>
            <GKey
              ref="fireKey"
              v-model="keyBindings.fire"
              size="medium"
              variant="danger"
              @change-start="handleChangeStart('fire')"
              @change-complete="handleChangeComplete"
              @change-cancel="handleChangeCancel"
            />
          </div>

          <div class="setting-row">
            <GLabel size="large" class="setting-label">Use Item</GLabel>
            <GKey
              ref="useItemKey"
              v-model="keyBindings.useItem"
              size="medium"
              variant="warning"
              @change-start="handleChangeStart('useItem')"
              @change-complete="handleChangeComplete"
              @change-cancel="handleChangeCancel"
            />
          </div>
        </div>

      </div>
    </div>
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

const moveBackwardKey = ref(null);
const moveLeftKey = ref(null);
const moveRightKey = ref(null);
const interactKey = ref(null);
const fireKey = ref(null);
const useItemKey = ref(null);

const currentlyChanging = ref(null);

const keyBindings = reactive({
  moveForward: 'W',
  moveBackward: 'S',
  moveLeft: 'A',
  moveRight: 'D',
  interact: 'E',
  fire: 'SPACE',
  useItem: 'F'
});

const defaultBindings = {
  moveForward: 'W',
  moveBackward: 'S',
  moveLeft: 'A',
  moveRight: 'D',
  interact: 'E',
  fire: 'SPACE',
  useItem: 'F'
};

const handleChangeStart = (keyName) => {
  console.log(`Started changing key: ${keyName}`);

  // Cancel any other key that's currently being changed
  if (currentlyChanging.value && currentlyChanging.value !== keyName) {
    cancelCurrentKey();
  }

  currentlyChanging.value = keyName;
};

const handleChangeComplete = (newKey) => {
  console.log(`Key changed to: ${newKey}`);
  currentlyChanging.value = null;
};

const handleChangeCancel = () => {
  console.log('Key change cancelled');
  currentlyChanging.value = null;
};

const cancelCurrentKey = () => {
  // Get the ref name for the current key being changed
  const refMap = {
    moveBackward: moveBackwardKey,
    moveLeft: moveLeftKey,
    moveRight: moveRightKey,
    interact: interactKey,
    fire: fireKey,
    useItem: useItemKey
  };

  const keyRef = refMap[currentlyChanging.value];
  if (keyRef && keyRef.value) {
    keyRef.value.cancel();
  }
};

const resetToDefaults = () => {
  Object.assign(keyBindings, defaultBindings);
  console.log('Key bindings reset to defaults');
};

</script>
