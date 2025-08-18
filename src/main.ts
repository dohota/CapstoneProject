import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
//import instance from './axio'; // 引入自定义axios 实例
import '@/assets/style/reset.css'

const app = createApp(App)
// 将 axios 添加到 Vue 原型上，这样就可以通过 this.$http 访问
//app.config.globalProperties.$http = instance;
app.use(createPinia())
app.use(router)
app.mount('#app')