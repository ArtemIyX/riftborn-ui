// mods/counter/store.js
import { defineStore } from 'pinia'

export const useCounterModStore = defineStore('counterMod', {
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
