<template>
  <AdminPageShell eyebrow="6 风险与安全" title="风险与安全" description="集中管理高风险规则、拦截策略和提醒开关。">
    <template #actions>
      <button type="button" class="primary-btn">新增风险规则</button>
    </template>

    <div class="page-grid">
      <section class="rule-grid">
        <article v-for="rule in rules" :key="rule.id" class="rule-card">
          <div class="rule-head">
            <div>
              <h3>{{ rule.name }}</h3>
              <p>{{ rule.scope }}</p>
            </div>
            <label class="toggle">
              <input v-model="rule.enabled" type="checkbox" @change="saveRule(rule)" />
              <span>{{ rule.enabled ? '已开启' : '已关闭' }}</span>
            </label>
          </div>

          <div class="rule-meta">
            <span class="capsule">{{ severityMap[rule.severity] }}</span>
            <span class="time">更新于 {{ formatDateTime(rule.updatedAt) }}</span>
          </div>
        </article>
      </section>

      <section class="tips-card">
        <p class="eyebrow">风控建议</p>
        <h3>后续后端接入建议</h3>
        <div class="tips-list">
          <p>药品、症状、人体接触类问题建议保留人工复核开关。</p>
          <p>模糊场景建议优先触发重拍引导，降低误答概率。</p>
          <p>高温、刀具、危险液体类问答建议追加统一提示模板。</p>
        </div>
      </section>
    </div>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminPageShell from '@/components/admin/AdminPageShell.vue';
import { adminApi } from '@/api/admin';
import type { SafetyRule } from '@/types';
import { formatDateTime } from '@/utils/format';

const rules = ref<SafetyRule[]>([]);

const severityMap = {
  low: '低风险',
  medium: '中风险',
  high: '高风险'
} as const;

async function saveRule(rule: SafetyRule) {
  await adminApi.saveSafetyRule(rule);
}

onMounted(async () => {
  rules.value = await adminApi.getSafetyRules();
});
</script>

<style scoped>
.page-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 16px;
}

.rule-grid,
.tips-list {
  display: grid;
  gap: 16px;
}

.rule-card,
.tips-card {
  padding: 18px;
  border-radius: 20px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.rule-head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.rule-head h3,
.tips-card h3 {
  margin: 0;
}

.rule-head p {
  margin: 6px 0 0;
  color: var(--text-soft);
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-subtle);
}

.rule-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-top: 16px;
}

.time {
  color: var(--text-subtle);
}

.tips-list p {
  margin: 0;
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--card-bg-soft);
}

@media (max-width: 1280px) {
  .page-grid {
    grid-template-columns: 1fr;
  }
}
</style>
