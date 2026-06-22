<template>
  <div class="admin-page-shell panel">
    <header class="page-head">
      <div>
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        <p v-if="description" class="description">{{ description }}</p>
      </div>

      <div v-if="$slots.actions" class="head-actions">
        <slot name="actions" />
      </div>
    </header>

    <section class="page-body admin-scroll-hidden">
      <slot />
    </section>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow: string;
  title: string;
  description?: string;
}>();
</script>

<style scoped>
.admin-page-shell {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 18px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.page-head h2 {
  margin: 4px 0 0;
  font-size: 1.34rem;
}

.description {
  margin: 8px 0 0;
  color: var(--text-soft);
  line-height: 1.6;
}

.head-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-body {
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
}

.admin-scroll-hidden {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.admin-scroll-hidden::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
