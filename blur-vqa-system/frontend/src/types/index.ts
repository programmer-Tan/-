export type InputMode = 'text' | 'voice';
export type RiskLevel = 'low' | 'medium' | 'high';
export type FeedbackValue = 'useful' | 'unhelpful' | 'incorrect';
export type RecordStatus = 'answered' | 'needs_retry' | 'unsafe';
export type QuestionCategory =
  | 'object'
  | 'ocr'
  | 'scene'
  | 'color'
  | 'count'
  | 'usage'
  | 'safety';

export interface ImageDiagnostic {
  blurScore: number;
  exposure: 'normal' | 'dim' | 'bright';
  completeness: 'good' | 'partial';
  recommendation: string;
  tags: string[];
}

export interface EvidenceItem {
  label: string;
  confidence: number;
  reason: string;
}

export interface AnswerResult {
  id: string;
  title: string;
  answerText: string;
  conciseAnswer: string;
  confidence: number;
  category: QuestionCategory;
  riskLevel: RiskLevel;
  riskNotice: string;
  spokenText: string;
  followUps: string[];
  evidence: EvidenceItem[];
  citations: string[];
  processingMs: number;
}

export interface HistoryRecord {
  id: string;
  createdAt: string;
  imageLabel: string;
  imageHint: string;
  question: string;
  transcript?: string;
  inputMode: InputMode;
  category: QuestionCategory;
  status: RecordStatus;
  answer: AnswerResult;
  diagnostics: ImageDiagnostic;
  feedback?: FeedbackValue;
  userName: string;
}

export interface SampleScene {
  id: string;
  title: string;
  description: string;
  hint: string;
  imageLabel: string;
  recommendedQuestion: string;
  category: QuestionCategory;
  diagnostics: ImageDiagnostic;
}

export interface WorkbenchData {
  activeModelName: string;
  quickPrompts: string[];
  sampleScenes: SampleScene[];
  recentRecords: HistoryRecord[];
  featuredAnswer: AnswerResult;
  notices: string[];
}

export interface SubmitQuestionPayload {
  question: string;
  inputMode: InputMode;
  category: QuestionCategory;
  sampleSceneId?: string;
  imageName?: string;
  transcript?: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  trend: string;
  note: string;
}

export interface CategoryStat {
  category: QuestionCategory;
  label: string;
  count: number;
  ratio: number;
}

export interface AdminOverview {
  metrics: DashboardMetric[];
  categoryStats: CategoryStat[];
  riskAlerts: string[];
  unresolvedRate: number;
}

export interface SafetyRule {
  id: string;
  name: string;
  scope: string;
  severity: 'low' | 'medium' | 'high';
  enabled: boolean;
  updatedAt: string;
}

export interface SystemSetting {
  id: string;
  label: string;
  value: string;
  group: string;
  description: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  role: 'admin';
  phone: string;
  email: string;
  department: string;
  lastLoginAt: string;
  avatarText: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'reviewer' | 'member';
  status: 'active' | 'idle' | 'disabled';
  lastActiveAt: string;
  questionCount: number;
  helpfulRate: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  version: string;
  endpoint: string;
  enabled: boolean;
  latency: string;
  strengths: string[];
  notes: string;
}

export interface SystemLog {
  id: string;
  time: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  module: string;
  message: string;
}

export type AuthFormMode = 'login' | 'register';
export type AuthIdentifierType = 'email' | 'phone';

export interface AuthAccount {
  id: string;
  name: string;
  identifier: string;
  identifierType: AuthIdentifierType;
  role: 'user' | 'admin';
}

export interface RegisteredAccount extends AuthAccount {
  password: string;
  createdAt: string;
}
