import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import router from './router'
import './style.css'
import '../src/assets/less/index.less'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})
app.mount('#app')