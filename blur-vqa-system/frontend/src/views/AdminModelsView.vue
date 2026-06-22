<template>
  <AdminPageShell eyebrow="5 模型管理" title="模型管理" description="保留模型版本、接口地址、能力说明和启停开关，便于后续联调。">
    <template #actions>
      <button type="button" class="primary-btn">新增模型</button>
    </template>

    <div class="model-grid">
      <article v-for="model in models" :key="model.id" class="model-card">
        <div class="model-head">
          <div>
            <h3>{{ model.name }}</h3>
            <p>{{ model.provider }} · {{ model.version }}</p>
          </div>
          <label class="toggle">
            <input v-model="model.enabled" type="checkbox" @change="saveModel(model)" />
            <span>{{ model.enabled ? '启用中' : '未启用' }}</span>
          </label>
        </div>

        <div class="meta-grid">
          <div class="meta-item">
            <span>接口地址</span>
            <code>{{ model.endpoint }}</code>
          </div>
          <div class="meta-item">
            <span>平均时延</span>
            <strong>{{ model.latency }}</strong>
          </div>
        </div>

        <div class="tag-row">
          <span v-for="item in model.strengths" :key="item" class="capsule warm">{{ item }}</span>
        </div>

        <p class="notes">{{ model.notes }}</p>
      </article>
    </div>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminPageShell from '@/components/admin/AdminPageShell.vue';
import { adminApi } from '@/api/admin';
import type { ModelConfig } from '@/types';

const models = ref<ModelConfig[]>([]);

async function saveModel(model: ModelConfig) {
  await adminApi.saveModelConfig(model);
}

onMounted(async () => {
  models.value = await adminApi.getModels();
});
</script>

<style scoped>
.model-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.model-card {
  padding: 18px;
  border-radius: 20px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.model-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.model-head h3 {
  margin: 0;
}

.model-head p,
.notes {
  margin: 6px 0 0;
  color: var(--text-soft);
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-subtle);
}

.meta-grid {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.meta-item {
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--card-bg-soft);
}

.meta-item span {
  display: block;
  margin-bottom: 8px;
  color: var(--text-subtle);
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

@media (max-width: 1280px) {
  .model-grid {
    grid-template-columns: 1fr;
  }
}
</style>
