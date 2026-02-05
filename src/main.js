import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import './assets/fonts/fonts.css'
import './assets/styles/global.css'
import './assets/styles/colors.css'
import './assets/styles/utility-colors.css'
import {colors} from "@/colors.js";
import {createPinia} from "pinia";
import {modSystem} from './assets/mods/modSystem'

import ExampleMod from './assets/mods/ExampleMod'

const pinia = createPinia()
const app = createApp(App)

window.navigateTo = async (args) => {
  await router.push(args);
}

modSystem.register(ExampleMod)

app.use(pinia)
app.use(router)

modSystem.install(app, pinia)

app.mount('#app')
