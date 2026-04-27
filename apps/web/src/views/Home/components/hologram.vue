<template>
  <canvas ref="hologramRef"></canvas>
</template>

<script setup lang="ts">
import * as Three from 'three'
// gltf模型加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 轨道控制器 控制模型的旋转和缩放以及拖拽等操作
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useTemplateRef, onMounted } from 'vue';

const hologramRef = useTemplateRef<HTMLCanvasElement>('hologramRef');
// 初始化Three.js
const initThree = () => {
  // 创建场景 -> 网格 (几何+材质)+ 相机 + 渲染器 + 灯光
  // 创建场景 -> 模型 gltf格式 + 相机 + 渲染器 + 灯光
  const scene = new Three.Scene();
  const gltfLoader = new GLTFLoader();
  // 创建模型动画控制器
  let mixer: Three.AnimationMixer | null = null
  const clock = new Three.Clock() //创建时钟
  // 创建相机
  const camera = new Three.PerspectiveCamera(75, 500 / 250, 0.1, 1000);
  // 设置位置
  camera.position.set(0, 0, 10);
  // 加载模型
  gltfLoader.load('/models/hologram/scene.gltf', (gltf) => {
    // 加载到场景里面
    scene.add(gltf.scene)
    gltf.scene.scale.set(4, 4, 4)
    // 检查模型是否有动画
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new Three.AnimationMixer(gltf.scene)
      // 播放动画
      gltf.animations.forEach((item) => {
        const action = mixer!.clipAction(item)
        action.play()
      })
    }

  })
  // 创建渲染器
  const renderer = new Three.WebGLRenderer({
    canvas: hologramRef.value!,
    antialias: true,// 开启抗锯齿
    alpha: true,// 开启透明度
    precision: 'high',// 高精度渲染
    powerPreference: 'high-performance',// 高性能渲染
  })
  // 设置光源
  const light = new Three.AmbientLight(0xffffff, 1) // 环境光
  scene.add(light)
  // 设置渲染器的大小
  renderer.setSize(500, 250)
  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  // 更行轨道控制器
  const updateControls = () => {
    // 递归调用更新轨道控制器的位置,requestAnimationFrame() 方法在浏览器重绘之前调用指定的回调函数,他由浏览器自动调用
    requestAnimationFrame(updateControls)
    const delta = clock.getDelta() // 获取时间间隔
    // 更新动画控制器
    mixer?.update(delta)
    scene.rotation.y += delta * 0.5 // 旋转模型
    // 更新轨道控制器的位置
    controls.update()
    // 渲染场景
    renderer.render(scene, camera)
  }
  updateControls();
}

// 在组件挂载完成后初始化Three.js
onMounted(() => {
  initThree()
})
</script>