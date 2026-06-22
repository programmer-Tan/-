<template>
  <article class="metric-card">
    <p class="eyebrow">{{ label }}</p>
    <div class="metric-line">
      <strong>{{ value }}</strong>
      <span class="trend">{{ trend }}</span>
    </div>
    <p class="note">{{ note }}</p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  trend: string;
  note: string;
}>();
</script>

<style scoped>
.metric-card {
  padding: 18px;
  border-radius: 22px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.metric-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin: 10px 0 8px;
}

.metric-line strong {
  font-size: 1.9rem;
}

.trend {
  color: var(--brand-strong);
  font-weight: 700;
}

.note {
  margin: 0;
  color: var(--text-muted);
}
</style>
