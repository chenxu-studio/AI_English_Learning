<template>
    <div class="relative w-[800px] h-full bg-linear-to-br from-gray-800 to-gray-00">
        <canvas ref="canvas" class="h-full w-full"></canvas>
        <!-- 图标 -->
        <div class="absolute top-6 left-6">
            <div class="flex items-center gap-2">
                <div
                    class="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-[10px] flex items-center justify-center">
                    <span class="text-white font-bold text-xl">E</span>
                </div>
                <span class="text-white text-xl font-bold">English App</span>
            </div>
        </div>
        <!-- 注册/登录切换按钮 -->
        <div class="absolute top-6 right-6">
            <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-1">
                <button @click="loadModel('login')" :class="loginClass">登录</button>
                <button @click="loadModel('register')" :class="registerClass">注册</button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, useTemplateRef } from 'vue'
import type { LoginType } from './type';
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 拿到canvas
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')

// 创建场景
const scene = new Three.Scene()
// 动画控制器
let mixer: Three.AnimationMixer | null = null
let currentModel: Three.Group | null = null
// 创建时钟
const clock = new Three.Clock()
const type = ref<LoginType>('login')
// 创建emit
const emit = defineEmits(['changeType'])
const loginClass = computed(() => {
    return type.value === 'login' ? 'bg-indigo-500 text-white shadow-lg px-4 py-2 rounded-md text-sm font-medium transition-all' : 'text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md text-sm font-medium transition-all'
})
const registerClass = computed(() => {
    return type.value === 'register' ? 'bg-indigo-500 text-white shadow-lg px-4 py-2 rounded-md text-sm font-medium transition-all' : 'text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md text-sm font-medium transition-all'
})
// 加载动画方法
const loadModelAnimations = (model: GLTF) => {
    if (model.animations.length > 0 && model.animations) {
        mixer = new Three.AnimationMixer(model.scene)
        model.animations.forEach((item) => {
            const action = mixer!.clipAction(item)
            action.play()
        })
    }
}
// 加载模型方法
const loadModel = (url: LoginType) => {
    if (currentModel) {
        console.log('现在清除当前模型', currentModel)
        scene.remove(currentModel)
        currentModel = null
        console.log('清除完毕', currentModel)
    }
    const loader = new GLTFLoader()
    type.value = url
    if (url === 'login') {
        loader.load('/models/login/scene.gltf', (gltf) => {
            scene.add(gltf.scene)
            currentModel = gltf.scene
            scene.position.y = -0.8 //往下一点
            currentModel.scale.set(0.8, 0.8, 0.8)
            loadModelAnimations(gltf)
        })
    }
    if (url === 'register') {
        loader.load('/models/register/scene.gltf', (gltf) => {
            scene.add(gltf.scene)
            currentModel = gltf.scene
            scene.rotation.y += -0.8 // 旋转模型
            currentModel.scale.set(0.8, 0.8, 0.8)
            loadModelAnimations(gltf)
        })
    }
    emit('changeType', url)
}

const initThree = () => {
    // 获取canvas的宽高,作为模型的宽高比
    const aspect = canvasRef.value!.clientWidth / canvasRef.value!.clientHeight
    // 创建相机
    const camera = new Three.PerspectiveCamera(75, aspect, 0.1, 1000)
    camera.position.set(1, 0.5, 1)
    // 创建渲染器
    const renderer = new Three.WebGLRenderer({
        canvas: canvasRef.value!, //渲染容器
        antialias: true, //抗锯齿
        alpha: true, //透明背景
        precision: 'highp', //高精度
        powerPreference: 'high-performance', //高性能
    })
    // 加载模型
    loadModel(type.value)
    renderer.setSize(canvasRef.value!.clientWidth, canvasRef.value!.clientHeight) // 设置渲染器的大小
    renderer.render(scene, camera)
    // 创建渲染控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    const animation = () => {
        const delta = clock.getDelta()
        requestAnimationFrame(animation)
        if (mixer) {
            mixer.update(delta)
        }
        scene.rotation.y += delta * 0.5 //旋转场景
        controls.update()
        renderer.render(scene, camera)
    }
    animation()
}

onMounted(() => {
    initThree()
})
</script>
