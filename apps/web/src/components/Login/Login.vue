<template>
    <!-- 欢迎语 -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">欢迎回来</h1>
        <p class="text-gray-500 text-sm">请登录您的账户以继续</p>
    </div>
    <!-- 登录表单 -->
    <el-form ref="loginForm" :model="loginForm" :rules="rules" class="space-y-6">
        <el-form-item prop="phone">
            <el-input class="h-12" placeholder="请输入手机号" :prefix-icon="User" :maxlength="11" v-model="loginForm.phone"
                size="large" />
        </el-form-item>
        <el-form-item prop="password">
            <el-input class="h-12" type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password size="large"
                v-model="loginForm.password" />
        </el-form-item>
        <el-form-item class="pt-4">
            <el-button type="primary" size="large"
                class="w-full h-12 text-base font-semibold bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0"
                @click="handleLogin">
                登录
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue';
import type { UserLogin } from '@en/common/user'
import { ref, useTemplateRef, toRaw } from 'vue'
import md5 from 'md5'
import { useLogin } from '@/hooks/useLogin'
import { useUserStore } from '@/stores/user'
import { login } from '@/api/user'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus';

const formRef = useTemplateRef<FormInstance>('loginForm')
const { close } = useLogin()
const userStore = useUserStore()
const loginForm = ref<UserLogin>({
    phone: '',
    password: ''
})

const rules = ref({
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})
const handleLogin = async () => {
    // 验证表单
    await formRef.value?.validate()
    const res = await login({
        ...toRaw(loginForm.value),
        password: toRaw(md5(loginForm.value.password))
    })
    if (res.code === 200) {
        userStore.setUser(res.data)
        ElMessage.success('登录成功')
        close()
    } else {
        ElMessage.error(res.message || '登录失败')
    }
}
</script>
