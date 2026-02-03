// mods/modSystem.js
import { markRaw } from 'vue'

class ModSystem {
  constructor() {
    this.mods = []
    this.registeredStores = []
    this.projectStores = {} // Store references to project stores
    this.app = null
    this.pinia = null
  }

  // Register project stores that mods can access
  registerProjectStore(name, store) {
    this.projectStores[name] = store
    console.log(`Registered project store: ${name}`)
  }

  // Register multiple project stores at once
  registerProjectStores(stores) {
    Object.entries(stores).forEach(([name, store]) => {
      this.registerProjectStore(name, store)
    })
  }

  // Get a project store
  getProjectStore(name) {
    return this.projectStores[name]
  }

  // Get all project stores
  getProjectStores() {
    return this.projectStores
  }

  register(mod) {
    if (!mod.id || !mod.name) {
      throw new Error('Mod must have id and name')
    }
    this.mods.push(mod)
    console.log(`Registered mod: ${mod.name}`)
  }

  install(app, pinia) {
    this.app = app
    this.pinia = pinia

    this.mods.forEach(mod => {
      // Pass project stores to mod during installation
      const context = {
        app,
        pinia,
        projectStores: this.projectStores,
        modSystem: this
      }

      // Install app-level mods
      if (mod.install) {
        mod.install(app, context)
      }

      // Register components globally
      if (mod.components) {
        Object.entries(mod.components).forEach(([name, component]) => {
          const componentName = mod.config?.componentPrefix
            ? `${mod.config.componentPrefix}${name}`
            : name
          app.component(componentName, component)
        })
      }

      // Install Pinia stores
      if (mod.stores) {
        Object.entries(mod.stores).forEach(([key, store]) => {
          this.registeredStores.push({ modId: mod.id, key, store })
        })
      }

      // Run initialization logic with context
      if (mod.init) {
        mod.init(app, pinia, context)
      }
    })
  }

  getStores() {
    return this.registeredStores
  }

  getMod(id) {
    return this.mods.find(mod => mod.id === id)
  }

  getApp() {
    return this.app
  }

  getPinia() {
    return this.pinia
  }

  getComponent(name, modId = null) {
    if (modId) {
      const mod = this.getMod(modId)
      return mod?.components?.[name] || null
    }

    for (const mod of this.mods) {
      if (mod.components?.[name]) {
        return mod.components[name]
      }
    }
    return null
  }

  listComponents() {
    const components = []
    this.mods.forEach(mod => {
      if (mod.components) {
        Object.keys(mod.components).forEach(name => {
          components.push({
            name,
            modId: mod.id,
            modName: mod.name
          })
        })
      }
    })
    return components
  }
}

export const modSystem = new ModSystem()
