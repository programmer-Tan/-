<template>
  <AdminPageShell eyebrow="7 系统设置" title="系统设置" description="把基础设置、接口配置、安全策略和运行维护拆开，后续后端直接替换接口值。">
    <template #actions>
      <button type="button" class="primary-btn">保存设置</button>
    </template>

    <div class="settings-grid">
      <article v-for="group in groupedSettings" :key="group.name" class="group-card">
        <p class="eyebrow">{{ group.name }}</p>
        <div class="group-list">
          <div v-for="item in group.items" :key="item.id" class="setting-row">
            <div>
              <strong>{{ item.label }}</strong>
              <p>{{ item.description }}</p>
            </div>
            <div class="setting-value">{{ item.value }}</div>
          </div>
        </div>
      </article>
    </div>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AdminPageShell from '@/components/admin/AdminPageShell.vue';
import { adminApi } from '@/api/admin';
import type { SystemSetting } from '@/types';

const settings = ref<SystemSetting[]>([]);

const groupedSettings = computed(() => {
  const groups = new Map<string, SystemSetting[]>();
  for (const item of settings.value) {
    const list = groups.get(item.group) ?? [];
    list.push(item);
    groups.set(item.group, list);
  }

  return Array.from(groups.entries()).map(([name, items]) => ({ name, items }));
});

onMounted(async () => {
  settings.value = await adminApi.getSettings();
});
</script>

<style scoped>
.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.group-card {
  padding: 18px;
  border-radius: 20px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.group-list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.setting-row {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 16px;
  align-items: center;
  padding: 14px;
  border-radius: 16px;
  background: var(--card-bg-soft);
}

.setting-row p {
  margin: 6px 0 0;
  color: var(--text-soft);
}

.setting-value {
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(228, 235, 251, 0.3);
  color: var(--text-main);
}

@media (max-width: 1280px) {
  .settings-grid,
  .setting-row {
    grid-template-columns: 1fr;
  }
}
</style>
