<template>
  <AdminPageShell eyebrow="1 首页概览" title="首页概览" description="固定桌面布局展示核心指标、趋势和近期运行情况。">
    <div class="page-grid">
      <section class="metrics-grid">
        <MetricCard
          v-for="item in overview?.metrics ?? []"
          :key="item.label"
          :label="item.label"
          :value="item.value"
          :trend="item.trend"
          :note="item.note"
        />
      </section>

      <section class="content-grid">
        <article class="card large-card">
          <div class="card-head">
            <div>
              <p class="eyebrow">请求趋势</p>
              <h3>请求热度（近 7 天）</h3>
            </div>
          </div>

          <div class="line-chart">
            <div v-for="(item, index) in trendPoints" :key="item.label" class="chart-col">
              <div class="line-node" :style="{ height: `${item.value}%` }">
                <span v-if="index < trendPoints.length - 1" class="line-link"></span>
              </div>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </article>

        <article class="card side-card">
          <div class="card-head">
            <div>
              <p class="eyebrow">问题类型分布</p>
              <h3>问题类型分布</h3>
            </div>
          </div>

          <div class="donut-wrap">
            <div class="donut-ring"></div>
            <div class="legend">
              <div v-for="item in overview?.categoryStats ?? []" :key="item.category" class="legend-row">
                <span class="legend-dot"></span>
                <span>{{ item.label }}</span>
                <strong>{{ Math.round(item.ratio * 100) }}%</strong>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section class="bottom-grid">
        <article class="card info-card">
          <p class="eyebrow">近期运行记录</p>
          <h3>最新问答与系统状态</h3>
          <div class="info-list">
            <div v-for="record in records.slice(0, 3)" :key="record.id" class="info-row">
              <strong>{{ record.imageLabel }}</strong>
              <span>{{ record.answer.conciseAnswer }}</span>
              <time>{{ formatDateTime(record.createdAt) }}</time>
            </div>
          </div>
        </article>

        <article class="card info-card">
          <p class="eyebrow">风险提醒</p>
          <h3>风险与优化建议</h3>
          <div class="alert-list">
            <p v-for="item in overview?.riskAlerts ?? []" :key="item">{{ item }}</p>
          </div>
        </article>
      </section>
    </div>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminPageShell from '@/components/admin/AdminPageShell.vue';
import MetricCard from '@/components/common/MetricCard.vue';
import { adminApi } from '@/api/admin';
import type { AdminOverview, HistoryRecord } from '@/types';
import { formatDateTime } from '@/utils/format';

const overview = ref<AdminOverview | null>(null);
const records = ref<HistoryRecord[]>([]);

const trendPoints = [
  { label: '06-16', value: 28 },
  { label: '06-17', value: 36 },
  { label: '06-18', value: 58 },
  { label: '06-19', value: 49 },
  { label: '06-20', value: 44 },
  { label: '06-21', value: 66 },
  { label: '06-22', value: 78 }
];

onMounted(async () => {
  const [overviewData, recordData] = await Promise.all([adminApi.getOverview(), adminApi.getRecords()]);
  overview.value = overviewData;
  records.value = recordData;
});
</script>

<style scoped>
.page-grid {
  display: grid;
  gap: 16px;
}

.metrics-grid,
.content-grid,
.bottom-grid {
  display: grid;
  gap: 16px;
}

.metrics-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.content-grid,
.bottom-grid {
  grid-template-columns: 1.2fr 0.8fr;
}

.card {
  padding: 18px;
  border-radius: 22px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  min-height: 0;
}

.large-card {
  min-height: 320px;
}

.side-card {
  min-height: 320px;
}

.card-head h3,
.info-card h3 {
  margin: 4px 0 0;
}

.line-chart {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 18px;
  align-items: end;
  height: 230px;
  margin-top: 24px;
}

.chart-col {
  display: grid;
  justify-items: center;
  gap: 12px;
  height: 100%;
}

.line-node {
  position: relative;
  width: 100%;
  max-width: 54px;
  align-self: end;
  border-radius: 18px 18px 8px 8px;
  background: linear-gradient(180deg, #7cb1ff, #3269ff);
  box-shadow: 0 10px 22px rgba(50, 105, 255, 0.18);
}

.line-link {
  position: absolute;
  top: 22px;
  left: calc(100% - 6px);
  width: 32px;
  height: 2px;
  background: linear-gradient(90deg, rgba(50, 105, 255, 0.9), rgba(50, 105, 255, 0.2));
}

.chart-col span {
  color: var(--text-subtle);
  font-size: 0.82rem;
}

.donut-wrap {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  margin-top: 12px;
}

.donut-ring {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(#3269ff 0 32%, #41c995 32% 53%, #8f62ff 53% 72%, #ff9a48 72% 88%, #21b4e8 88% 100%);
  position: relative;
}

.donut-ring::after {
  content: '';
  position: absolute;
  inset: 34px;
  border-radius: 50%;
  background: white;
}

.legend,
.alert-list,
.info-list {
  display: grid;
  gap: 12px;
}

.legend-row,
.info-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3269ff;
}

.alert-list p,
.info-row {
  margin: 0;
  padding: 12px 14px;
  border-radius: 16px;
  background: var(--card-bg-soft);
}

.info-row span,
.info-row time {
  color: var(--text-soft);
  font-size: 0.9rem;
}

@media (max-width: 1280px) {
  .metrics-grid,
  .content-grid,
  .bottom-grid,
  .donut-wrap {
    grid-template-columns: 1fr;
  }
}
</style>
