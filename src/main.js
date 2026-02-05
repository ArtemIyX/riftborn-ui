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
import {useInputStore} from "@/stores/inputStore.js";
import {useSettingsStore} from "@/stores/settingsStore.js";
import {useMenuStore} from "@/stores/mainMenuStore.js";
import {useLocalizationStore} from "@/stores/useLocalizationStore.js";

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)

const inputStore = useInputStore();
const settingsStore = useSettingsStore();
const menuStore = useMenuStore();
const localizationStore = useLocalizationStore();

const stores = {
  input: inputStore,
  settings: settingsStore,
  menu: menuStore,
  localization: localizationStore,
}
window.navigateTo = async (args) => {
  await router.push(args);
}
window.stores = stores;

modSystem.registerProjectStores(stores);
modSystem.register(ExampleMod)

modSystem.install(app, pinia)

app.mount('#app')
