<template>
  <AdminPageShell eyebrow="9 个人中心" title="个人中心" description="保留管理员资料、联系方式和最近登录信息。">
    <div class="profile-layout" v-if="profile">
      <section class="profile-card">
        <div class="avatar-box">{{ profile.avatarText }}</div>
        <h3>{{ profile.name }}</h3>
        <p>{{ profile.department }}</p>
        <span class="capsule">{{ profile.role === 'admin' ? '管理员' : profile.role }}</span>
      </section>

      <section class="detail-card">
        <div class="detail-grid">
          <div class="detail-row">
            <span>用户名</span>
            <strong>{{ profile.name }}</strong>
          </div>
          <div class="detail-row">
            <span>手机号</span>
            <strong>{{ profile.phone }}</strong>
          </div>
          <div class="detail-row">
            <span>邮箱</span>
            <strong>{{ profile.email }}</strong>
          </div>
          <div class="detail-row">
            <span>所属部门</span>
            <strong>{{ profile.department }}</strong>
          </div>
          <div class="detail-row">
            <span>最近登录</span>
            <strong>{{ formatDateTime(profile.lastLoginAt) }}</strong>
          </div>
        </div>

        <div class="button-row">
          <button type="button" class="primary-btn">编辑资料</button>
          <button type="button" class="secondary-btn">修改密码</button>
        </div>
      </section>
    </div>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminPageShell from '@/components/admin/AdminPageShell.vue';
import { adminApi } from '@/api/admin';
import type { AdminProfile } from '@/types';
import { formatDateTime } from '@/utils/format';

const profile = ref<AdminProfile | null>(null);

onMounted(async () => {
  profile.value = await adminApi.getProfile();
});
</script>

<style scoped>
.profile-layout {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 16px;
}

.profile-card,
.detail-card {
  padding: 22px;
  border-radius: 20px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.profile-card {
  display: grid;
  justify-items: center;
  align-content: start;
  gap: 10px;
  text-align: center;
}

.avatar-box {
  display: grid;
  place-items: center;
  width: 82px;
  height: 82px;
  border-radius: 24px;
  background: linear-gradient(135deg, #3269ff, #78a8ff);
  color: white;
  font-size: 2rem;
  font-weight: 700;
}

.profile-card h3,
.profile-card p {
  margin: 0;
}

.profile-card p {
  color: var(--text-soft);
}

.detail-grid {
  display: grid;
  gap: 12px;
}

.detail-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--card-bg-soft);
}

.detail-row span {
  color: var(--text-subtle);
}

.button-row {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

@media (max-width: 1280px) {
  .profile-layout,
  .detail-row {
    grid-template-columns: 1fr;
  }
}
</style>
