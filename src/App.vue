

<template>

  <g-button variant="primary" text="Hello world"  @click="hello"/>
  <g-button-adv variant="success" text="Hello world" @click="hello"/>
  <g-button-common variant="danger" text="Hello world" @click="hello"/>
</template>

<script setup>
import GButton from "@/components/shared/GButton.vue";
import GButtonAdv from "@/components/shared/GButtonAdv.vue";
import GButtonCommon from "@/components/shared/GButtonCommon.vue";

const hello = () => {
  console.log("Hello world");
}
</script>

<style scoped>

</style>
