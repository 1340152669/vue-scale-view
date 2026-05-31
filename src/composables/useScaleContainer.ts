/**
 * useScaleContainer
 *
 * 子组件通过此 composable 获取 ScaleContainer 注入的缩放信息。
 * 适用于需要在内部根据实际缩放比做精细调整的场景（如 Canvas / ECharts 重绘）。
 *
 * 返回值为 Vue Ref，在模板中自动解包，在 <script> 中通过 `.value` 读取。
 *
 * @example
 * ```ts
 * import { useScaleContainer } from 'vue-scale-view'
 *
 * const { scale, containerRect } = useScaleContainer()
 *
 * // 根据实际显示尺寸计算 ECharts 实例的像素尺寸
 * const actualWidth  = computed(() => designWidth * scale.value)
 * const actualHeight = computed(() => designHeight * scale.value)
 * ```
 */

import { inject } from 'vue'
import { SCALE_CONTAINER_KEY } from '../types'
import type { ScaleContainerContext } from '../types'

export function useScaleContainer(): ScaleContainerContext {
  const context = inject(SCALE_CONTAINER_KEY)

  if (!context) {
    throw new Error(
      '[useScaleContainer] 未找到 ScaleContainer 父组件。' +
        '请在组件树外层使用 <ScaleContainer> 包裹当前组件。',
    )
  }

  return context
}
