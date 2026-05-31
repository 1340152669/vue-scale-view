<!--
 * 大屏看板 Demo — 展示 ScaleContainer 如何使用
 *
 * 假设设计稿 1920×1080，内容自动缩放填满任意尺寸的屏幕/容器。
 * 全部子节点的尺寸直接用设计稿像素值书写即可。
 -->

<template>
  <ScaleContainer :design-width="1920" :design-height="1080">
    <div class="dashboard">
      <!-- 左上角标题 -->
      <header class="dashboard__header">
        <h1>智慧运营中心</h1>
      </header>

      <!-- 指标卡片行 -->
      <section class="dashboard__cards">
        <div v-for="card in cards" :key="card.label" class="card">
          <div class="card__value">{{ card.value }}</div>
          <div class="card__label">{{ card.label }}</div>
        </div>
      </section>

      <!-- 图表区域（举例，实际可用 ECharts 等） -->
      <section class="dashboard__charts">
        <div class="chart-box chart-box--left">图表 A</div>
        <div class="chart-box chart-box--center">图表 B</div>
        <div class="chart-box chart-box--right">图表 C</div>
      </section>

      <!-- 底部时间 / 版本信息 -->
      <footer class="dashboard__footer">
        <span>© 2026</span>
        <span>更新时间：{{ now }}</span>
      </footer>
    </div>
  </ScaleContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ScaleContainer from '../ScaleContainer.vue'

// ============================================================================
// 模拟数据
// ============================================================================

const cards = [
  { label: '总用户数', value: '12,847' },
  { label: '今日活跃', value: '3,219' },
  { label: '订单总量', value: '8,562' },
  { label: '转化率', value: '67.8%' },
]

const now = ref(new Date().toLocaleString('zh-CN'))

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date().toLocaleString('zh-CN')
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* ==========================================================================
   所有尺寸基于 1920×1080 设计稿像素书写，ScaleContainer 会自动缩放。
   ========================================================================== */

.dashboard {
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  padding: 40px 60px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #0b1a2e 0%, #1a2a4a 100%);
  color: #e0e8f0;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  user-select: none;
}

.dashboard__header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

.dashboard__header h1 {
  font-size: 36px;
  font-weight: 600;
  background: linear-gradient(90deg, #4fc3f7, #81d4fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 8px;
}

.dashboard__cards {
  display: flex;
  gap: 24px;
  margin: 30px 0;
}

.card {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px 0;
  text-align: center;
}

.card__value {
  font-size: 42px;
  font-weight: 700;
  background: linear-gradient(90deg, #4fc3f7, #29b6f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.card__label {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.55);
}

.dashboard__charts {
  flex: 1;
  display: flex;
  gap: 24px;
  margin: 10px 0;
}

.chart-box {
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.35);
}

.dashboard__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.35);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-top: 10px;
  padding-top: 10px;
}
</style>
