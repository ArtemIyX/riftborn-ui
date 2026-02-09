<style src="./MainMenu.css" scoped/>
<template>

  <!--  <UImage style="width: 100px; height: 100px" :lazyLoad="false"
            asset-path="/Game/Barich/Assets/Textures/UI/Menu/T_House.T_House" @error="imgError"
            @load="imgLoad"
            :show-corners="false"/>-->
  <GFlex class="main-container" direction="row" align="center">
    <MenuButtons/>
    <div class="router-box">
      <router-view/>
    </div>
  </GFlex>

  <QuitModal
    v-model="showQuitConfirm"
    @yes="handleQuitYes"
    @no="handleQuitNo"/>

</template>

<script setup>
import MenuButtons from "@/components/menu/MenuButtons.vue";


import {emitter} from '@/assets/js/eventBus.js';
import {useRouter} from 'vue-router';
import {onMounted, onUnmounted, ref} from "vue";
import {ST_MENU} from "@/assets/js/localizationConstants.js";
import UEImage from "@/components/shared/u-image/UImage.vue";
import QuitModal from "@/views/menu/settings/quit-modal/QuitModal.vue";


const router = useRouter();
const showQuitConfirm = ref(false)


const handleQuitYes = () => {
  showQuitConfirm.value = false
  emitter.emit("ue:quit");
}

const handleQuitNo = () => {
  showQuitConfirm.value = false
}

onMounted(() => {

  emitter.on('menu:button:play', () => {
    router.push({name: 'menu-play'});
  });

  emitter.on('menu:button:host', () => {
    emitter.emit('ue:host');
  });

  emitter.on('menu:button:settings', () => {
    router.push({name: 'settings-graphics'});
  });

  emitter.on('menu:button:credits', () => {

  });

  emitter.on('menu:button:social', () => {

  });

  emitter.on('menu:button:quit', () => {
    showQuitConfirm.value = true;
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

