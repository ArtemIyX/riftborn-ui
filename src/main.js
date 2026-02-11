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
import {useLocalizationStore} from "@/stores/localizationStore.js";
import {useUnrealStore} from "@/stores/UnrealStore.js";
import {usePauseStore} from "@/stores/pauseStore.js";
import {emitter} from "@/assets/js/eventBus.js";


const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

/*router.afterEach(() => {
  // Notify UE5 after every route change
  if (window.ue && window.ue.handler && window.ue.handler.vueready) {
    window.ue.handler.vueready();
  }
});*/

window.router = router;
window.navigateTo = async (args) => {
  await router.push(args);
}

const inputStore = useInputStore();
const settingsStore = useSettingsStore();
const menuStore = useMenuStore();
const localizationStore = useLocalizationStore();
const unrealStore = useUnrealStore();
const pauseStore = usePauseStore();

const stores = {
  input: inputStore,
  settings: settingsStore,
  menu: menuStore,
  pause: pauseStore,
  localization: localizationStore,
  unreal: unrealStore,
}

window.stores = stores;

modSystem.registerProjectStores(stores);
modSystem.register(ExampleMod)

modSystem.install(app, pinia)

app.mount('#app')

/*
emitter.emit('ue:app:ready');

if (window.ue && window.ue.handler && window.ue.handler.vueready) {
  window.ue.handler.vueready();
}
*/
