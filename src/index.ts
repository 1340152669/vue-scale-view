/**
 * vue-scale-view — 入口文件
 *
 * 导出方式：
 *   1. 全局注册：app.use(VueScaleView)
 *   2. 按需导入：import { ScaleContainer, useScaleContainer } from 'vue-scale-view'
 */

import type { App, Plugin } from 'vue'
import ScaleContainer from './components/ScaleContainer.vue'
import { useScaleContainer } from './composables/useScaleContainer'
import type { ScaleContainerProps, ScaleContainerContext } from './types'

// ============================================================================
// Vue 插件
// ============================================================================

const VueScaleView: Plugin = {
  install(app: App, options?: { prefix?: string }) {
    const prefix = options?.prefix ?? ''
    app.component(`${prefix}ScaleContainer`, ScaleContainer)
  },
}

// ============================================================================
// 命名导出
// ============================================================================

export { ScaleContainer, useScaleContainer }

// ============================================================================
// 类型导出
// ============================================================================

export type { ScaleContainerProps, ScaleContainerContext }

// ============================================================================
// 默认导出（插件）
// ============================================================================

export default VueScaleView
