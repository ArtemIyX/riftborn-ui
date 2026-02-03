<template>

  <MenuButtons class="menu-box">

  </MenuButtons>
</template>

<script setup>

import MenuButtons from "@/components/menu/MenuButtons.vue";
import {ref} from "vue";


const handleButtonClick = (button) => {
  if (button.onClick && typeof button.onClick === 'function') {
    button.onClick();
  }
};


</script>

<style src="./MainMenu.css" scoped/>
