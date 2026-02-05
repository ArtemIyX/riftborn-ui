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
import {useRouter} from "vue-router";

const router = useRouter();

onMounted(() => {
  emitter.on('menu:settings:button:graphics', () => {
    router.push({name: 'settings-graphics'});
  });

  emitter.on('menu:settings:button:audio', () => {
    router.push({name: 'settings-audio'});
  });

  emitter.on('menu:settings:button:input', () => {
    router.push({name: 'settings-input'});
  });

  emitter.on('menu:settings:button:misc', () => {
    router.push({name: 'settings-misc'});
  });

  emitter.on('menu:settings:button:mods', () => {
    router.push({name: 'settings-mods'});
  });

});
onUnmounted(() => {
  emitter.off('menu:settings:button:graphics');
  emitter.off('menu:settings:button:audio');
  emitter.off('menu:settings:button:input');
  emitter.off('menu:settings:button:misc');
  emitter.off('menu:settings:button:mods');

});

</script>
