<template>
  <GToastContainer/>
  <div class="demo">


    <!-- Standard container -->
    <section class="demo-section">
      <h2>Standard Container (max-width: lg)</h2>
      <g-container class="demo-box">
        <p>This is a standard container with default max-width (lg = 1280px). It's centered and has padding.</p>
      </g-container>
    </section>


  </div>

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
  padding: 20px;
  background: #fafafa;
  min-height: 100vh;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.demo-section {
  margin-bottom: 40px;
}

.demo-section h2 {
  margin-bottom: 16px;
  color: #555;
  font-size: 18px;
}

.demo-box {
  background: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  min-height: 60px;
}

.demo-box p {
  margin: 0;
  color: #666;
}

.demo-box-inner {
  margin-top: 16px;
  background: #f5f5f5;
  border: 2px dashed #bdbdbd;
}

</style>
