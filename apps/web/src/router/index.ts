import { createRouter, createWebHistory } from "vue-router";
import Home from "./Home";
import WordBook from "./WordBook";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...Home, // 主页
    ...WordBook, // 词库
  ],
});

export default router;
