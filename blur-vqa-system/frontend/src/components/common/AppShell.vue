<template>
  <div class="shell" :class="{ 'shell-user': currentSection === 'user' }">
    <aside v-if="currentSection === 'admin'" class="sidebar">
      <div class="brand-panel">
        <div class="brand">
          <div class="brand-mark">
            <img :src="logoUrl" alt="模糊视觉辅助问答系统 Logo" />
          </div>
          <div>
            <h1>模糊视觉辅助问答系统</h1>
            <p>AI Visual Q&amp;A Assistant</p>
          </div>
        </div>
      </div>

      <nav class="nav">
        <RouterLink
          v-for="item in activeNavItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: route.path === item.to }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <div>
            <strong>{{ item.label }}</strong>
          </div>
        </RouterLink>
      </nav>

      <div class="status-card">
        <p class="status-title">系统状态</p>
        <div class="status-item">
          <span>图像处理</span>
          <strong>进行中</strong>
        </div>
        <div class="status-item">
          <span>OCR服务</span>
          <strong>运行中</strong>
        </div>
        <div class="status-item">
          <span>AI推理服务</span>
          <strong>运行中</strong>
        </div>
        <div class="status-item">
          <span>语音服务</span>
          <strong>已连接</strong>
        </div>
      </div>

      <button class="collapse-btn" type="button">管理菜单</button>
    </aside>

    <div class="workspace">
      <header class="topbar">
        <div class="topbar-main">
          <div class="topbar-brand">
            <div class="topbar-brand-mark">
              <img :src="logoUrl" alt="模糊视觉辅助问答系统 Logo" />
            </div>
            <div class="page-intro">
              <p class="page-kicker">{{ pageKicker }}</p>
              <div class="page-title-row">
                <strong>模糊视觉辅助问答系统</strong>
                <span class="role-badge">{{ roleLabel }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="top-actions">
          <button type="button" class="ghost-btn">帮助</button>
          <button type="button" class="ghost-btn warn" @click="handleLogout">退出</button>
          <div class="user-card">
            <div class="avatar">{{ avatarText }}</div>
            <div class="user-copy">
              <strong>{{ welcomeName }}</strong>
              <p>{{ topbarStatus }}</p>
            </div>
          </div>
        </div>
      </header>

      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import logoUrl from '@/assets/logo.svg';
import { useSessionStore } from '@/stores/session';

const route = useRoute();
const router = useRouter();
const session = useSessionStore();

const userNavItems = [
  {
    to: '/user/workbench',
    icon: 'H',
    label: '智能问答'
  },
  {
    to: '/user/history',
    icon: 'R',
    label: '历史记录'
  }
];

const adminNavItems = [
  {
    to: '/admin/overview',
    icon: '1',
    label: '首页概览'
  },
  {
    to: '/admin/users',
    icon: '2',
    label: '用户管理'
  },
  {
    to: '/admin/records',
    icon: '3',
    label: '问答记录'
  },
  {
    to: '/admin/analytics',
    icon: '4',
    label: '数据统计'
  },
  {
    to: '/admin/models',
    icon: '5',
    label: '模型管理'
  },
  {
    to: '/admin/safety',
    icon: '6',
    label: '风险与安全'
  },
  {
    to: '/admin/settings',
    icon: '7',
    label: '系统设置'
  },
  {
    to: '/admin/logs',
    icon: '8',
    label: '日志管理'
  },
  {
    to: '/admin/profile',
    icon: '9',
    label: '个人中心'
  }
];

const currentSection = computed(() => String(route.meta.appSection ?? 'user'));
const activeNavItems = computed(() => (currentSection.value === 'admin' ? adminNavItems : userNavItems));
const pageTitle = computed(() => String(route.meta.title ?? '系统'));
const displayTitle = computed(() => pageTitle.value.replace(/^用户端 - /, '').replace(/^管理端 - /, ''));
const welcomeName = computed(() => session.state.displayName || '您好');
const avatarText = computed(() => (session.state.displayName || 'A').slice(0, 1));
const roleLabel = computed(() => (currentSection.value === 'admin' ? '管理员模式' : '用户模式'));
const pageKicker = computed(() => `当前页面 · ${displayTitle.value}`);
const topbarStatus = computed(() => (currentSection.value === 'admin' ? '后台已连接' : '当前已登录'));

function handleLogout() {
  session.logout();
  void router.push('/login');
}
</script>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr);
  min-height: 100vh;
  background: var(--bg-page);
}

.shell-user {
  grid-template-columns: minmax(0, 1fr);
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0 14px 18px;
  background: linear-gradient(180deg, #07152d 0%, #091a38 100%);
  color: rgba(255, 255, 255, 0.92);
  height: 100vh;
  overflow: hidden;
}

.brand-panel {
  margin: 0 -14px;
  padding: 18px 18px 22px;
  border-bottom-right-radius: 24px;
  background: linear-gradient(180deg, rgba(10, 25, 54, 0.98), rgba(7, 21, 45, 0.98));
  box-shadow: 0 20px 36px rgba(1, 8, 20, 0.28);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
}

.brand-mark img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brand h1 {
  margin: 0 0 4px;
  font-size: 1.05rem;
}

.brand p {
  margin: 0;
  color: rgba(221, 230, 255, 0.72);
  font-size: 0.82rem;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nav::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.nav-link {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 13px 14px;
  border-radius: 14px;
  color: rgba(232, 238, 255, 0.9);
  text-decoration: none;
  border: 1px solid transparent;
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}

.nav-link:hover,
.nav-link.active {
  background: linear-gradient(135deg, rgba(50, 105, 255, 0.28), rgba(34, 76, 194, 0.5));
  border-color: rgba(111, 152, 255, 0.34);
  transform: translateX(2px);
}

.nav-icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
}

.status-card {
  margin-top: auto;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.status-title {
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.95rem;
  font-weight: 600;
}

.status-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  color: rgba(218, 227, 255, 0.8);
  font-size: 0.9rem;
}

.status-item strong {
  color: #4de08d;
  font-size: 0.88rem;
}

.collapse-btn {
  margin-top: 8px;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(232, 238, 255, 0.9);
  cursor: pointer;
}

.workspace {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
  padding: 16px 18px 18px;
  height: 100vh;
  overflow: hidden;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 16px 22px;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 251, 255, 0.95)),
    white;
  border: 1px solid rgba(217, 225, 244, 0.45);
  box-shadow:
    0 18px 36px rgba(30, 46, 84, 0.045),
    inset 0 1px 0 rgba(255, 255, 255, 0.86);
}

.topbar-main,
.top-actions,
.page-title-row,
.topbar-brand,
.user-card {
  display: flex;
  align-items: center;
}

.topbar-main {
  gap: 12px;
  min-width: 0;
}

.topbar-brand {
  gap: 14px;
  min-width: 0;
}

.topbar-brand-mark {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  padding: 7px;
  border-radius: 14px;
  background: linear-gradient(180deg, #eef4ff, #e6efff);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.74);
}

.topbar-brand-mark img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.page-intro {
  min-width: 0;
}

.page-kicker {
  margin: 0 0 6px;
  color: var(--text-subtle);
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}

.page-title-row {
  gap: 12px;
  flex-wrap: wrap;
}

.page-title-row strong {
  display: block;
  color: var(--text-main);
  font-size: 1.2rem;
  line-height: 1.2;
}

.role-badge {
  padding: 7px 12px;
  border-radius: 999px;
  background: linear-gradient(180deg, #edf4ff, #e6efff);
  color: #3269ff;
  font-size: 0.8rem;
  font-weight: 700;
}

.top-actions {
  gap: 12px;
  flex-shrink: 0;
}

.ghost-btn {
  padding: 10px 16px;
  border: 1px solid rgba(225, 233, 251, 0.5);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: #5f6f92;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.ghost-btn.warn {
  color: #3269ff;
}

.user-card {
  gap: 12px;
  padding: 8px 10px 8px 8px;
  border-radius: 999px;
  background: linear-gradient(180deg, #f7faff, #eef4ff);
  border: 1px solid rgba(228, 235, 251, 0.5);
}

.avatar {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2e5be9, #6f96ff);
  color: white;
  box-shadow: 0 8px 18px rgba(50, 105, 255, 0.2);
  font-weight: 700;
}

.user-copy strong {
  display: block;
  color: var(--text-main);
  font-size: 0.94rem;
}

.user-copy p {
  margin: 3px 0 0;
  color: var(--text-subtle);
  font-size: 0.8rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
  overflow: hidden;
  height: 100%;
}

@media (max-width: 1100px) {
  .shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    min-height: auto;
  }
}

@media (max-width: 720px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .topbar-main {
    width: 100%;
    align-items: flex-start;
  }

  .top-actions {
    width: 100%;
    justify-content: space-between;
  }

  .workspace {
    padding: 12px;
  }
}
</style>
