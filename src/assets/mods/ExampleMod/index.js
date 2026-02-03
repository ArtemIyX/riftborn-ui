// mods/counter/index.js
import { useCounterModStore } from './store'
import CounterWidget from './CounterWidget.vue'
import CounterDisplay from './CounterDisplay.vue'

export default {
  id: 'counter-mod',
  name: 'Counter Mod',
  version: '1.0.0',
  description: 'A simple counter mod',

  // Export components (can be used with ModComponent)
  components: {
    CounterWidget,
    CounterDisplay
  },

  stores: {
    counter: useCounterModStore
  },

  // Optional: prefix for global component registration
  config: {
    componentPrefix: 'Counter' // Components will be registered as CounterWidget, CounterDisplay
  },

  install(app) {
    console.log('Counter mod installing components')
  },

  init(app, pinia) {
    console.log('Counter mod initialized')
  }
}
