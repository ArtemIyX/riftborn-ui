<template>
  <GToastContainer/>
  <div class="demo">
    <h1>GRow & GCol Demo</h1>

    <!-- Basic Grid -->
    <section class="demo-section">
      <h2>Basic Grid (12 column system)</h2>
      <g-container>
        <g-row>
          <g-col :cols="12" class="demo-col">
            <div class="col-content">cols="12"</div>
          </g-col>
        </g-row>
        <g-row>
          <g-col :cols="6" class="demo-col">
            <div class="col-content">cols="6"</div>
          </g-col>
          <g-col :cols="6" class="demo-col">
            <div class="col-content">cols="6"</div>
          </g-col>
        </g-row>
        <g-row>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">cols="4"</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">cols="4"</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">cols="4"</div>
          </g-col>
        </g-row>
        <g-row>
          <g-col :cols="3" class="demo-col">
            <div class="col-content">cols="3"</div>
          </g-col>
          <g-col :cols="3" class="demo-col">
            <div class="col-content">cols="3"</div>
          </g-col>
          <g-col :cols="3" class="demo-col">
            <div class="col-content">cols="3"</div>
          </g-col>
          <g-col :cols="3" class="demo-col">
            <div class="col-content">cols="3"</div>
          </g-col>
        </g-row>
      </g-container>
    </section>

    <!-- Responsive Grid -->
    <section class="demo-section">
      <h2>Responsive Grid (resize window to see changes)</h2>
      <g-container>
        <g-row>
          <g-col :cols="12" :sm="6" :md="4" :lg="3" class="demo-col">
            <div class="col-content">
              <div>xs: 12</div>
              <div>sm: 6</div>
              <div>md: 4</div>
              <div>lg: 3</div>
            </div>
          </g-col>
          <g-col :cols="12" :sm="6" :md="4" :lg="3" class="demo-col">
            <div class="col-content">
              <div>xs: 12</div>
              <div>sm: 6</div>
              <div>md: 4</div>
              <div>lg: 3</div>
            </div>
          </g-col>
          <g-col :cols="12" :sm="6" :md="4" :lg="3" class="demo-col">
            <div class="col-content">
              <div>xs: 12</div>
              <div>sm: 6</div>
              <div>md: 4</div>
              <div>lg: 3</div>
            </div>
          </g-col>
          <g-col :cols="12" :sm="6" :md="4" :lg="3" class="demo-col">
            <div class="col-content">
              <div>xs: 12</div>
              <div>sm: 6</div>
              <div>md: 4</div>
              <div>lg: 3</div>
            </div>
          </g-col>
        </g-row>
      </g-container>
    </section>

    <!-- Justify Content -->
    <section class="demo-section">
      <h2>Justify Content</h2>
      <g-container>
        <h3>justify="start"</h3>
        <g-row justify="start">
          <g-col :cols="3" class="demo-col">
            <div class="col-content">Col 1</div>
          </g-col>
          <g-col :cols="3" class="demo-col">
            <div class="col-content">Col 2</div>
          </g-col>
        </g-row>

        <h3>justify="center"</h3>
        <g-row justify="center">
          <g-col :cols="3" class="demo-col">
            <div class="col-content">Col 1</div>
          </g-col>
          <g-col :cols="3" class="demo-col">
            <div class="col-content">Col 2</div>
          </g-col>
        </g-row>

        <h3>justify="end"</h3>
        <g-row justify="end">
          <g-col :cols="3" class="demo-col">
            <div class="col-content">Col 1</div>
          </g-col>
          <g-col :cols="3" class="demo-col">
            <div class="col-content">Col 2</div>
          </g-col>
        </g-row>

        <h3>justify="space-between"</h3>
        <g-row justify="space-between">
          <g-col :cols="3" class="demo-col">
            <div class="col-content">Col 1</div>
          </g-col>
          <g-col :cols="3" class="demo-col">
            <div class="col-content">Col 2</div>
          </g-col>
          <g-col :cols="3" class="demo-col">
            <div class="col-content">Col 3</div>
          </g-col>
        </g-row>
      </g-container>
    </section>

    <!-- Align Items -->
    <section class="demo-section">
      <h2>Align Items (Vertical Alignment)</h2>
      <g-container>
        <h3>align="start"</h3>
        <g-row align="start" style="min-height: 8rem; background: #f0f0f0;">
          <g-col :cols="4" class="demo-col">
            <div class="col-content">Col 1</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content" style="padding: 2rem 1rem;">Col 2<br>Taller</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">Col 3</div>
          </g-col>
        </g-row>

        <h3>align="center"</h3>
        <g-row align="center" style="min-height: 8rem; background: #f0f0f0;">
          <g-col :cols="4" class="demo-col">
            <div class="col-content">Col 1</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content" style="padding: 2rem 1rem;">Col 2<br>Taller</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">Col 3</div>
          </g-col>
        </g-row>

        <h3>align="end"</h3>
        <g-row align="end" style="min-height: 8rem; background: #f0f0f0;">
          <g-col :cols="4" class="demo-col">
            <div class="col-content">Col 1</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content" style="padding: 2rem 1rem;">Col 2<br>Taller</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">Col 3</div>
          </g-col>
        </g-row>
      </g-container>
    </section>

    <!-- Offset -->
    <section class="demo-section">
      <h2>Column Offset</h2>
      <g-container>
        <g-row>
          <g-col :cols="4" :offset="4" class="demo-col">
            <div class="col-content">offset="4"</div>
          </g-col>
        </g-row>
        <g-row>
          <g-col :cols="3" :offset="3" class="demo-col">
            <div class="col-content">offset="3"</div>
          </g-col>
          <g-col :cols="3" :offset="3" class="demo-col">
            <div class="col-content">offset="3"</div>
          </g-col>
        </g-row>
      </g-container>
    </section>

    <!-- No Gutters -->
    <section class="demo-section">
      <h2>No Gutters</h2>
      <g-container>
        <g-row no-gutters>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">No gutter</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">No gutter</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">No gutter</div>
          </g-col>
        </g-row>
      </g-container>
    </section>

    <!-- Dense Spacing -->
    <section class="demo-section">
      <h2>Dense Spacing</h2>
      <g-container>
        <g-row dense>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">Dense</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">Dense</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">Dense</div>
          </g-col>
        </g-row>
      </g-container>
    </section>

    <!-- Custom Spacing -->
    <section class="demo-section">
      <h2>Custom Spacing</h2>
      <g-container>
        <g-row :spacing="6">
          <g-col :cols="4" class="demo-col">
            <div class="col-content">spacing="6"</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">spacing="6"</div>
          </g-col>
          <g-col :cols="4" class="demo-col">
            <div class="col-content">spacing="6"</div>
          </g-col>
        </g-row>
      </g-container>
    </section>

    <!-- Auto Width -->
    <section class="demo-section">
      <h2>Auto Width Columns</h2>
      <g-container>
        <g-row>
          <g-col auto class="demo-col">
            <div class="col-content">Auto width</div>
          </g-col>
          <g-col auto class="demo-col">
            <div class="col-content">Auto width with more content</div>
          </g-col>
          <g-col auto class="demo-col">
            <div class="col-content">Auto</div>
          </g-col>
        </g-row>
      </g-container>
    </section>

    <!-- Grow and Shrink -->
    <section class="demo-section">
      <h2>Grow & Shrink</h2>
      <g-container>
        <g-row>
          <g-col :cols="3" class="demo-col">
            <div class="col-content">Fixed: 3</div>
          </g-col>
          <g-col :cols="3" grow class="demo-col">
            <div class="col-content">Grow: 3 + grow</div>
          </g-col>
          <g-col :cols="3" class="demo-col">
            <div class="col-content">Fixed: 3</div>
          </g-col>
        </g-row>
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
