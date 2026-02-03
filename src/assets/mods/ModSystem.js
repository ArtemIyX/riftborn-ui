// mods/modSystem.js
import { markRaw } from 'vue'

class ModSystem {
  constructor() {
    this.mods = []
    this.registeredStores = []
  }

  // Register a mod
  register(mod) {
    if (!mod.id || !mod.name) {
      throw new Error('Mod must have id and name')
    }
    this.mods.push(mod)
    console.log(`Registered mod: ${mod.name}`)
  }

  // Install all mods into the Vue app and Pinia
  install(app, pinia) {
    this.mods.forEach(mod => {
      // Install app-level mods (components, directives, etc.)
      if (mod.install) {
        mod.install(app)
      }

      // Install Pinia stores
      if (mod.stores) {
        Object.entries(mod.stores).forEach(([key, store]) => {
          this.registeredStores.push({ modId: mod.id, key, store })
        })
      }

      // Run initialization logic
      if (mod.init) {
        mod.init(app, pinia)
      }
    })
  }

  // Get all stores from mods
  getStores() {
    return this.registeredStores
  }

  // Get specific mod
  getMod(id) {
    return this.mods.find(mod => mod.id === id)
  }
}

export const modSystem = new ModSystem()
