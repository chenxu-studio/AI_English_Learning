<template>
    <!-- 遮罩 -->
    <div class="fixed inset-0 z-40 bg-black opacity-30 filter blur-sm" v-if="isShowLogin"></div>
    <!-- 登录容器 -->
    <transition name="fade">
      <div class="fixed inset-30 flex items-center justify-center z-50" v-if="isShowLogin">
        <div class="w-[1200px] h-[700px] flex bg-white rounded-[20px] shadow-2xl overflow-hidden">
            <!-- 模型区域 -->
            <Model @change-type="changeType" />
            <!-- 表单区域 -->
            <div class="flex-1 flex flex-col justify-center px-12 py-10 bg-white">
                <Login v-if="loginType === 'login'" />
                <Register v-if="loginType === 'register'" />
            </div>
        </div>
    </div>
    </transition>
    
</template>

<script setup lang="ts">
import type { LoginType } from './type'
import { IS_SHOW_LOGIN } from './type'
import Login from './Login.vue'
import Register from './Register.vue'
import Model from './Model.vue'
import { inject, ref } from 'vue'
const isShowLogin = inject(IS_SHOW_LOGIN)

const loginType = ref<LoginType>('login')
const changeType = (url: LoginType) => {
    loginType.value = url
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        isShowLogin.value = false
    }
})
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.fade-enter-active {
    transform: translateY(-20px);
}
.fade-leave-active {
    transform: translateY(20px);
}
</style>