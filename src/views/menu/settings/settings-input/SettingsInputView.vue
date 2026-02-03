<style src="./SettingsInput.css" scoped/>

<template>
  <GHeading>
    <GLocText key="#Input" table="ST_Menu">
      Input
    </GLocText>
  </GHeading>

  <div class="input-settings-container">
    <div class="settings-main">
      <div v-for="category in inputStore.inputs" :key="category.name">
        <GDivider>
          <GLocText :key="category.key" :table="category.table">
            {{ category.name }}
          </GLocText>
        </GDivider>
        <div class="input-grid">
          <div class="setting-row" v-for="inputData in category.keyBindings">
            <GLabel>
              <GLocText :key="inputData.key" :table="category.table">
                {{ inputData.name }}
              </GLocText>
            </GLabel>
            <GKey>

            </GKey>
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
import {useInputStore} from "@/stores/inputStore.js";

const inputStore = useInputStore();


</script>
