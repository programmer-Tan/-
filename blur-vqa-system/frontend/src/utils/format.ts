export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatConfidence(value: number): string {
  return `${Math.round(value * 100)} / 100`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }

  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    object: '物体识别',
    ocr: '标签读取',
    scene: '场景描述',
    color: '颜色判断',
    count: '数量统计',
    usage: '使用建议',
    safety: '安全提醒'
  };

  return map[category] ?? category;
}

export function riskLabel(level: string): string {
  const map: Record<string, string> = {
    low: '低风险',
    medium: '中风险',
    high: '高风险'
  };

  return map[level] ?? level;
}
