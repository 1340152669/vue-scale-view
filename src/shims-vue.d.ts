/**
 * Vue SFC 类型声明
 *
 * 让 TypeScript 理解 .vue 文件导入，否则 import Component from '*.vue' 会报错。
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >
  export default component
}
