/* 
axios
pinia
sass
vue-router
naive-ui
wangeditor
*/
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import { createDiscreteApi } from 'naive-ui' // ConfigProviderProps, darkTheme, lightTheme
import { createPinia } from 'pinia'
import { router } from './common/router'
import axios from 'axios'
import { useAdminStore } from "./stores/AdminStore";

// ${axios.defaults.baseURL}.category/list
axios.defaults.baseURL = 'http://localhost:8080'

// import App from './App.vue'
const app = createApp(App)
app.provide('axios', axios)

// import { createDiscreteApi,} from 'naive-ui'
const { message, notification, dialog } = createDiscreteApi(
    ['message', 'dialog', 'notification'] // , { configProviderProps: configProviderPropsRef }
)

app.provide('message', message)
app.provide('notification', notification)
app.provide('dialog', dialog)



// import naive from 'naive-ui'
app.use(naive)


// import { createPinia } from 'pinia'
app.use(createPinia())
const adminStore = useAdminStore();
axios.interceptors.request.use((config) => {
    config.headers.token = adminStore.token
    return config
})



// import { router } from './common/router'
app.use(router)


app.mount('#app')
