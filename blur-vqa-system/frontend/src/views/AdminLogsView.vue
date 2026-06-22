<template>
  <AdminPageShell eyebrow="8 日志管理" title="日志管理" description="查看模型、图像、语音等链路日志，后续接真实查询接口。">
    <template #actions>
      <button type="button" class="secondary-btn">刷新日志</button>
    </template>

    <div class="log-list admin-scroll-hidden">
      <article v-for="log in logs" :key="log.id" class="log-card">
        <div class="log-head">
          <span class="capsule">{{ log.level }}</span>
          <strong>{{ log.module }}</strong>
          <time>{{ formatDateTime(log.time) }}</time>
        </div>
        <p>{{ log.message }}</p>
        <div class="log-actions">
          <button type="button" class="action-link">详情</button>
          <button type="button" class="action-link">定位</button>
        </div>
      </article>
    </div>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminPageShell from '@/components/admin/AdminPageShell.vue';
import { adminApi } from '@/api/admin';
import type { SystemLog } from '@/types';
import { formatDateTime } from '@/utils/format';

const logs = ref<SystemLog[]>([]);

onMounted(async () => {
  logs.value = await adminApi.getLogs();
});
</script>

<style scoped>
.log-list {
  display: grid;
  gap: 14px;
  min-height: 0;
  overflow: auto;
}

.log-card {
  padding: 18px;
  border-radius: 18px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.log-head {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 12px;
  align-items: center;
}

.log-head time,
.log-card p {
  color: var(--text-soft);
}

.log-card p {
  margin: 12px 0;
}

.log-actions {
  display: flex;
  gap: 14px;
}

.action-link {
  padding: 0;
  border: none;
  background: transparent;
  color: #3269ff;
  cursor: pointer;
}
</style>
