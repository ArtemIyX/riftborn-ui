// mods/modSystem.js
import { markRaw } from 'vue'

class ModSystem {
  constructor() {
    this.mods = []
    this.registeredStores = []
    this.app = null
  }

  register(mod) {
    if (!mod.id || !mod.name) {
      throw new Error('Mod must have id and name')
    }
    this.mods.push(mod)
    console.log(`Registered mod: ${mod.name}`)
  }

  install(app, pinia) {
    this.app = app // Store app instance

    this.mods.forEach(mod => {
      // Install app-level mods (components, directives, etc.)
      if (mod.install) {
        mod.install(app)
      }

      // Register components globally (optional)
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

      // Run initialization logic
      if (mod.init) {
        mod.init(app, pinia)
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

  // Get component from any mod
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

  // List all available components
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
