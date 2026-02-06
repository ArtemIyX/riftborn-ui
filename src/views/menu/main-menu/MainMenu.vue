<style src="./MainMenu.css" scoped/>
<template>

  <GFlex class="main-container" direction="row" align="center">
    <MenuButtons/>
    <div class="router-box">
      <router-view/>
    </div>
  </GFlex>

  <GModal
    v-model="showQuitConfirm"
    title="CONFIRM QUIT"
    variant="default"

    :persistent="true"
    :close-button="false"
  >
    <template #title>
      <GHeading>
        <GLocText code="#QuitConfirm" :table="ST_MENU">Are you sure?</GLocText>
      </GHeading>
    </template>
    <!-- Content slot -->
    <template #default>
      <GText size="large">
        <GLocText code="#QuitInfo" :table="ST_MENU">Are you sure you want to quit the game?
        </GLocText>
      </GText>
    </template>

    <!-- Actions slot with Yes/No buttons -->
    <template #actions>
      <GButton @click="handleQuitYes" variant="warning">
        <GText>
          <GLocText code="#Yes" :table="ST_MENU">Yes</GLocText>
        </GText>
      </GButton>
      <GButton @click="handleQuitNo">
        <GText>
          <GLocText code="#No" :table="ST_MENU">No</GLocText>
        </GText>
      </GButton>
    </template>
  </GModal>
</template>

<script setup>
import MenuButtons from "@/components/menu/MenuButtons.vue";


import {emitter} from '@/assets/js/eventBus.js';
import {useRouter} from 'vue-router';
import {onMounted, onUnmounted, ref} from "vue";
import {ST_MENU} from "@/assets/js/localizationConstants.js";


const router = useRouter();
const showQuitConfirm = ref(false)


const handleQuitYes = () => {
  showQuitConfirm.value = false
  emitter.emit("ue:quit");
  // Add your quit logic here
}

const handleQuitNo = () => {
  showQuitConfirm.value = false
}

onMounted(() => {

  emitter.on('menu:button:play', () => {
    router.push({name: 'menu-play'});
  });

  emitter.on('menu:button:host', () => {

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

