import { computed, reactive } from 'vue';
import type { AuthAccount } from '@/types';

export type AppRole = 'guest' | 'user' | 'admin';

interface SessionState {
  isAuthenticated: boolean;
  role: AppRole;
  displayName: string;
  identifier: string;
}

const state = reactive<SessionState>({
  isAuthenticated: false,
  role: 'guest',
  displayName: '',
  identifier: ''
});

export function useSessionStore() {
  const currentRole = computed(() => state.role);
  const isAuthenticated = computed(() => state.isAuthenticated);

  function login(role: Exclude<AppRole, 'guest'>, displayName: string, identifier = '') {
    state.isAuthenticated = true;
    state.role = role;
    state.displayName = displayName;
    state.identifier = identifier;
  }

  function loginWithAccount(account: AuthAccount) {
    login(account.role, account.name, account.identifier);
  }

  function logout() {
    state.isAuthenticated = false;
    state.role = 'guest';
    state.displayName = '';
    state.identifier = '';
  }

  return {
    state,
    currentRole,
    isAuthenticated,
    login,
    loginWithAccount,
    logout
  };
}
