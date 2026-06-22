<template>
  <div class="login-page">
    <section class="auth-card">
      <div class="brand-block">
        <img :src="logoUrl" alt="系统 Logo" class="brand-logo" />
        <h1>模糊视觉辅助问答系统</h1>
        <p>{{ mode === 'login' ? '账号登录' : '账号注册' }}</p>
      </div>

      <div class="auth-tabs">
        <button
          type="button"
          class="tab-btn"
          :class="{ active: mode === 'login' }"
          @click="switchMode('login')"
        >
          登录
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ active: mode === 'register' }"
          @click="switchMode('register')"
        >
          注册
        </button>
      </div>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="role-switch">
          <button
            type="button"
            class="role-btn"
            :class="{ active: form.role === 'user' }"
            @click="form.role = 'user'"
          >
            用户端
          </button>
          <button
            type="button"
            class="role-btn"
            :class="{ active: form.role === 'admin' }"
            @click="form.role = 'admin'"
          >
            管理端
          </button>
        </div>

        <input
          v-if="mode === 'register'"
          v-model.trim="form.name"
          type="text"
          class="auth-input"
          placeholder="昵称"
        />

        <div class="field-top">
          <span class="field-tip">{{ identifierLabel }}</span>
          <button
            type="button"
            class="switch-link"
            @click="identifierType = identifierType === 'email' ? 'phone' : 'email'"
          >
            {{ identifierType === 'email' ? '切换手机号' : '切换邮箱' }}
          </button>
        </div>

        <input
          v-model.trim="form.identifier"
          type="text"
          class="auth-input"
          :placeholder="identifierType === 'email' ? '请输入邮箱地址' : '请输入手机号'"
        />

        <input
          v-model.trim="form.password"
          type="password"
          class="auth-input"
          placeholder="密码"
        />

        <input
          v-if="mode === 'register'"
          v-model.trim="form.confirmPassword"
          type="password"
          class="auth-input"
          placeholder="确认密码"
        />

        <p v-if="errorMessage" class="feedback-text error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="feedback-text success">{{ successMessage }}</p>

        <button class="primary-btn submit-btn" type="submit" :disabled="submitting">
          {{ submitting ? '处理中...' : mode === 'login' ? '登录' : '注册' }}
        </button>
      </form>

      <div class="bottom-note">
        <p v-if="mode === 'login'">
          没有账号？
          <button type="button" class="text-btn" @click="switchMode('register')">注册</button>
        </p>
        <p v-else>
          已有账号？
          <button type="button" class="text-btn" @click="switchMode('login')">返回登录</button>
        </p>
        <p v-if="savedAccounts.length > 0" class="saved-tip">本机已保存 {{ savedAccounts.length }} 个账号</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import logoUrl from '@/assets/logo.svg';
import { getDefaultAuthMode, getRegisteredAccounts, loginAccount, registerAccount } from '@/api/auth';
import { useSessionStore } from '@/stores/session';
import type { AuthFormMode, AuthIdentifierType } from '@/types';

const router = useRouter();
const session = useSessionStore();

const mode = ref<AuthFormMode>(getDefaultAuthMode());
const identifierType = ref<AuthIdentifierType>('email');
const submitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const savedAccounts = ref(getRegisteredAccounts());

const form = ref({
  name: '',
  identifier: '',
  password: '',
  confirmPassword: '',
  role: 'user' as 'user' | 'admin'
});

const identifierLabel = computed(() => (identifierType.value === 'email' ? '邮箱地址' : '手机号码'));

function switchMode(nextMode: AuthFormMode) {
  mode.value = nextMode;
  errorMessage.value = '';
  successMessage.value = '';
}

function resetRegisterFields() {
  form.value.name = '';
  form.value.confirmPassword = '';
}

async function handleSubmit() {
  errorMessage.value = '';
  successMessage.value = '';
  submitting.value = true;

  try {
    if (!form.value.identifier || !form.value.password) {
      throw new Error('请完整填写账号和密码。');
    }

    if (mode.value === 'register') {
      if (!form.value.name) {
        throw new Error('请输入昵称。');
      }

      if (form.value.password.length < 6) {
        throw new Error('密码长度至少 6 位。');
      }

      if (form.value.password !== form.value.confirmPassword) {
        throw new Error('两次输入的密码不一致。');
      }

      await registerAccount({
        name: form.value.name,
        identifier: form.value.identifier,
        password: form.value.password,
        role: form.value.role
      });

      savedAccounts.value = getRegisteredAccounts();
      successMessage.value = '注册成功，请直接登录。';
      mode.value = 'login';
      resetRegisterFields();
      return;
    }

    const account = await loginAccount({
      identifier: form.value.identifier,
      password: form.value.password,
      role: form.value.role
    });

    session.loginWithAccount(account);
    void router.push(account.role === 'admin' ? '/admin/overview' : '/user/workbench');
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '操作失败，请稍后重试。';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(50, 105, 255, 0.16), transparent 24%),
    radial-gradient(circle at bottom right, rgba(32, 201, 151, 0.08), transparent 24%),
    var(--bg-page);
}

.auth-card {
  width: min(380px, 100%);
  padding: 28px 26px 22px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.985);
  border: 1px solid rgba(228, 235, 251, 0.92);
  box-shadow:
    0 20px 48px rgba(30, 46, 84, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(18px);
}

.brand-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.brand-logo {
  width: 58px;
  height: 58px;
  margin-bottom: 12px;
  object-fit: contain;
}

.brand-block h1 {
  margin: 0;
  font-size: 1.34rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.brand-block p,
.bottom-note p,
.saved-tip {
  margin: 0;
  color: var(--text-soft);
}

.brand-block p {
  margin-top: 6px;
  font-size: 0.92rem;
  color: var(--text-subtle);
}

.auth-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 4px;
  margin-bottom: 20px;
  border-radius: 999px;
  background: #f1f5ff;
}

.tab-btn,
.small-toggle,
.text-btn {
  border: none;
  cursor: pointer;
}

.tab-btn {
  padding: 10px 18px;
  border-radius: 999px;
  background: transparent;
  color: var(--text-soft);
  font-weight: 700;
}

.tab-btn.active {
  background: white;
  color: #3269ff;
  box-shadow: 0 4px 14px rgba(50, 105, 255, 0.12);
}

.auth-form {
  display: grid;
  gap: 12px;
}

.role-switch {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 2px;
}

.role-btn {
  padding: 11px 14px;
  border: 1px solid var(--line-soft);
  border-radius: 16px;
  background: #f8fbff;
  color: var(--text-soft);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-btn.active {
  border-color: rgba(50, 105, 255, 0.22);
  background: #eef3ff;
  color: #3269ff;
  box-shadow: 0 8px 18px rgba(50, 105, 255, 0.08);
}

.field-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
}

.field-tip {
  font-size: 0.88rem;
  color: var(--text-subtle);
  font-weight: 600;
}

.switch-link {
  padding: 0;
  border: none;
  background: transparent;
  color: #3269ff;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
}

.auth-input {
  width: 100%;
  padding: 13px 14px;
  border-radius: 16px;
  border: 1px solid var(--line-soft);
  background: #fbfcff;
  font: inherit;
}

.auth-input:focus,
.role-btn:focus {
  outline: none;
  border-color: rgba(50, 105, 255, 0.45);
  box-shadow: 0 0 0 4px rgba(50, 105, 255, 0.08);
}

.submit-btn {
  justify-content: center;
  width: 100%;
  margin-top: 2px;
  border-radius: 16px;
}

.feedback-text {
  margin: 0;
  font-size: 0.92rem;
}

.feedback-text.error {
  color: #e24a4a;
}

.feedback-text.success {
  color: #1aaf77;
}

.bottom-note {
  display: grid;
  gap: 6px;
  margin-top: 16px;
  text-align: center;
}

.text-btn {
  padding: 0;
  background: transparent;
  color: #3269ff;
  font: inherit;
  font-weight: 700;
}

.saved-tip {
  font-size: 0.88rem;
}

@media (max-width: 520px) {
  .login-page {
    padding: 16px;
  }

  .auth-card {
    width: 100%;
    padding: 24px 18px 20px;
    border-radius: 24px;
  }
}
</style>
