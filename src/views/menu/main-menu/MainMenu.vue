<style src="./MainMenu.css" scoped/>
<template>
  <!--  <div class=".main-container">

      <GBox class="router-box">
        <router-view/>
      </GBox>
    </div>-->

  <GFlex class="main-container" direction="row" align="center">
    <MenuButtons class="button-box"/>
    <GBox class="router-box">
      <router-view />
    </GBox>

  </GFlex>


</template>

<script setup>
import MenuButtons from "@/components/menu/MenuButtons.vue";

import {emitter} from '@/assets/js/eventBus.js';
import {useRouter} from 'vue-router';
import {onMounted, onUnmounted} from "vue";

const router = useRouter();

onMounted(() => {
  emitter.on('menu:button:play', () => {
    router.push({name: 'menu-play'});
  });

  emitter.on('menu:button:host', () => {

  });

  emitter.on('menu:button:settings', () => {
    router.push({name: 'menu-settings'});
  });

  emitter.on('menu:button:credits', () => {

  });

  emitter.on('menu:button:social', () => {

  });

  emitter.on('menu:button:quit', () => {
    // Handle quit logic
  });
});

onUnmounted(() => {
  emitter.off('menu:button:play');
  emitter.off('menu:button:host');
  emitter.off('menu:button:settings');
  emitter.off('menu:button:credits');
  emitter.off('menu:button:social');
  emitter.off('menu:button:quit');
});

</script>

