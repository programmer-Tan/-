<template>
  <div class="history-grid">
    <div class="history-top">
      <section class="panel filters-panel">
        <div>
          <p class="eyebrow">历史筛选</p>
          <h3>支持后续接入真实检索与分页</h3>
        </div>

        <div class="filters">
          <label>
            <span>搜索问题</span>
            <input v-model="search" type="text" placeholder="输入关键词，例如：药 / 标签 / 危险" />
          </label>
          <label>
            <span>记录状态</span>
            <select v-model="status">
              <option value="all">全部状态</option>
              <option value="answered">已回答</option>
              <option value="needs_retry">建议重拍</option>
              <option value="unsafe">高风险提醒</option>
            </select>
          </label>
          <label>
            <span>问题类别</span>
            <select v-model="category">
              <option value="all">全部类别</option>
              <option value="ocr">标签读取</option>
              <option value="usage">使用建议</option>
              <option value="scene">场景描述</option>
              <option value="safety">安全提醒</option>
            </select>
          </label>
        </div>
      </section>
    </div>

    <div class="records-layout records-layout-fixed">
      <section class="panel list-panel">
        <div class="section-head">
          <div>
            <p class="eyebrow">问答记录</p>
            <h3>共 {{ filteredRecords.length }} 条</h3>
          </div>
        </div>

        <div class="record-list">
          <button
            v-for="record in filteredRecords"
            :key="record.id"
            type="button"
            class="record-card"
            :class="{ active: selectedRecord?.id === record.id }"
            @click="selectedRecord = record"
          >
            <div class="record-top">
              <strong>{{ record.imageLabel }}</strong>
              <span>{{ formatDateTime(record.createdAt) }}</span>
            </div>
            <p class="question">{{ record.question }}</p>
            <p class="answer">{{ record.answer.conciseAnswer }}</p>
            <div class="record-tags">
              <span class="capsule">{{ categoryLabel(record.category) }}</span>
              <span class="capsule">{{ riskLabel(record.answer.riskLevel) }}</span>
            </div>
          </button>
        </div>
      </section>

      <section class="panel detail-panel">
        <template v-if="selectedRecord">
          <div class="section-head">
            <div>
              <p class="eyebrow">记录详情</p>
              <h3>{{ selectedRecord.imageLabel }}</h3>
            </div>
          </div>

          <div class="detail-meta">
            <div>
              <span>提问人</span>
              <strong>{{ selectedRecord.userName }}</strong>
            </div>
            <div>
              <span>输入方式</span>
              <strong>{{ selectedRecord.inputMode === 'voice' ? '语音' : '文本' }}</strong>
            </div>
            <div>
              <span>清晰度</span>
              <strong>{{ Math.round(selectedRecord.diagnostics.blurScore * 100) }} / 100</strong>
            </div>
          </div>

          <div class="detail-copy">
            <article>
              <span class="eyebrow">图片说明</span>
              <p>{{ selectedRecord.imageHint }}</p>
            </article>
            <article>
              <span class="eyebrow">问题原文</span>
              <p>{{ selectedRecord.question }}</p>
            </article>
            <article v-if="selectedRecord.transcript">
              <span class="eyebrow">语音转写</span>
              <p>{{ selectedRecord.transcript }}</p>
            </article>
            <article>
              <span class="eyebrow">图像建议</span>
              <p>{{ selectedRecord.diagnostics.recommendation }}</p>
            </article>
          </div>

          <AnswerPanel :answer="selectedRecord.answer" />
        </template>

        <div v-else class="empty-inline">
          <p>请选择左侧一条历史记录查看详情。</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import AnswerPanel from '@/components/answer/AnswerPanel.vue';
import { vqaApi } from '@/api/vqa';
import type { HistoryRecord } from '@/types';
import { categoryLabel, formatDateTime, riskLabel } from '@/utils/format';

const records = ref<HistoryRecord[]>([]);
const selectedRecord = ref<HistoryRecord | null>(null);
const search = ref('');
const status = ref<'all' | 'answered' | 'needs_retry' | 'unsafe'>('all');
const category = ref<'all' | 'ocr' | 'usage' | 'scene' | 'safety'>('all');

const filteredRecords = computed(() => {
  return records.value.filter((record) => {
    const matchesSearch =
      !search.value ||
      record.question.includes(search.value) ||
      record.imageLabel.includes(search.value) ||
      record.answer.conciseAnswer.includes(search.value);
    const matchesStatus = status.value === 'all' || record.status === status.value;
    const matchesCategory = category.value === 'all' || record.category === category.value;

    return matchesSearch && matchesStatus && matchesCategory;
  });
});

watch(filteredRecords, (value) => {
  if (!value.some((item) => item.id === selectedRecord.value?.id)) {
    selectedRecord.value = value[0] ?? null;
  }
});

onMounted(async () => {
  records.value = await vqaApi.getHistoryRecords();
  selectedRecord.value = records.value[0] ?? null;
});
</script>

<style scoped>
.history-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filters-panel,
.list-panel,
.detail-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.filters-panel h3,
.section-head h3 {
  margin: 4px 0 0;
}

.history-top {
  display: grid;
}

.filters {
  display: grid;
  grid-template-columns: 1.4fr repeat(2, minmax(0, 0.8fr));
  gap: 12px;
}

.filters label span {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
}

.filters input,
.filters select {
  width: 100%;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid rgba(228, 235, 251, 0.32);
  background: rgba(255, 255, 255, 0.74);
  font: inherit;
}

.records-layout {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 16px;
}

.records-layout-fixed {
  align-items: stretch;
}

.list-panel,
.detail-panel {
  min-height: 720px;
}

.record-list {
  display: grid;
  gap: 12px;
  align-content: start;
}

.record-card {
  padding: 16px;
  text-align: left;
  border: 1px solid rgba(228, 235, 251, 0.28);
  border-radius: 20px;
  background: var(--card-bg);
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.record-card.active {
  border-color: rgba(245, 163, 94, 0.45);
  box-shadow: 0 12px 24px rgba(26, 87, 82, 0.08);
}

.record-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.question {
  margin: 12px 0 10px;
  font-weight: 600;
}

.answer {
  margin: 0 0 12px;
  color: var(--text-muted);
}

.record-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.detail-meta div,
.detail-copy article {
  padding: 14px 16px;
  border-radius: 18px;
  background: var(--card-bg);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.detail-meta span,
.detail-copy span {
  display: block;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.detail-copy {
  display: grid;
  gap: 12px;
}

.detail-copy p,
.empty-inline p {
  margin: 0;
}

@media (max-width: 1180px) {
  .records-layout,
  .filters,
  .detail-meta {
    grid-template-columns: 1fr;
  }

  .list-panel,
  .detail-panel {
    min-height: auto;
  }
}
</style>
