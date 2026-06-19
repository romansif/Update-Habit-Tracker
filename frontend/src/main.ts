import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query'

import router from '../src/app/router/index'
// @ts-ignore
import '../src/app/styles/main.css'
import App from './App.vue'

const app = createApp(App)

app
    .use(VueQueryPlugin)
    .use(router)
    .mount('#app')
