import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/fonts/fonts.css'
import './assets/styles/global.css'
import './assets/styles/colors.css'
import {colors} from "@/colors.js";

const app = createApp(App)


app.use(router)

app.mount('#app')
