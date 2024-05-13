import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus' // 导入Element Plus
import 'element-plus/dist/index.css' // 导入Element Plus的CSS

// 创建Vue应用实例，并注册store（状态管理）、router（路由管理）
const app = createApp(App)

// 使用Element Plus
app.use(ElementPlus)

// 注册Vuex store和Vue Router
app.use(store).use(router)

// 挂载Vue应用实例到DOM
app.mount('#app')