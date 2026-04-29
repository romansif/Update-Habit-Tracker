import { createApp } from 'vue';

import router from './app/router'
import './app/styles/main.css'
import App from './App.vue'

const app = createApp(App)

app
   .use(router)
   .mount('#app')
