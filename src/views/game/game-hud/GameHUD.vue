<template>
<div class="test">
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum quae temporibus vero? At dolor ducimus fuga, laboriosam mollitia possimus sed totam voluptates! Amet architecto consectetur, consequatur excepturi exercitationem reprehenderit similique? </p>
</div>
</template>

<style scoped>
.test {
  width: 100vh;
  height: 100vh;
  background-color: darkolivegreen;
}
</style>
<script setup>
import {emitter} from "@/assets/js/eventBus.js";
import {onMounted} from "vue";

onMounted(() => {
  emitter.emit('ue:view', {
    name: "game"
  });
})
</script>
