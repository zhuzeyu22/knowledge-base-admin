import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import router from './router'
import './style.css'
import '../src/assets/less/index.less'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import { useUserStore } from '@/store/user'
import { useTeamStore } from '@/store/team'

const pinia = createPinia()

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)

// 全局初始化
const userStore = useUserStore()
const teamStore = useTeamStore()
try {
  userStore.updatePermission()
  userStore.updateUserInfo().then(async () => {
    await teamStore.updatePrivateTenantId()
    await teamStore.updateRoleList();
    await teamStore.refreshTeamList();
  });
} catch (e) {
  console.log(e)
}

app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})
app.mount('#app')