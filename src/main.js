import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import store from "@/store";
import naive from "naive-ui";
// 清除浏览器默认样式
import '@/assets/css/clearDefault.scss';

let app = createApp(App)
app.use(router).use(store).use(naive).mount('#app')
