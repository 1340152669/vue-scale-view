<h1 align="center">vue-scale-view</h1>

<p align="center">
  <strong>Vue 3 自适应缩放容器</strong><br>
  按设计稿比例缩放子组件，以 <strong>cover 模式</strong>填满容器、<strong>不出现黑边</strong>。<br>
  支持<strong>最小尺寸保护</strong>（minWidth / minHeight），到达阈值后停止缩小。<br>
  专为大屏可视化、数据看板（DataV）场景设计。
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/vue-scale-view" alt="npm">
  <img src="https://img.shields.io/badge/Vue-3.4%2B-4FC08D" alt="vue">
  <img src="https://img.shields.io/npm/l/vue-scale-view" alt="license">
</p>

---

## 安装

```bash
npm install vue-scale-view
# 或
yarn add vue-scale-view
```

## 使用

### 方式一：全局注册（Vue 插件）

```ts
import { createApp } from 'vue'
import VueScaleView from 'vue-scale-view'
import App from './App.vue'

const app = createApp(App)
app.use(VueScaleView)
```

全局注册后，模板中可直接使用 `<ScaleContainer>`。

### 方式二：按需导入（推荐）

```vue
<script setup lang="ts">
import { ScaleContainer } from 'vue-scale-view'
import 'vue-scale-view/dist/vue-scale-view.css'
</script>

<template>
  <ScaleContainer :design-width="1920" :design-height="1080">
    <YourDashboard />
  </ScaleContainer>
</template>
```

## Props

| Prop           | 类型     | 必填 | 默认值 | 说明                                           |
| -------------- | -------- | ---- | ------ | ---------------------------------------------- |
| `designWidth`  | `number` | 是   | —      | 设计稿宽度（px）                               |
| `designHeight` | `number` | 是   | —      | 设计稿高度（px）                               |
| `minWidth`     | `number` | 否   | —      | 最小宽度阈值（px），到达后容器停止缩小         |
| `minHeight`    | `number` | 否   | —      | 最小高度阈值（px），到达后容器停止缩小         |

### 最小尺寸保护说明

当 `minWidth` / `minHeight` 设置后，若容器实际尺寸 ≤ 阈值，有效尺寸锁定在阈值处，**缩放比不再下降**，内容不会进一步缩小：

```
到达阈值前 → 正常 cover 缩放
到达阈值后 → 锁定缩放比，内容保持可读尺寸
```

示例：设计稿 1920×1080，设置 `:min-width="1200" :min-height="675"`

| 容器实际尺寸 | 有效宽（计算用） | 有效高（计算用） | 缩放比         |
| ------------ | ---------------- | ---------------- | -------------- |
| 1920×1080    | 1920             | 1080             | 1.000          |
| 1400×800     | 1400             | 800              | 0.741 (800/1080) |
| 1000×600     | **1200** (锁定)  | **675** (锁定)   | **0.625** (锁定) |

> `containerRect` 始终报告**容器实际尺寸**，不受 min 参数影响。

## Slot Props

通过 `v-slot` 可获取当前缩放信息：

```vue
<ScaleContainer :design-width="1920" :design-height="1080" v-slot="{ scale }">
  <div>当前缩放比: {{ scale }}</div>
</ScaleContainer>
```

| 字段     | 类型     | 说明           |
| -------- | -------- | -------------- |
| `scale`  | `number` | 统一缩放比     |
| `scaleX` | `number` | 横向缩放比     |
| `scaleY` | `number` | 纵向缩放比     |

## Composables

子组件可通过 `useScaleContainer()` 获取缩放上下文，适合 Canvas / ECharts 等需要按实际分辨率绘制的场景：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useScaleContainer } from 'vue-scale-view'

const { scale, containerRect } = useScaleContainer()

// 设计稿尺寸 → 实际显示分辨率
const actualWidth  = computed(() => containerRect.value.width)
const actualHeight = computed(() => containerRect.value.height)
</script>
```

| 返回值          | 类型                            | 说明                     |
| --------------- | ------------------------------- | ------------------------ |
| `scale`         | `Ref<number>`                   | 统一缩放比               |
| `scaleX`        | `Ref<number>`                   | 横向缩放比               |
| `scaleY`        | `Ref<number>`                   | 纵向缩放比               |
| `containerRect` | `Ref<{ width, height }>`        | 容器原始像素尺寸         |

> **注意：** `useScaleContainer()` 必须在 `<ScaleContainer>` 的子组件中调用，否则会抛出错误。

## 设计原理

### 核心算法

```
// 1. 最小尺寸保护
effectiveW = max(actualW, minWidth || 0)
effectiveH = max(actualH, minHeight || 0)

// 2. cover 模式缩放
scaleX = effectiveW / designW
scaleY = effectiveH / designH
scale  = max(scaleX, scaleY)
```

### Cover 模式说明

| 视口比例对比       | 缩放基准 | 溢出方向 | 裁切区域         |
| ------------------ | -------- | -------- | ---------------- |
| 比设计稿更宽       | 高度     | 左右     | 水平对称裁切     |
| 比设计稿更高       | 宽度     | 上下     | 垂直对称裁切     |
| 到达 min 阈值后    | 锁定     | —        | 不再继续缩小     |

无论哪种情况，容器边缘都不会出现空白（黑边）。

### 渲染机制

- 使用 `transform: translate(-50%, -50%) scale(N)` 居中缩放
- 父容器 `overflow: hidden` 裁切溢出部分
- `ResizeObserver` 精确监听容器尺寸变化（100ms 防抖），不支持时降级到 `window.resize`

## 使用要点

### 1️⃣ 父容器必须有高度

组件样式为 `width: 100%; height: 100%`，直接父级必须有明确高度，否则容器会坍缩。

```vue
<!-- ✅ 推荐：父容器占满视口 -->
<div style="width: 100vw; height: 100vh">
  <ScaleContainer :design-width="1920" :design-height="1080">
    <Dashboard />
  </ScaleContainer>
</div>
```

### 2️⃣ 子组件尺寸按设计稿书写

被包裹的子组件，所有尺寸直接用设计稿的 px 值：

```css
/* 设计稿 1920×1080 */
.title { font-size: 32px; }    /* 设计稿上的字号 */
.box   { width: 400px; }       /* 设计稿上的宽度 */
```

### 3️⃣ 禁止嵌套

**不要**在 `ScaleContainer` 内部再嵌套另一个 `ScaleContainer`，会导致双重缩放。

### 4️⃣ SSR / Nuxt

组件依赖浏览器 API，在 Nuxt 中请用 `<ClientOnly>` 包裹：

```vue
<ClientOnly>
  <ScaleContainer :design-width="1920" :design-height="1080">
    <Dashboard />
  </ScaleContainer>
</ClientOnly>
```

### 5️⃣ ECharts 场景

ECharts 默认根据容器 DOM 尺寸初始化，CSS transform 不改变布局尺寸，如需精确渲染可手动指定：

```ts
import { useScaleContainer } from 'vue-scale-view'

const { scale } = useScaleContainer()
const chart = echarts.init(chartRef.value, null, {
  width:  designChartWidth  * scale.value,
  height: designChartHeight * scale.value,
})
```

## 构建产物

```
dist/
├── index.d.ts                           # TypeScript 声明
├── types.d.ts
├── components/ScaleContainer.vue.d.ts
├── composables/useScaleContainer.d.ts
├── scale-view.js                        # ESM
├── scale-view.umd.cjs                   # UMD / CJS
└── vue-scale-view.css                   # 样式
```

## TypeScript 支持

所有类型已包含在包内，无需额外安装 `@types/*`：

```ts
import type { ScaleContainerProps, ScaleContainerContext } from 'vue-scale-view'
```

## License

MIT
