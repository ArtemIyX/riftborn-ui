<template>
  <GToastContainer/>

  <section>
    <h2>Basic Horizontal Layout</h2>
    <GFlex gap="1">
      <div class="box">Item 1</div>
      <div class="box">Item 2</div>
      <div class="box">Item 3</div>
    </GFlex>
  </section>

  <section>
    <h2>Vertical Layout</h2>
    <GFlex direction="column" gap="1">
      <div class="box">Item 1</div>
      <div class="box">Item 2</div>
      <div class="box">Item 3</div>
    </GFlex>
  </section>

  <section>
    <h2>Center Alignment</h2>
    <GFlex justify="center" align="center" height="10rem" gap="1">
      <div class="box">Centered Item 1</div>
      <div class="box">Centered Item 2</div>
    </GFlex>
  </section>

</template>

<script setup>

import {ref} from 'vue'
import {useToast} from "@/components/shared/useToast.js";

import { ICON_PATHS, MULTI_PATH_ICONS } from '@/components/iconLibary.js'


const toast = useToast()

</script>

<style scoped>

.demo {
  font-family: Arial, sans-serif;
  padding: 1.25rem;

  min-height: 100vh;
}

.demo-section {
  margin-bottom: 3rem;
}

.demo-section h2 {
  margin-bottom: 1rem;
  color: #555;
  font-size: 1.5rem;
  border-bottom: 0.125rem solid #e0e0e0;
  padding-bottom: 0.5rem;
}

.demo-section h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 1rem;
  font-weight: normal;
}

.demo-col {
  margin-bottom: 0.5rem;
}

.col-content {
  background: #2196f3;
  color: white;
  padding: 1rem;
  text-align: center;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}
</style>
