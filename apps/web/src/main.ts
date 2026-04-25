import "@/assets/base.css";
import { createApp } from "vue";
import { createPinia } from "pinia";

// @ts-ignore
import App from "./App.vue";
import router from "./router";
import focusPlugin from "./directives/focus";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
pinia.use(piniaPluginPersistedstate); // 使用pinia持久化插件
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(router);
app.use(focusPlugin); // 使用focus指令插件
app.mount("#app");
