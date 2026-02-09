<style scoped src="./PauseMenu.css"/>


<template>
  <GFlex class="main-container" direction="row" align="center">
    <PauseButtons/>
    <div class="router-box">
      <router-view/>
    </div>
  </GFlex>

  <BackToMenuModal
    v-model="showQuitConfirm"
    @yes="handleQuitYes"
    @no="handleQuitNo"/>

</template>


<script setup>


import {useRouter} from "vue-router";
import {onMounted, onUnmounted, ref} from "vue";
import {emitter} from "@/assets/js/eventBus.js";

import PauseButtons from "@/components/menu/PauseButtons.vue";
import BackToMenuModal from "@/components/menu/modals/BackToMenuModal.vue";

const router = useRouter();
const showQuitConfirm = ref(false);

const handleQuitYes = () => {
  showQuitConfirm.value = false
  emitter.emit("ue:exit");
};

const handleQuitNo = () => {
  showQuitConfirm.value = false
};

onMounted(() => {
  emitter.on('pause:button:continue', () => {
    emitter.emit("ue:pause:continue");
  });

  emitter.on('pause:button:settings', () => {
    router.push({name: 'pause-graphics'});
  });

  emitter.on('pause:button:exit', () => {
    showQuitConfirm.value = true;
  });

  emitter.emit('ue:view', {
    name: "pause"
  });
});

onUnmounted(() => {
  emitter.off('pause:button:continue');
  emitter.off('pause:button:settings');
  emitter.off('pause:button:exit');
});
</script>
