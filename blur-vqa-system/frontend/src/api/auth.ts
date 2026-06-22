import type { AuthAccount, AuthFormMode, AuthIdentifierType, RegisteredAccount } from '@/types';

const ACCOUNT_STORAGE_KEY = 'blur-vqa-auth-accounts';

function readAccounts(): RegisteredAccount[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as RegisteredAccount[];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: RegisteredAccount[]) {
  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
}

function detectIdentifierType(identifier: string): AuthIdentifierType {
  return identifier.includes('@') ? 'email' : 'phone';
}

export async function registerAccount(payload: {
  name: string;
  identifier: string;
  password: string;
  role: 'user' | 'admin';
}): Promise<RegisteredAccount> {
  const accounts = readAccounts();
  const normalizedIdentifier = payload.identifier.trim().toLowerCase();

  const exists = accounts.some((item) => item.identifier === normalizedIdentifier);
  if (exists) {
    throw new Error('该邮箱或手机号已注册，请直接登录。');
  }

  const account: RegisteredAccount = {
    id: `account-${Date.now()}`,
    name: payload.name.trim(),
    identifier: normalizedIdentifier,
    identifierType: detectIdentifierType(normalizedIdentifier),
    password: payload.password,
    role: payload.role,
    createdAt: new Date().toISOString()
  };

  accounts.push(account);
  writeAccounts(accounts);
  return account;
}

export async function loginAccount(payload: {
  identifier: string;
  password: string;
  role?: 'user' | 'admin';
}): Promise<AuthAccount> {
  const accounts = readAccounts();
  const normalizedIdentifier = payload.identifier.trim().toLowerCase();

  const target = accounts.find((item) => item.identifier === normalizedIdentifier);

  if (!target) {
    throw new Error('账号不存在，请先注册。');
  }

  if (target.password !== payload.password) {
    throw new Error('密码错误，请重新输入。');
  }

  if (payload.role && target.role !== payload.role) {
    throw new Error(payload.role === 'admin' ? '该账号不是管理员账号。' : '该账号不是普通用户账号。');
  }

  return {
    id: target.id,
    name: target.name,
    identifier: target.identifier,
    identifierType: target.identifierType,
    role: target.role
  };
}

export function getRegisteredAccounts(): RegisteredAccount[] {
  return readAccounts();
}

export function getDefaultAuthMode(): AuthFormMode {
  return readAccounts().length > 0 ? 'login' : 'register';
}
