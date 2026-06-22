<template>
  <AdminPageShell eyebrow="2 用户管理" title="用户管理" description="展示用户账号、状态、活跃时间和角色，方便后续接入真实分页与检索。">
    <template #actions>
      <button type="button" class="primary-btn">新增用户</button>
    </template>

    <div class="page-grid">
      <section class="summary-grid">
        <article class="summary-card" v-for="item in summaryCards" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <section class="toolbar">
        <input v-model="keyword" type="text" class="toolbar-input" placeholder="请输入用户名 / 手机号" />
        <select v-model="statusFilter" class="toolbar-input">
          <option value="all">状态筛选</option>
          <option value="active">正常</option>
          <option value="idle">空闲</option>
          <option value="disabled">禁用</option>
        </select>
      </section>

      <section class="table-card admin-scroll-hidden">
        <table class="data-table">
          <thead>
            <tr>
              <th>用户ID</th>
              <th>用户名</th>
              <th>角色</th>
              <th>状态</th>
              <th>最近活跃</th>
              <th>提问量</th>
              <th>有用率</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.role }}</td>
              <td>{{ statusMap[user.status] }}</td>
              <td>{{ formatDateTime(user.lastActiveAt) }}</td>
              <td>{{ user.questionCount }}</td>
              <td>{{ formatPercent(user.helpfulRate) }}</td>
              <td>
                <div class="actions">
                  <button type="button" class="action-link">编辑</button>
                  <button type="button" class="action-link">详情</button>
                </div>
              </td>
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
import type { UserProfile } from '@/types';
import { formatDateTime, formatPercent } from '@/utils/format';

const users = ref<UserProfile[]>([]);
const keyword = ref('');
const statusFilter = ref<'all' | 'active' | 'idle' | 'disabled'>('all');

const statusMap = {
  active: '正常',
  idle: '空闲',
  disabled: '禁用'
} as const;

const filteredUsers = computed(() =>
  users.value.filter((user) => {
    const matchKeyword = !keyword.value || user.name.includes(keyword.value) || user.id.includes(keyword.value);
    const matchStatus = statusFilter.value === 'all' || user.status === statusFilter.value;
    return matchKeyword && matchStatus;
  })
);

const summaryCards = computed(() => [
  { label: '总用户数', value: String(users.value.length) },
  { label: '今日新增', value: '12' },
  { label: '活跃用户', value: String(users.value.filter((item) => item.status === 'active').length) },
  { label: '禁用用户', value: String(users.value.filter((item) => item.status === 'disabled').length) }
]);

onMounted(async () => {
  users.value = await adminApi.getUsers();
});
</script>

<style scoped>
.page-grid {
  display: grid;
  gap: 16px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.summary-card,
.table-card,
.toolbar {
  border-radius: 20px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.summary-card {
  padding: 18px;
}

.summary-card span {
  color: var(--text-subtle);
}

.summary-card strong {
  display: block;
  margin-top: 10px;
  font-size: 1.8rem;
}

.toolbar {
  display: grid;
  grid-template-columns: 1.3fr 220px;
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

.actions {
  display: flex;
  gap: 8px;
}

.action-link {
  padding: 0;
  border: none;
  background: transparent;
  color: #3269ff;
  cursor: pointer;
}

@media (max-width: 1280px) {
  .summary-grid,
  .toolbar {
    grid-template-columns: 1fr;
  }
}
</style>
