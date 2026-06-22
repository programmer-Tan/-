<template>
  <section class="panel feedback-card">
    <div>
      <p class="eyebrow">答案反馈</p>
      <h3>保留用户反馈闭环</h3>
      <p class="helper-copy">后端接入后可将反馈直接回传到训练样本池和运营报表。</p>
    </div>

    <div class="feedback-actions">
      <button
        v-for="item in options"
        :key="item.value"
        type="button"
        class="feedback-btn"
        :class="{ active: modelValue === item.value }"
        @click="$emit('update:modelValue', item.value)"
      >
        {{ item.label }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FeedbackValue } from '@/types';

defineProps<{
  modelValue?: FeedbackValue;
}>();

defineEmits<{
  (event: 'update:modelValue', value: FeedbackValue): void;
}>();

const options: Array<{ value: FeedbackValue; label: string }> = [
  { value: 'useful', label: '有用' },
  { value: 'unhelpful', label: '一般' },
  { value: 'incorrect', label: '错误' }
];
</script>

<style scoped>
.feedback-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.feedback-card h3 {
  margin: 4px 0 8px;
}

.helper-copy {
  margin: 0;
  color: var(--text-muted);
}

.feedback-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.feedback-btn {
  padding: 12px 18px;
  border: 1px solid rgba(26, 87, 82, 0.12);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.88);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.feedback-btn.active {
  background: rgba(245, 163, 94, 0.2);
  color: var(--brand-strong);
  transform: translateY(-1px);
}

@media (max-width: 720px) {
  .feedback-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
