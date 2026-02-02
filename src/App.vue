<template>
  <GToastContainer/>

  <!-- Basic box -->
  <GBox>Content here</GBox>

  <!-- With title and variant -->
  <GBox title="System Status" variant="primary" glow>
    Hull integrity: 100%
  </GBox>

  <!-- Angled with corners -->
  <GBox variant="danger" angled corners>
    CRITICAL WARNING
  </GBox>

  <!-- Custom header/footer -->
  <GBox size="large" variant="secondary">
    <template #header>
      <div class="flex justify-between">
        <span>NAVIGATION</span>
        <span>ONLINE</span>
      </div>
    </template>

    <p>Content goes here</p>

    <template #footer>
      Last updated: 2024-02-02
    </template>
  </GBox>

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
