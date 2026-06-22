<template>
  <AdminPageShell eyebrow="4 数据统计" title="数据统计" description="固定后台统计页，包含分类趋势、核心数据和风险分布。">
    <template #actions>
      <button type="button" class="secondary-btn">按周查看</button>
    </template>

    <div class="page-grid">
      <section class="stats-grid">
        <article class="mini-stat">
          <span>请求总量</span>
          <strong>8,742</strong>
        </article>
        <article class="mini-stat">
          <span>有效回答</span>
          <strong>8,408</strong>
        </article>
        <article class="mini-stat">
          <span>异常提醒</span>
          <strong>334</strong>
        </article>
        <article class="mini-stat">
          <span>平均评分</span>
          <strong>0.82</strong>
        </article>
      </section>

      <section class="charts-grid">
        <article class="card">
          <p class="eyebrow">趋势图</p>
          <h3>问题数量趋势</h3>
          <div class="trend-bars">
            <div v-for="item in bars" :key="item.label" class="bar-col">
              <div class="bar-track">
                <span class="bar-fill" :style="{ height: `${item.value}%` }"></span>
              </div>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </article>

        <article class="card">
          <p class="eyebrow">问题类型分布</p>
          <h3>问题类型分布</h3>
          <div class="pie-card">
            <div class="pie-ring"></div>
            <div class="pie-legend">
              <div v-for="item in overview?.categoryStats ?? []" :key="item.category" class="legend-row">
                <span class="legend-name">{{ item.label }}</span>
                <strong>{{ item.count }}</strong>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminPageShell from '@/components/admin/AdminPageShell.vue';
import { adminApi } from '@/api/admin';
import type { AdminOverview } from '@/types';

const overview = ref<AdminOverview | null>(null);

const bars = [
  { label: '06-16', value: 36 },
  { label: '06-17', value: 43 },
  { label: '06-18', value: 64 },
  { label: '06-19', value: 51 },
  { label: '06-20', value: 48 },
  { label: '06-21', value: 72 },
  { label: '06-22', value: 84 }
];

onMounted(async () => {
  overview.value = await adminApi.getOverview();
});
</script>

<style scoped>
.page-grid,
.stats-grid,
.charts-grid {
  display: grid;
  gap: 16px;
}

.stats-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.charts-grid {
  grid-template-columns: 1.05fr 0.95fr;
}

.mini-stat,
.card {
  padding: 18px;
  border-radius: 20px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.mini-stat span {
  color: var(--text-subtle);
}

.mini-stat strong {
  display: block;
  margin-top: 12px;
  font-size: 1.9rem;
}

.card h3 {
  margin: 4px 0 0;
}

.trend-bars {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 18px;
  align-items: end;
  height: 290px;
  margin-top: 20px;
}

.bar-col {
  display: grid;
  justify-items: center;
  gap: 10px;
  height: 100%;
}

.bar-track {
  width: 100%;
  max-width: 56px;
  height: 100%;
  border-radius: 18px;
  background: #eef3ff;
  display: flex;
  align-items: flex-end;
  padding: 6px;
}

.bar-fill {
  display: block;
  width: 100%;
  border-radius: 14px;
  background: linear-gradient(180deg, #8fc5ff, #3269ff);
}

.pie-card {
  display: grid;
  grid-template-columns: 190px 1fr;
  gap: 20px;
  align-items: center;
  margin-top: 18px;
}

.pie-ring {
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background: conic-gradient(#3269ff 0 34%, #40c997 34% 55%, #a26dff 55% 73%, #ffa04a 73% 88%, #21b4e8 88% 100%);
  position: relative;
}

.pie-ring::after {
  content: '';
  position: absolute;
  inset: 38px;
  border-radius: 50%;
  background: white;
}

.pie-legend {
  display: grid;
  gap: 12px;
}

.legend-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--card-bg-soft);
}

.legend-name {
  color: var(--text-soft);
}

@media (max-width: 1280px) {
  .stats-grid,
  .charts-grid,
  .pie-card {
    grid-template-columns: 1fr;
  }
}
</style>
