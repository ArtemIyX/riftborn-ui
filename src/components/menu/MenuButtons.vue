<template>
  <GBox class="menu-buttons">
    <GStack>
      <slot/>
    </GStack>
  </GBox>

</template>

<script setup>

</script>


<style scoped>
.menu-buttons {
  /* Container sizing */
  width: clamp(200px, 25vw, 400px);
  min-height: min-content;
  max-height: 80vh;

  /* Spacing */
  padding: clamp(1rem, 2vw, 2rem);
}
</style>
