<template>
  <div class="workbench-page">
    <div class="main-layout">
      <aside class="input-panel panel">
        <div class="section-block">
          <div class="section-title">
            <span class="step-badge">1</span>
            <h3>上传图片或拍照识别</h3>
          </div>

          <input
            ref="fileInput"
            class="hidden-input"
            type="file"
            accept="image/*"
            @change="onFileInputChange"
          />
          <canvas ref="captureCanvas" class="hidden-canvas"></canvas>

          <div class="capture-actions">
            <button class="capture-btn primary" type="button" @click="openFilePicker">上传图片</button>
            <button
              class="capture-btn"
              type="button"
              :disabled="cameraLoading"
              @click="cameraActive ? stopCamera() : startCamera()"
            >
              {{ cameraLoading ? '启动中...' : cameraActive ? '关闭摄像头' : '打开摄像头' }}
            </button>
          </div>

          <div class="upload-box" :class="{ 'camera-mode': cameraActive }">
            <template v-if="cameraActive">
              <video ref="cameraVideo" class="camera-video" autoplay playsinline muted></video>
              <div class="camera-toolbar">
                <span>{{ cameraHint }}</span>
                <div class="camera-buttons">
                  <button class="minor-btn camera-btn" type="button" @click="capturePhoto">拍照识别</button>
                  <button class="minor-btn camera-btn" type="button" @click="stopCamera">取消</button>
                </div>
              </div>
            </template>

            <template v-else>
              <button class="upload-box-button" type="button" @click="openFilePicker">
                <div class="upload-icon">+</div>
                <strong>{{ fileName || '点击上传图片，或打开摄像头拍照' }}</strong>
                <p>{{ imageSourceLabel }}</p>
              </button>
            </template>
          </div>

          <p v-if="cameraError" class="camera-error">{{ cameraError }}</p>
        </div>

        <div class="section-block">
          <div class="section-title compact">
            <span class="step-badge">2</span>
            <h3>输入你的问题</h3>
          </div>

          <textarea
            v-model="question"
            rows="4"
            class="question-box"
            placeholder="例如：这是什么药？有什么作用？"
          />

          <div class="minor-actions">
            <button class="minor-btn" type="button" @click="simulateVoice">语音输入</button>
            <button class="minor-btn" type="button" @click="resetConversation">清空</button>
          </div>

          <button class="primary-btn action-btn" type="button" :disabled="submitting" @click="submitQuestion">
            {{ submitting ? '分析中...' : '开始分析' }}
          </button>

          <p class="privacy-copy">我们会保护你的隐私，图片仅用于当前分析，不会被公开分享。</p>
        </div>
      </aside>

      <section class="result-panel panel">
        <div class="result-header">
          <div class="header-left">
            <span class="status-dot"></span>
            <strong>分析结果</strong>
          </div>
          <span class="header-time">分析完成于 {{ currentTimeLabel }}</span>
        </div>

        <div class="result-content">
          <div class="image-column">
            <span class="meta-label">图片预览</span>
            <div class="preview-stage">
              <img v-if="previewUrl" :src="previewUrl" alt="预览图像" class="preview-image" />

              <div v-else class="mock-scene">
                <div class="medicine-box">
                  <div class="medicine-side"></div>
                  <div class="medicine-front">
                    <span class="otc-mark">OTC</span>
                    <h4>阿莫西林胶囊</h4>
                    <p>Amoxicillin Capsules</p>
                    <div class="capsule-illustration"></div>
                  </div>
                  <div class="pill-strip">
                    <span v-for="item in 10" :key="item" class="pill"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="info-column">
            <span class="meta-label">AI识别结果</span>
            <div class="title-row">
              <h2>{{ resultTitle }}</h2>
              <span class="type-pill">抗生素类药物</span>
            </div>

            <p class="answer-copy">
              {{ answer?.answerText ?? '上传图片并点击开始分析后，这里会显示系统识别结果。' }}
            </p>

            <div class="progress-card">
              <div class="progress-head">
                <span>可信度</span>
                <strong>{{ confidenceValue }}%</strong>
              </div>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: `${confidenceValue}%` }"></div>
              </div>
            </div>

            <div class="advice-card">
              <strong>使用建议</strong>
              <p>{{ answer?.riskNotice ?? '请结合图片内容与实际情况判断，必要时咨询专业人士。' }}</p>
            </div>
          </div>
        </div>

        <div class="result-footer">
          <p class="warning-copy">风险提示：本结果仅供参考，不能替代专业建议。</p>

          <div class="feedback-row">
            <button
              v-for="item in feedbackOptions"
              :key="item.value"
              type="button"
              class="feedback-btn"
              :class="{ active: feedback === item.value }"
              @click="applyFeedback(item.value)"
            >
              <span class="feedback-icon" aria-hidden="true">
                <svg
                  v-if="item.value === 'useful'"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 21H6.8C5.67 21 5.1 21 4.66 20.78C4.27 20.58 3.95 20.27 3.76 19.88C3.54 19.44 3.54 18.87 3.54 17.74V11.26C3.54 10.13 3.54 9.56 3.76 9.12C3.95 8.73 4.27 8.42 4.66 8.22C5.1 8 5.67 8 6.8 8H8.4C8.91 8 9.16 8 9.39 7.93C9.59 7.86 9.78 7.74 9.93 7.58C10.09 7.43 10.2 7.21 10.43 6.78L12.69 2.5C12.91 2.09 13.37 1.89 13.82 2.02C14.36 2.18 14.69 2.73 14.59 3.28L13.73 8H18.16C19.8 8 20.62 8 21.01 8.35C21.35 8.64 21.55 9.07 21.55 9.53C21.55 10.05 21.29 10.73 20.76 12.08L18.96 16.66C18.55 17.69 18.35 18.2 18 18.58C17.69 18.91 17.31 19.16 16.88 19.31C16.38 19.48 15.83 19.48 14.73 19.48H10V21Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3H6.8C5.67 3 5.1 3 4.66 3.22C4.27 3.42 3.95 3.73 3.76 4.12C3.54 4.56 3.54 5.13 3.54 6.26V12.74C3.54 13.87 3.54 14.44 3.76 14.88C3.95 15.27 4.27 15.58 4.66 15.78C5.1 16 5.67 16 6.8 16H8.4C8.91 16 9.16 16 9.39 16.07C9.59 16.14 9.78 16.26 9.93 16.42C10.09 16.57 10.2 16.79 10.43 17.22L12.69 21.5C12.91 21.91 13.37 22.11 13.82 21.98C14.36 21.82 14.69 21.27 14.59 20.72L13.73 16H18.16C19.8 16 20.62 16 21.01 15.65C21.35 15.36 21.55 14.93 21.55 14.47C21.55 13.95 21.29 13.27 20.76 11.92L18.96 7.34C18.55 6.31 18.35 5.8 18 5.42C17.69 5.09 17.31 4.84 16.88 4.69C16.38 4.52 15.83 4.52 14.73 4.52H10V3Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span>{{ item.label }}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { vqaApi } from '@/api/vqa';
import type { FeedbackValue, HistoryRecord, SampleScene, WorkbenchData } from '@/types';

const workbench = ref<WorkbenchData | null>(null);
const selectedScene = ref<SampleScene | null>(null);
const previewUrl = ref('');
const fileName = ref('');
const question = ref('这是什么药？有什么作用？');
const answer = ref(workbench.value?.featuredAnswer ?? null);
const recentRecords = ref<HistoryRecord[]>([]);
const feedback = ref<FeedbackValue>('useful');
const submitting = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const cameraVideo = ref<HTMLVideoElement | null>(null);
const captureCanvas = ref<HTMLCanvasElement | null>(null);
const cameraActive = ref(false);
const cameraLoading = ref(false);
const cameraError = ref('');
const imageSource = ref<'upload' | 'camera' | 'mock'>('mock');
let cameraStream: MediaStream | null = null;
let objectUrl = '';

const confidenceValue = computed(() => Math.round((answer.value?.confidence ?? 0.87) * 100));
const resultTitle = computed(() => answer.value?.conciseAnswer ?? '等待结果');
const imageSourceLabel = computed(() =>
  imageSource.value === 'camera'
    ? `当前图片来源：摄像头拍照 · ${fileName.value || '已拍照'}`
    : fileName.value
      ? `当前图片来源：本地上传 · ${fileName.value}`
      : '支持 JPG、PNG、WEBP 格式，也可直接调用摄像头拍照'
);
const cameraHint = computed(() => '请将目标物体放在画面中央，拍照后即可识别');
const currentTimeLabel = computed(() => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date());
});

const feedbackOptions: Array<{ value: FeedbackValue; label: string }> = [
  { value: 'useful', label: '有帮助' },
  { value: 'incorrect', label: '没帮助' }
];

async function loadWorkbench() {
  const data = await vqaApi.getWorkbenchData();
  workbench.value = data;
  recentRecords.value = data.recentRecords;
  answer.value = data.featuredAnswer;
  selectedScene.value = data.sampleScenes[0] ?? null;
}

function openFilePicker() {
  fileInput.value?.click();
}

function onFileInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    handleFileChange(file);
  }
  target.value = '';
}

function handleFileChange(file: File) {
  stopCamera();
  fileName.value = file.name;
  imageSource.value = 'upload';
  cameraError.value = '';
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }
  objectUrl = URL.createObjectURL(file);
  previewUrl.value = objectUrl;
}

async function startCamera() {
  cameraError.value = '';
  cameraLoading.value = true;

  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('当前浏览器不支持摄像头调用。');
    }

    stopCamera();
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'environment'
      },
      audio: false
    });

    if (cameraVideo.value) {
      cameraVideo.value.srcObject = cameraStream;
      await cameraVideo.value.play();
    }

    cameraActive.value = true;
  } catch (error) {
    cameraError.value = error instanceof Error ? error.message : '摄像头启动失败，请检查权限。';
    stopCamera();
  } finally {
    cameraLoading.value = false;
  }
}

function stopCamera() {
  cameraActive.value = false;

  if (cameraVideo.value) {
    cameraVideo.value.pause();
    cameraVideo.value.srcObject = null;
  }

  if (cameraStream) {
    for (const track of cameraStream.getTracks()) {
      track.stop();
    }
    cameraStream = null;
  }
}

function capturePhoto() {
  if (!cameraVideo.value || !captureCanvas.value) {
    return;
  }

  const video = cameraVideo.value;
  const canvas = captureCanvas.value;
  const width = video.videoWidth;
  const height = video.videoHeight;

  if (!width || !height) {
    cameraError.value = '摄像头画面尚未准备好，请稍后再试。';
    return;
  }

  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  if (!context) {
    cameraError.value = '无法处理当前拍照结果。';
    return;
  }

  context.drawImage(video, 0, 0, width, height);
  const dataUrl = canvas.toDataURL('image/png');

  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }

  objectUrl = dataUrl;
  previewUrl.value = dataUrl;
  fileName.value = `camera-shot-${Date.now()}.png`;
  imageSource.value = 'camera';
  cameraError.value = '';
  stopCamera();
}

function simulateVoice() {
  question.value = question.value || '这是什么药？有什么作用？';
}

function resetConversation() {
  question.value = '';
  feedback.value = 'useful';
}

async function submitQuestion() {
  if (!question.value.trim()) {
    return;
  }

  submitting.value = true;

  try {
    const result = await vqaApi.submitQuestion({
      question: question.value,
      inputMode: 'text',
      category: 'ocr',
      sampleSceneId: selectedScene.value?.id,
      imageName: fileName.value
    });

    answer.value = result;
    recentRecords.value = [
      {
        id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        imageLabel:
          imageSource.value === 'camera'
            ? '摄像头拍照'
            : selectedScene.value?.imageLabel ?? fileName.value ?? '用户上传图片',
        imageHint:
          imageSource.value === 'camera'
            ? '来自客户端摄像头实时拍照'
            : selectedScene.value?.hint ?? '用户上传场景',
        question: question.value,
        inputMode: 'text',
        category: 'ocr',
        status: result.riskLevel === 'high' ? 'unsafe' : 'answered',
        answer: result,
        diagnostics: selectedScene.value?.diagnostics ?? {
          blurScore: 0.86,
          exposure: 'normal',
          completeness: 'good',
          recommendation: '图像质量良好，可继续提问。',
          tags: ['用户上传']
        },
        feedback: feedback.value,
        userName: '当前用户'
      },
      ...recentRecords.value
    ].slice(0, 4);
  } finally {
    submitting.value = false;
  }
}

async function applyFeedback(value: FeedbackValue) {
  feedback.value = value;
  const latestRecord = recentRecords.value[0];
  if (latestRecord) {
    await vqaApi.submitFeedback(latestRecord.id, value);
  }
}

onMounted(() => {
  void loadWorkbench();
});

onBeforeUnmount(() => {
  stopCamera();
  if (objectUrl && objectUrl.startsWith('blob:')) {
    URL.revokeObjectURL(objectUrl);
  }
});
</script>

<style scoped>
.workbench-page {
  height: 100%;
  min-height: 0;
  overflow: hidden;
  width: 100%;
}

.main-layout {
  display: grid;
  grid-template-columns: 300px minmax(860px, 1fr);
  gap: 18px;
  height: 100%;
  min-height: 0;
  width: 100%;
  align-items: stretch;
}

.input-panel,
.result-panel {
  min-height: 0;
}

.input-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-block {
  display: grid;
  gap: 14px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title.compact {
  margin-top: 4px;
}

.section-title h3 {
  margin: 0;
  font-size: 1rem;
}

.step-badge {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 8px;
  background: #eef3ff;
  color: #3269ff;
  font-size: 0.78rem;
  font-weight: 700;
}

.hidden-input {
  display: none;
}

.hidden-canvas {
  display: none;
}

.capture-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.capture-btn {
  padding: 11px 12px;
  border-radius: 14px;
  border: 1px solid rgba(228, 235, 251, 0.42);
  background: rgba(255, 255, 255, 0.78);
  color: var(--text-main);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.capture-btn.primary {
  background: linear-gradient(135deg, var(--brand-strong), var(--brand-soft));
  border: none;
  color: white;
}

.upload-box {
  min-height: 180px;
  border-radius: 16px;
  border: 1px dashed rgba(212, 222, 247, 0.7);
  background: linear-gradient(180deg, rgba(250, 252, 255, 0.92), rgba(245, 248, 255, 0.76));
  overflow: hidden;
}

.upload-box-button {
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 180px;
  padding: 22px;
  border: none;
  background: transparent;
  text-align: center;
  color: var(--text-main);
  cursor: pointer;
}

.upload-box.camera-mode {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  min-height: 220px;
  background: #0f172a;
  border-style: solid;
}

.camera-video {
  width: 100%;
  height: 100%;
  min-height: 168px;
  object-fit: cover;
  background: #0f172a;
}

.camera-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  background: rgba(15, 23, 42, 0.9);
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.84rem;
}

.camera-buttons {
  display: flex;
  gap: 8px;
}

.camera-btn {
  flex: none;
  min-width: 88px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.15);
}

.upload-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  margin-bottom: 12px;
  border-radius: 18px;
  background: #eef3ff;
  color: #3269ff;
  font-size: 1.8rem;
}

.upload-box strong {
  font-size: 0.96rem;
}

.upload-box p,
.privacy-copy,
.answer-copy,
.advice-card p,
.warning-copy {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.6;
}

.question-box {
  width: 100%;
  padding: 14px 15px;
  border-radius: 14px;
  border: 1px solid rgba(228, 235, 251, 0.42);
  background: rgba(248, 251, 255, 0.84);
  resize: none;
  font: inherit;
  color: var(--text-main);
}

.minor-actions,
.feedback-row {
  display: flex;
  gap: 10px;
}

.minor-btn,
.feedback-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(228, 235, 251, 0.42);
  background: rgba(255, 255, 255, 0.76);
  color: var(--text-main);
  cursor: pointer;
}

.feedback-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.feedback-icon {
  display: inline-flex;
  width: 18px;
  height: 18px;
}

.feedback-icon svg {
  width: 100%;
  height: 100%;
}

.action-btn {
  justify-content: center;
}

.privacy-copy {
  font-size: 0.84rem;
}

.camera-error {
  margin: -2px 0 0;
  color: #e24a4a;
  font-size: 0.84rem;
}

.result-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 16px;
  width: 100%;
}

.result-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
}

.header-time {
  color: var(--text-subtle);
  font-size: 0.82rem;
}

.result-content {
  display: grid;
  grid-template-columns: 0.92fr 1.08fr;
  gap: 20px;
  min-height: 0;
  width: 100%;
}

.image-column,
.info-column {
  min-width: 0;
}

.meta-label {
  display: inline-block;
  margin-bottom: 10px;
  color: var(--text-subtle);
  font-size: 0.84rem;
}

.preview-stage {
  position: relative;
  height: calc(100% - 28px);
  min-height: 320px;
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(180deg, #e7d6c4 0%, #c69d72 100%);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mock-scene {
  width: 100%;
  height: 100%;
  position: relative;
}

.medicine-box {
  position: absolute;
  inset: 38px 34px 34px;
}

.medicine-side {
  position: absolute;
  left: 16px;
  top: 30px;
  bottom: 64px;
  width: 46px;
  border-radius: 10px 0 0 10px;
  background: linear-gradient(180deg, #0f6f4b, #09482f);
}

.medicine-front {
  position: absolute;
  left: 46px;
  right: 24px;
  top: 8px;
  bottom: 66px;
  padding: 24px 22px 20px;
  border-radius: 8px 16px 16px 8px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0 60%, rgba(16, 119, 80, 0.88) 60% 100%);
  box-shadow: 0 14px 24px rgba(54, 33, 12, 0.16);
}

.medicine-front h4 {
  margin: 18px 0 8px;
  font-size: 2rem;
  color: #121212;
}

.medicine-front p {
  margin: 0;
  font-size: 1.12rem;
  color: #222;
}

.otc-mark {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #ea4545;
  color: white;
  font-size: 0.78rem;
  font-weight: 700;
}

.capsule-illustration {
  position: absolute;
  right: 34px;
  bottom: 28px;
  width: 92px;
  height: 36px;
  border-radius: 999px;
  transform: rotate(-35deg);
  background: linear-gradient(90deg, white 0 50%, #f0c84f 50% 100%);
}

.pill-strip {
  position: absolute;
  right: 10px;
  bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  width: 220px;
  padding: 14px;
  border-radius: 14px;
  background: linear-gradient(180deg, #d9d9d9, #bdbdbd);
  transform: perspective(300px) rotateX(20deg) rotateZ(-12deg);
}

.pill {
  width: 30px;
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(90deg, white 0 50%, #1ea26d 50% 100%);
}

.info-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: flex-start;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.title-row h2 {
  margin: 0;
  color: #0f5de0;
  font-size: 2rem;
  line-height: 1.2;
}

.type-pill {
  padding: 6px 10px;
  border-radius: 999px;
  background: #e8fbf4;
  color: #16a34a;
  font-size: 0.8rem;
  font-weight: 700;
}

.progress-card {
  display: grid;
  gap: 8px;
}

.progress-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-main);
}

.progress-track {
  height: 10px;
  border-radius: 999px;
  background: #e5edff;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2563eb, #3269ff);
}

.advice-card {
  padding: 14px 16px;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(248, 251, 255, 0.88), rgba(243, 248, 255, 0.72));
  border: 1px solid rgba(232, 238, 252, 0.52);
}

.advice-card strong {
  display: block;
  margin-bottom: 8px;
}

.result-footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding-top: 6px;
  border-top: 1px solid rgba(237, 242, 253, 0.65);
}

.warning-copy {
  color: #eb8f3a;
  font-size: 0.84rem;
}

.feedback-btn.active {
  background: #eef3ff;
  color: #3269ff;
  border-color: rgba(50, 105, 255, 0.24);
}

@media (max-width: 980px) {
  .main-layout,
  .result-content,
  .result-footer {
    grid-template-columns: 1fr;
    display: grid;
  }
}
</style>
