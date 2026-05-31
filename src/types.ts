/**
 * vue-scale-view 共享类型定义
 *
 * 本文件导出提供给外部消费者的类型接口以及库内部使用的 provide/inject Symbol。
 */

import type { InjectionKey, Ref } from 'vue'

// ============================================================================
// 公共 Props 类型
// ============================================================================

/** ScaleContainer 组件 Props */
export interface ScaleContainerProps {
  /** 设计稿宽度（px） */
  designWidth: number
  /** 设计稿高度（px） */
  designHeight: number
  /** 最小宽度阈值（px）—— 当容器宽度 ≤ 此值时停止继续缩小 */
  minWidth?: number
  /** 最小高度阈值（px）—— 当容器高度 ≤ 此值时停止继续缩小 */
  minHeight?: number
}

// ============================================================================
// 注入上下文类型 + Symbol
// ============================================================================

/** 通过 provide / inject 传递的缩放上下文 */
export interface ScaleContainerContext {
  /** 当前统一缩放比（cover 模式：Math.max 取大值） */
  scale: Ref<number>
  /** 横向缩放比 */
  scaleX: Ref<number>
  /** 纵向缩放比 */
  scaleY: Ref<number>
  /** 容器的原始像素尺寸（未缩放） */
  containerRect: Ref<{ width: number; height: number }>
}

/** provide / inject 的 key，使用 Symbol 确保唯一性 */
export const SCALE_CONTAINER_KEY: InjectionKey<ScaleContainerContext> =
  Symbol('scaleContainer')
