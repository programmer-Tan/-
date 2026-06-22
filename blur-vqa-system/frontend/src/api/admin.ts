import { request } from './client';
import { adminOverview, adminProfile, cloneMock, historyRecords, logs, models, safetyRules, systemSettings, users } from './mockData';
import type { AdminOverview, AdminProfile, HistoryRecord, ModelConfig, SafetyRule, SystemLog, SystemSetting, UserProfile } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

function wait<T>(value: T, delay = 320): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), delay);
  });
}

export const adminApi = {
  async getOverview(): Promise<AdminOverview> {
    if (USE_MOCK) {
      return wait(cloneMock(adminOverview));
    }

    return request<AdminOverview>('/admin/overview');
  },

  async getUsers(): Promise<UserProfile[]> {
    if (USE_MOCK) {
      return wait(cloneMock(users));
    }

    return request<UserProfile[]>('/admin/users');
  },

  async getRecords(): Promise<HistoryRecord[]> {
    if (USE_MOCK) {
      return wait(cloneMock(historyRecords));
    }

    return request<HistoryRecord[]>('/admin/records');
  },

  async getModels(): Promise<ModelConfig[]> {
    if (USE_MOCK) {
      return wait(cloneMock(models));
    }

    return request<ModelConfig[]>('/admin/models');
  },

  async saveModelConfig(model: ModelConfig): Promise<ModelConfig> {
    if (USE_MOCK) {
      return wait(cloneMock(model), 220);
    }

    return request<ModelConfig>(`/admin/models/${model.id}`, {
      method: 'PUT',
      body: JSON.stringify(model)
    });
  },

  async getLogs(): Promise<SystemLog[]> {
    if (USE_MOCK) {
      return wait(cloneMock(logs));
    }

    return request<SystemLog[]>('/admin/logs');
  },

  async getSafetyRules(): Promise<SafetyRule[]> {
    if (USE_MOCK) {
      return wait(cloneMock(safetyRules));
    }

    return request<SafetyRule[]>('/admin/safety-rules');
  },

  async saveSafetyRule(rule: SafetyRule): Promise<SafetyRule> {
    if (USE_MOCK) {
      return wait(cloneMock(rule), 220);
    }

    return request<SafetyRule>(`/admin/safety-rules/${rule.id}`, {
      method: 'PUT',
      body: JSON.stringify(rule)
    });
  },

  async getSettings(): Promise<SystemSetting[]> {
    if (USE_MOCK) {
      return wait(cloneMock(systemSettings));
    }

    return request<SystemSetting[]>('/admin/settings');
  },

  async getProfile(): Promise<AdminProfile> {
    if (USE_MOCK) {
      return wait(cloneMock(adminProfile));
    }

    return request<AdminProfile>('/admin/profile');
  }
};
