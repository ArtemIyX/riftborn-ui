

<template>

  <g-button variant="primary" text="Hello world"  @click="hello"/>
  <g-button-adv variant="success" text="Hello world" @click="hello"/>
  <g-button-common variant="danger" text="Hello world" @click="hello"/>
</template>

<script setup>
import GButton from "@/components/shared/buttons/GButton.vue";
import GButtonAdv from "@/components/shared/buttons/GButtonAdv.vue";
import GButtonCommon from "@/components/shared/buttons/GButtonCommon.vue";

const hello = () => {
  console.log("Hello world");
}
</script>

<style scoped>

</style>
