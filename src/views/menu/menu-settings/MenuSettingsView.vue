<style src="./MenuSettings.css" scoped/>

<template>

  <GHeading>
    <GLocText table="ST_Menu" key="#Settings">Settings</GLocText>
  </GHeading>

  <div class="settings-container">
    <GBox size="small" class="button-container">
      <GButtonCommon>
        <GLocText table="ST_Menu" key="#Settings">Settings</GLocText>
      </GButtonCommon>
      <GButtonCommon>
        <GLocText table="ST_Menu" key="#Settings">Settings</GLocText>
      </GButtonCommon>
      <GButtonCommon>
        <GLocText table="ST_Menu" key="#Settings">Settings</GLocText>
      </GButtonCommon>
      <GButtonCommon>
        <GLocText table="ST_Menu" key="#Settings">Settings</GLocText>
      </GButtonCommon>
    </GBox>

    <GBox class="router-box">
      <router-view/>
    </GBox>
  </div>


</template>

<script setup>

</script>
