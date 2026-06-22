<template>
  <RouterView v-if="isPublicPage" />
  <AppShell v-else>
    <RouterView />
  </AppShell>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import AppShell from '@/components/common/AppShell.vue';

const route = useRoute();
const isPublicPage = computed(() => route.meta.appSection === 'public');
</script>
