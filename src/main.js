import './assets/main.css'

import { createApp } from 'vue'

import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import store from './stores'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice'
import VueCookies from 'vue-cookies'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'light',
      cssLayer: false
    }
  }
})

// Change the secure option to true
app.use(VueCookies, { expires: '7d', secure: false, sameSite: 'strict'})

app.use(router)
app.use(Toast)
app.use(store)
app.use(DialogService)
app.use(ToastService)

app.mount('#app')
