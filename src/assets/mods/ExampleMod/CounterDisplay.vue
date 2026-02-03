<!-- mods/counter/CounterDisplay.vue -->
<script setup>
import { useCounterModStore } from './store'

const props = defineProps({
  showHistory: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Counter'
  },
  multiplier: {
    type: Number,
    default: 1
  }
})

const store = useCounterModStore()
</script>

<template>
  <div class="counter-display">
    <h3>{{ title }}</h3>
    <p>Count: {{ store.count * multiplier }}</p>
    <p>Double: {{ store.doubleCount * multiplier }}</p>

    <div v-if="showHistory" class="history">
      <h4>History:</h4>
      <ul>
        <li v-for="(item, index) in store.history" :key="index">
          {{ item.action }} at {{ new Date(item.timestamp).toLocaleTimeString() }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.counter-display {
  padding: 20px;
  border: 2px solid #42b983;
  border-radius: 8px;
  margin: 10px 0;
}

.history {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ccc;
}

.history ul {
  list-style: none;
  padding: 0;
}

.history li {
  padding: 5px 0;
  font-size: 0.9em;
}
</style>
