const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new ApiError(`请求失败: ${response.status}`, response.status);
  }

  const result = (await response.json()) as T | { data: T };

  if (typeof result === 'object' && result !== null && 'data' in result) {
    return result.data;
  }

  return result as T;
}
