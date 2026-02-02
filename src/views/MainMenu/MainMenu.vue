<template>

  <MenuButtons class="menu-box">
    <GButton>
      <GLocText :table="locTable" key="#Play">Play</GLocText>
    </GButton>
    <GButton>
      <GLocText :table="locTable" key="#FindServers">Find servers</GLocText>
    </GButton>
    <GButton>
      <GLocText :table="locTable" key="#Settings">Settings</GLocText>
    </GButton>
    <GButton>
      <GLocText :table="locTable" key="#Credits">Credits</GLocText>
    </GButton>
    <GButton>
      <GLocText :table="locTable" key="#Social">Social</GLocText>
    </GButton>
    <GButton>
      <GLocText :table="locTable" key="#Quit">Quit</GLocText>
    </GButton>
  </MenuButtons>
</template>

<script setup>

import MenuButtons from "@/components/menu/MenuButtons.vue";

const locTable = 'ST_Menu';

</script>

<style src="./MainMenu.css" scoped/>
