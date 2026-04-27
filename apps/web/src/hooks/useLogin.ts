import { IS_SHOW_LOGIN } from "@/components/Login/type";
import { useUserStore } from "@/stores/user";
import { inject, ref } from "vue";

export const useLogin = () => {
  const userStore = useUserStore();
  const isShowLogin = inject(IS_SHOW_LOGIN, ref(false));
  const login = () => {
    return new Promise((resolve, reject) => {
      if (userStore.getUser) {
        resolve(true);
      } else {
        isShowLogin.value = true; // 显示登录弹窗
        reject(false);
      }
    });
  };
  const close = () => {
    isShowLogin.value = false;
  };
  return {
    login,
    close,
  };
};
