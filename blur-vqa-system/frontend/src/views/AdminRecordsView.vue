<template>
  <AdminPageShell eyebrow="3 问答记录" title="问答记录" description="按后台视角查看所有问答内容，预留搜索、筛选、详情和分页位。">
    <template #actions>
      <button type="button" class="primary-btn">导出记录</button>
    </template>

    <div class="page-grid">
      <section class="toolbar">
        <input v-model="keyword" type="text" class="toolbar-input" placeholder="搜索问题、图片名称或用户" />
        <select v-model="category" class="toolbar-input">
          <option value="all">全部类别</option>
          <option value="ocr">标签读取</option>
          <option value="usage">使用建议</option>
          <option value="scene">场景描述</option>
          <option value="safety">安全提醒</option>
        </select>
        <select v-model="status" class="toolbar-input">
          <option value="all">全部状态</option>
          <option value="answered">已回答</option>
          <option value="needs_retry">建议重拍</option>
          <option value="unsafe">风险提醒</option>
        </select>
      </section>

      <section class="table-card admin-scroll-hidden">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>用户</th>
              <th>图片</th>
              <th>问题</th>
              <th>类别</th>
              <th>状态</th>
              <th>时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecords" :key="record.id">
              <td>{{ record.id }}</td>
              <td>{{ record.userName }}</td>
              <td>{{ record.imageLabel }}</td>
              <td class="question-cell">{{ record.question }}</td>
              <td>{{ categoryLabel(record.category) }}</td>
              <td>{{ statusMap[record.status] }}</td>
              <td>{{ formatDateTime(record.createdAt) }}</td>
              <td><button type="button" class="action-link">查看</button></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AdminPageShell from '@/components/admin/AdminPageShell.vue';
import { adminApi } from '@/api/admin';
import type { HistoryRecord } from '@/types';
import { categoryLabel, formatDateTime } from '@/utils/format';

const records = ref<HistoryRecord[]>([]);
const keyword = ref('');
const category = ref<'all' | 'ocr' | 'usage' | 'scene' | 'safety'>('all');
const status = ref<'all' | 'answered' | 'needs_retry' | 'unsafe'>('all');

const statusMap = {
  answered: '已回答',
  needs_retry: '建议重拍',
  unsafe: '风险提醒'
} as const;

const filteredRecords = computed(() =>
  records.value.filter((record) => {
    const matchKeyword =
      !keyword.value ||
      record.question.includes(keyword.value) ||
      record.imageLabel.includes(keyword.value) ||
      record.userName.includes(keyword.value);
    const matchCategory = category.value === 'all' || record.category === category.value;
    const matchStatus = status.value === 'all' || record.status === status.value;
    return matchKeyword && matchCategory && matchStatus;
  })
);

onMounted(async () => {
  records.value = await adminApi.getRecords();
});
</script>

<style scoped>
.page-grid {
  display: grid;
  gap: 16px;
}

.toolbar,
.table-card {
  border-radius: 20px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.toolbar {
  display: grid;
  grid-template-columns: 1.2fr 220px 220px;
  gap: 12px;
  padding: 14px;
}

.toolbar-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(228, 235, 251, 0.32);
  background: rgba(251, 252, 255, 0.72);
  font: inherit;
}

.table-card {
  min-height: 0;
  overflow: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 16px 14px;
  text-align: left;
  border-bottom: 1px solid rgba(237, 242, 253, 0.55);
}

.data-table th {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.96);
  color: var(--text-muted);
}

.question-cell {
  max-width: 320px;
  color: var(--text-soft);
}

.action-link {
  padding: 0;
  border: none;
  background: transparent;
  color: #3269ff;
  cursor: pointer;
}

@media (max-width: 1280px) {
  .toolbar {
    grid-template-columns: 1fr;
  }
}
</style>
