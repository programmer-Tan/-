<template>
  <section class="panel answer-card">
    <div class="card-head">
      <div>
        <p class="eyebrow">问答结果</p>
        <h3>{{ answer?.title ?? '等待生成结果' }}</h3>
      </div>
      <span v-if="answer" class="capsule">{{ riskLabel(answer.riskLevel) }}</span>
    </div>

    <template v-if="answer">
      <div class="summary-panel">
        <div>
          <span class="eyebrow">简洁答案</span>
          <strong>{{ answer.conciseAnswer }}</strong>
        </div>
        <div class="confidence-box">
          <span>置信度</span>
          <strong>{{ formatConfidence(answer.confidence) }}</strong>
        </div>
      </div>

      <p class="answer-text">{{ answer.answerText }}</p>

      <div class="meta-grid">
        <div>
          <span>处理时长</span>
          <strong>{{ formatDuration(answer.processingMs) }}</strong>
        </div>
        <div>
          <span>语音播报文案</span>
          <strong>{{ answer.spokenText }}</strong>
        </div>
      </div>

      <div class="risk-box">
        <span class="eyebrow">安全提示</span>
        <p>{{ answer.riskNotice }}</p>
      </div>

      <div class="evidence-list">
        <article v-for="item in answer.evidence" :key="item.label" class="evidence-item">
          <div class="evidence-bar">
            <span>{{ item.label }}</span>
            <strong>{{ Math.round(item.confidence * 100) }}%</strong>
          </div>
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: `${Math.round(item.confidence * 100)}%` }"></div>
          </div>
          <p>{{ item.reason }}</p>
        </article>
      </div>

      <div class="followup-block">
        <span class="eyebrow">推荐继续追问</span>
        <div class="prompt-list">
          <span v-for="item in answer.followUps" :key="item" class="capsule warm">{{ item }}</span>
        </div>
      </div>

      <div class="citation-block">
        <span class="eyebrow">答案依据</span>
        <ul>
          <li v-for="item in answer.citations" :key="item">{{ item }}</li>
        </ul>
      </div>
    </template>

    <div v-else class="empty-state">
      <div class="empty-art"></div>
      <p>上传图片并提交问题后，这里会展示答案、置信度、证据高亮与安全提示。</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AnswerResult } from '@/types';
import { formatConfidence, formatDuration, riskLabel } from '@/utils/format';

defineProps<{
  answer?: AnswerResult | null;
}>();
</script>

<style scoped>
.answer-card {
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

.summary-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 16px;
  padding: 18px;
  border-radius: 22px;
  background:
    radial-gradient(circle at top right, rgba(245, 163, 94, 0.18), transparent 28%),
    rgba(255, 252, 247, 0.92);
}

.summary-panel strong {
  display: block;
  margin-top: 8px;
  font-size: 1.2rem;
}

.confidence-box {
  padding: 16px;
  border-radius: 18px;
  background: rgba(26, 87, 82, 0.08);
}

.confidence-box strong {
  display: block;
  margin-top: 8px;
  font-size: 1.3rem;
}

.answer-text,
.risk-box p,
.citation-block ul {
  margin: 0;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.meta-grid div,
.risk-box,
.evidence-item,
.citation-block {
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.84);
}

.meta-grid span,
.risk-box span,
.citation-block span {
  display: block;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.evidence-list {
  display: grid;
  gap: 12px;
}

.evidence-bar {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.bar-track {
  height: 10px;
  border-radius: 999px;
  background: rgba(26, 87, 82, 0.08);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--brand-strong), var(--accent-strong));
}

.followup-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prompt-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.empty-state {
  min-height: 320px;
  display: grid;
  place-items: center;
  text-align: center;
  color: var(--text-muted);
}

.empty-art {
  width: 140px;
  height: 140px;
  border-radius: 36px;
  background:
    linear-gradient(135deg, rgba(26, 87, 82, 0.18), rgba(245, 163, 94, 0.32)),
    rgba(255, 255, 255, 0.72);
  margin-bottom: 18px;
}

@media (max-width: 720px) {
  .summary-panel,
  .meta-grid {
    grid-template-columns: 1fr;
  }

  .card-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
