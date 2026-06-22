import { request } from './client';
import { buildMockAnswer, cloneMock, historyRecords, updateRecordFeedback, workbenchData } from './mockData';
import type { FeedbackValue, HistoryRecord, SubmitQuestionPayload, WorkbenchData, AnswerResult } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

function wait<T>(value: T, delay = 420): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), delay);
  });
}

export const vqaApi = {
  async getWorkbenchData(): Promise<WorkbenchData> {
    if (USE_MOCK) {
      return wait(cloneMock(workbenchData), 280);
    }

    return request<WorkbenchData>('/workbench');
  },

  async getHistoryRecords(): Promise<HistoryRecord[]> {
    if (USE_MOCK) {
      return wait(cloneMock(historyRecords), 360);
    }

    return request<HistoryRecord[]>('/records');
  },

  async submitQuestion(payload: SubmitQuestionPayload): Promise<AnswerResult> {
    if (USE_MOCK) {
      return wait(buildMockAnswer(payload), 720);
    }

    return request<AnswerResult>('/vqa/ask', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async submitFeedback(recordId: string, feedback: FeedbackValue): Promise<void> {
    if (USE_MOCK) {
      updateRecordFeedback(recordId, feedback);
      return wait(undefined, 180);
    }

    await request<void>(`/records/${recordId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ feedback })
    });
  }
};
