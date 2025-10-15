import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import './style.css'
import '../src/assets/less/index.less'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.mount('#app')