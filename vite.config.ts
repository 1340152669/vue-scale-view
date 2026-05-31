import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/guide/build#library-mode
export default defineConfig({
  plugins: [vue()],

  build: {
    // 库模式配置
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueScaleView',
      // 生成的文件名
      fileName: (format) => {
        if (format === 'umd') return 'scale-view.umd.cjs'
        if (format === 'cjs') return 'scale-view.cjs'
        return 'scale-view.js'
      },
    },

    // 不分割 CSS — 统一输出到 style.css
    cssCodeSplit: false,

    rollupOptions: {
      // 外部化 Vue，不打包进库
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        // 保留命名导出以支持 tree-shaking
        exports: 'named',
      },
    },

    // 清理旧构建
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
