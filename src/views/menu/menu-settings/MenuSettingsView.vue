<style src="./MenuSettings.css" scoped/>

<template>

  <div class="settings-container">
    <SettingsButtons/>
    <GBox class="router-box">
      <router-view/>
    </GBox>
  </div>


</template>

<script setup>

import {useSettingsStore} from "@/stores/settingsStore.js";
import SettingsButtons from "@/components/menu/SettingsButtons.vue";

import {onMounted, onUnmounted} from "vue";
import {emitter} from '@/assets/js/eventBus.js';
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute();

const navigateToSetting = (settingName) => {
  const parentName = route.name; // 'menu-settings' or 'pause-settings'
  const prefix = parentName.split('-')[0]; // 'menu' or 'pause'
  router.push({ name: `${prefix}-${settingName}` });
};

onMounted(() => {
  emitter.on('menu:settings:button:graphics', () => navigateToSetting('graphics'));
  emitter.on('menu:settings:button:audio', () => navigateToSetting('audio'));
  emitter.on('menu:settings:button:input', () => navigateToSetting('input'));
  emitter.on('menu:settings:button:misc', () => navigateToSetting('misc'));
  emitter.on('menu:settings:button:mods', () => navigateToSetting('mods'));

});
onUnmounted(() => {
  emitter.off('menu:settings:button:graphics');
  emitter.off('menu:settings:button:audio');
  emitter.off('menu:settings:button:input');
  emitter.off('menu:settings:button:misc');
  emitter.off('menu:settings:button:mods');

});

;

</script>
