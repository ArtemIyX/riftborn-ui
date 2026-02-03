<template>

  <MenuButtons class="menu-box"/>

</template>

<script setup>
import MenuButtons from "@/components/menu/MenuButtons.vue";
import {ref} from "vue";
import {emitter} from '@/assets/js/eventBus.js';

emitter.on('menu:button:play', () => {

});
emitter.on('menu:button:host', () => {

});
emitter.on('menu:button:settings', () => {

});
emitter.on('menu:button:credits', () => {

});
emitter.on('menu:button:social', () => {

});
emitter.on('menu:button:quit', () => {

});


</script>

<style src="./MainMenu.css" scoped/>
