import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "./assets/css/vendors.bundle.css"
import './assets/css/app.bundle.css'
import './assets/css/themes/cust-theme-4.css'
import './assets/css/fa-brands-rtl.css'
import './assets/css/fa-brands.css'
import './assets/css/fa-regular-rtl.css'
import './assets/css/fa-regular.css'
import './assets/css/fa-solid-rtl.css'
import './assets/css/fa-solid.css'

createApp(App).use(router).mount('#app')
