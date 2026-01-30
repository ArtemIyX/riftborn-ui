

<template>

  <g-button variant="secondary" text="Hello world" size="large" @click="hello"/>
</template>

<script setup>
import GButton from "@/components/shared/GButton.vue";

const hello = () => {
  console.log("Hello world");
}
</script>

<style scoped>

</style>
