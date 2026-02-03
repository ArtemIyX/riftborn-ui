<!-- mods/counter/CounterWidget.vue -->
<script setup>
import { useCounterModStore } from './store.js'

const store = useCounterModStore()
</script>

<template>
  <div class="counter-widget">
    <h3>Counter: {{ store.count }}</h3>
    <p>Double: {{ store.doubleCount }}</p>
    <button @click="store.increment()">+</button>
    <button @click="store.decrement()">-</button>
  </div>
</template>

<style scoped>
.counter-widget {
  padding: 20px;
  border: 2px solid #42b983;
  border-radius: 8px;
  margin: 10px 0;
}

button {
  margin: 0 5px;
  padding: 5px 15px;
}
</style>
