<template>
    <!-- 遮罩层 -->
    <div v-if="showDialog" class="fixed inset-0 w-full h-full bg-black opacity-30 blur-sm z-40"></div>
    <!-- 搜索框 -->
    <transition name="fade">
        <div v-if="showDialog" class="fixed inset-0 shadow-lg p-30 pt-20 z-50">
            <!-- 输入框 -->
            <div class="flex items-center gap-2 shadow-lg w-1/2 mx-auto p-3 bg-white"
                :class="searchResult.length > 0 ? 'rounded-tr-[20px] rounded-tl-[20px]' : ''">
                <el-icon size="20">
                    <Search />
                </el-icon>
                <input v-focus v-model="search" placeholder="请输入搜索内容"
                    class="w-full h-full text-sm border-none rounded-lg p-2 focus:outline-none" />
            </div>
            <!-- 内容区域 -->
            <div class="w-1/2 mx-auto max-h-[500px] border-t border-gray-200 overflow-y-auto"
                v-if="searchResult.length > 0">
                <div class="bg-white hover:bg-blue-50 text-gray-800 p-4 cursor-pointer shadow-sm hover:shadow-md"
                    v-for="item in searchResult" :key="item.id">
                    <div class="text-sm font-semibold text-blue-600 mb-1">{{ item.word }}</div>
                    <div v-html="item.translation" class="text-sm text-gray-700 mb-1 overflow-hidden line-clamp-2" />
                </div>
            </div>
            <!-- 底部快捷键提示 -->
            <div v-show="searchResult.length > 0"
                class="flex items-center justify-center w-1/2 mx-auto py-2 px-4 bg-white/90 backdrop-blur-sm rounded-b-[20px] shadow-lg">
                <div class="flex items-center gap-6 text-sm text-gray-600">
                    <div class="flex items-center gap-1.5">
                        <kbd
                            class="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg">Esc</kbd>
                        <span>退出</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <kbd
                            class="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg">Ctrl</kbd>
                        <kbd
                            class="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg">D</kbd>
                        <span>清空</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <kbd
                            class="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg">Ctrl</kbd>
                        <kbd
                            class="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg">F</kbd>
                        <span>呼出</span>
                    </div>
                </div>
            </div>
        </div>
    </transition>

</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import type { Word } from '@en/common/word';
import { ref, customRef, onUnmounted } from 'vue'
import { getWordBookList } from '@/api/word-book/index.ts'
// 搜索结果
const searchResult = ref<Word[]>([])
// 展示弹窗的展示以及隐藏
const showDialog = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
// 使用 customRef 定义一个自定义的 ref，用于在模板中直接使用
const search = customRef((track, trigger) => {
    // 默认值
    let value = '';
    return {
        get() {
            track()
            return value
        },
        set(newValue) {
            // 如果值为空，清除定时器，不触发搜索
            value = newValue
            if (!newValue) {
                if (timer) {
                    clearTimeout(timer)
                    timer = null
                }
                searchResult.value = []
                trigger()
                return
            }
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                getWordList()
                trigger() // 告诉模板值变化
            }, 500)
        }
    }
})
const getWordList = async () => {
    const res = await getWordBookList({
        word: search.value,
        page: 1,
        pageSize: 20,
    })
    if (res.code === 200) {
        searchResult.value = res.data.list || []
    }
}
const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault()
        showDialog.value = true
        document.body.style.overflow = 'hidden'
    }
    if (e.key === 'Escape') {
        showDialog.value = false
        search.value = ''
        searchResult.value = []
        document.body.style.overflow = 'auto'
    }
    if (e.key === 'd' && e.ctrlKey) {
        e.preventDefault()
        search.value = ''
        searchResult.value = []
    }
}

window.addEventListener('keydown', handleKeydown)

// 组件卸载时清理事件监听器，防止内存泄漏
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
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
    transform: scale(0.5);
}

.fade-leave-from,
.fade-enter-to {
    opacity: 1;
    transform: scale(1);
}
</style>
