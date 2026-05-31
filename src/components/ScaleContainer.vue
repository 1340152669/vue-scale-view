<!--
 * @ScaleContainer 自适应缩放容器
 *
 * @设计原理
 * 以设计稿宽高为基准，根据容器实际宽高分别计算 X/Y 缩放比，
 * 通过 CSS transform scale(sx, sy) 独立缩放子组件内容，
 * 始终填满容器、无黑边，内容宽高比可能与设计稿不一致。
 *
 * @最小尺寸保护
 * 当容器尺寸 ≤ minWidth / minHeight 时，有效尺寸不再缩小，缩放比锁定。
 * 避免在极小窗口下内容过度缩放到不可读。
 *
 * @使用示例
 * ```vue
 * <template>
 *   <ScaleContainer :design-width="1920" :design-height="1080">
 *     <YourDashboard />
 *   </ScaleContainer>
 * </template>
 * ```
 *
 * @props {number}  designWidth  — 设计稿宽度（px）
 * @props {number}  designHeight — 设计稿高度（px）
 * @props {number}  [minWidth]   — 最小宽度阈值（px），到达后停止缩小
 * @props {number}  [minHeight]  — 最小高度阈值（px），到达后停止缩小
 *
 * @provide {ScaleContainerContext} scaleContainer — 缩放上下文
 *   - scale: number        当前缩放比（取 Math.max(scaleX, scaleY)）
 *   - scaleX: number       横向缩放比（容器宽 / 设计稿宽）
 *   - scaleY: number       纵向缩放比（容器高 / 设计稿高）
 *   - containerRect        容器原始尺寸 { width, height }
 *
 * @slot default — 需要缩放的子内容（接收 slot props: { scale, scaleX, scaleY }）
 -->

<template>
  <div ref="containerRef" class="scale-view">
    <div
      v-if="ready"
      class="scale-view__content"
      :style="contentStyle"
    >
      <slot
        :scale="scale"
        :scale-x="scaleX"
        :scale-y="scaleY"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, provide } from 'vue'
import { SCALE_CONTAINER_KEY } from '../types'
import type { ScaleContainerProps } from '../types'

const props = defineProps<ScaleContainerProps>()

defineOptions({ name: 'VueScaleView' })

// ============================================================================
// 状态
// ============================================================================

const containerRef = ref<HTMLDivElement | null>(null)
const ready = ref(false)
const scale = ref(1)
const scaleX = ref(1)
const scaleY = ref(1)
const containerRect = ref({ width: 0, height: 0 })

// ============================================================================
// 计算样式
// ============================================================================

const contentStyle = computed(() => ({
  width: `${props.designWidth}px`,
  height: `${props.designHeight}px`,
  position: 'absolute' as const,
  left: '50%',
  top: '50%',
  transform: `translate(-50%, -50%) scale(${scaleX.value}, ${scaleY.value})`,
  transformOrigin: 'center center',
  overflow: 'hidden',
  // 只对 transform 做过渡，避免窗口缩放时突变
  transition: 'transform 0.3s ease-out',
}))

// ============================================================================
// 缩放计算
// ============================================================================

/**
 * 核心逻辑
 *
 * 1. 取容器实际宽高 rawW / rawH
 * 2. 若设置了 minWidth / minHeight，有效宽高取两者中的较大值
 *    即：容器缩到阈值以下时，停止继续缩小
 * 3. 分别计算 X/Y 缩放比，内容会被拉伸以填满容器、无黑边
 */
function calcScale(): void {
  if (!containerRef.value) return

  const { width: rawW, height: rawH } = containerRef.value.getBoundingClientRect()
  if (rawW === 0 || rawH === 0) return

  // 记录原始尺寸（外部可通过 useScaleContainer 获取）
  containerRect.value = { width: rawW, height: rawH }

  // 应用最小尺寸保护：到达阈值后有效尺寸不再缩小
  const w = props.minWidth != null ? Math.max(rawW, props.minWidth) : rawW
  const h = props.minHeight != null ? Math.max(rawH, props.minHeight) : rawH

  scaleX.value = w / props.designWidth
  scaleY.value = h / props.designHeight
  scale.value = Math.max(scaleX.value, scaleY.value)
}

// ============================================================================
// Resize 监听（防抖）
// ============================================================================

let resizeTimer: ReturnType<typeof setTimeout> | null = null

function handleResize(): void {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(calcScale, 100)
}

let resizeObserver: ResizeObserver | null = null

function setupResizeObserver(): void {
  if (!containerRef.value) return

  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(containerRef.value)
  } else {
    window.addEventListener('resize', handleResize)
  }
}

function teardownResizeObserver(): void {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  } else {
    window.removeEventListener('resize', handleResize)
  }
  if (resizeTimer) {
    clearTimeout(resizeTimer)
    resizeTimer = null
  }
}

// ============================================================================
// Provide — 子组件可通过 useScaleContainer() 获取缩放信息
// ============================================================================

provide(SCALE_CONTAINER_KEY, {
  scale,
  scaleX,
  scaleY,
  containerRect,
})

// ============================================================================
// 生命周期
// ============================================================================

onMounted(() => {
  calcScale()
  setupResizeObserver()
  ready.value = true
})

onBeforeUnmount(() => {
  teardownResizeObserver()
})
</script>

<style scoped>
.scale-view {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: transparent;
}
</style>
