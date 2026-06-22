<template>
  <section class="panel composer-card">
    <div class="card-head">
      <div>
        <p class="eyebrow">问题输入</p>
        <h3>文本提问与语音提问</h3>
      </div>
      <span class="capsule">当前模型：{{ modelName }}</span>
    </div>

    <div class="mode-group">
      <button
        v-for="mode in modes"
        :key="mode.value"
        type="button"
        class="mode-btn"
        :class="{ active: inputMode === mode.value }"
        @click="$emit('update:inputMode', mode.value)"
      >
        {{ mode.label }}
      </button>
    </div>

    <div class="category-grid">
      <button
        v-for="item in categories"
        :key="item.value"
        type="button"
        class="category-chip"
        :class="{ active: category === item.value }"
        @click="$emit('update:category', item.value)"
      >
        {{ item.label }}
      </button>
    </div>

    <label class="input-label">
      <span>{{ inputMode === 'voice' ? '语音转写内容' : '输入问题' }}</span>
      <textarea
        :value="question"
        rows="4"
        placeholder="例如：标签上写了什么？这个物品怎么使用？"
        @input="$emit('update:question', ($event.target as HTMLTextAreaElement).value)"
      />
    </label>

    <div v-if="inputMode === 'voice'" class="voice-panel">
      <div>
        <span class="eyebrow">ASR 模拟结果</span>
        <strong>{{ transcript || '点击按钮后将填充模拟语音转写结果' }}</strong>
      </div>
      <button class="secondary-btn" type="button" @click="$emit('simulate-voice')">生成模拟转写</button>
    </div>

    <div class="quick-prompts">
      <span class="eyebrow">快捷问题</span>
      <div class="prompt-list">
        <button
          v-for="prompt in quickPrompts"
          :key="prompt"
          type="button"
          class="prompt-chip"
          @click="$emit('use-prompt', prompt)"
        >
          {{ prompt }}
        </button>
      </div>
    </div>

    <button class="primary-btn" type="button" :disabled="pending" @click="$emit('submit')">
      {{ pending ? '回答生成中...' : '提交问题' }}
    </button>
  </section>
</template>

<script setup lang="ts">
import type { InputMode, QuestionCategory } from '@/types';

defineProps<{
  modelName: string;
  inputMode: InputMode;
  category: QuestionCategory;
  question: string;
  transcript?: string;
  quickPrompts: string[];
  pending: boolean;
}>();

defineEmits<{
  (event: 'update:inputMode', value: InputMode): void;
  (event: 'update:category', value: QuestionCategory): void;
  (event: 'update:question', value: string): void;
  (event: 'simulate-voice'): void;
  (event: 'use-prompt', value: string): void;
  (event: 'submit'): void;
}>();

const modes: Array<{ value: InputMode; label: string }> = [
  { value: 'text', label: '文本提问' },
  { value: 'voice', label: '语音提问' }
];

const categories: Array<{ value: QuestionCategory; label: string }> = [
  { value: 'object', label: '物体识别' },
  { value: 'ocr', label: '标签读取' },
  { value: 'scene', label: '场景描述' },
  { value: 'usage', label: '使用建议' },
  { value: 'safety', label: '安全提醒' }
];
</script>

<style scoped>
.composer-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.card-head h3 {
  margin: 4px 0 0;
}

.mode-group,
.category-grid,
.prompt-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.mode-btn,
.category-chip,
.prompt-chip {
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.mode-btn {
  padding: 12px 18px;
  border-radius: 999px;
  background: rgba(26, 87, 82, 0.08);
  color: var(--text-main);
}

.mode-btn.active {
  background: var(--brand-strong);
  color: white;
}

.category-chip,
.prompt-chip {
  padding: 10px 14px;
  border-radius: 16px;
  background: rgba(255, 252, 247, 0.96);
}

.category-chip.active {
  background: rgba(245, 163, 94, 0.18);
  color: var(--brand-strong);
}

.input-label span {
  display: inline-block;
  margin-bottom: 10px;
  font-weight: 600;
}

.input-label textarea {
  width: 100%;
  padding: 16px 18px;
  border-radius: 22px;
  border: 1px solid rgba(26, 87, 82, 0.14);
  background: rgba(255, 255, 255, 0.9);
  resize: vertical;
  font: inherit;
  color: var(--text-main);
}

.voice-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(26, 87, 82, 0.1), rgba(245, 163, 94, 0.1));
}

.quick-prompts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (max-width: 720px) {
  .card-head,
  .voice-panel {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
