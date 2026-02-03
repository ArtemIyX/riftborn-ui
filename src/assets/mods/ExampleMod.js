// mods/counterMod.js
import { defineStore } from 'pinia'

// Define the store for this mod
const useCounterModStore = defineStore('counterMod', {
  state: () => ({
    count: 0,
    history: []
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
      this.history.push({ action: 'increment', timestamp: Date.now() })
    },
    decrement() {
      this.count--
      this.history.push({ action: 'decrement', timestamp: Date.now() })
    }
  }
})

// Define the mod
export default {
  id: 'counter-mod',
  name: 'Counter Mod',
  version: '1.0.0',
  description: 'A simple counter mod',

  // Pinia stores to inject
  stores: {
    counter: useCounterModStore
  },

  // Install Vue components, directives, etc.
  install(app) {
    // Register a component
    app.component('CounterWidget', {
      setup() {
        const store = useCounterModStore()
        return { store }
      },
      template: `
        <div class="counter-widget">
          <h3>Counter: {{ store.count }}</h3>
          <button @click="store.increment()">+</button>
          <button @click="store.decrement()">-</button>
        </div>
      `
    })
  },

  // Initialize the mod
  init(app, pinia) {
    console.log('Counter mod initialized')
  }
}
