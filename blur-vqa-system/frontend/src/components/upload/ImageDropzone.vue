<template>
  <section class="panel dropzone-card">
    <div class="card-head">
      <div>
        <p class="eyebrow">图像输入</p>
        <h3>上传图片或选择演示场景</h3>
      </div>
      <button class="secondary-btn" type="button" @click="openFilePicker">选择文件</button>
    </div>

    <input
      ref="fileInput"
      class="hidden-input"
      type="file"
      accept="image/*"
      @change="handleFileChange"
    />

    <div class="dropzone" @dragover.prevent @drop.prevent="handleDrop">
      <div v-if="previewUrl" class="preview">
        <img :src="previewUrl" alt="预览图片" />
      </div>
      <div v-else class="placeholder">
        <div class="placeholder-art"></div>
        <strong>拖拽图片到这里，或点击右上角上传</strong>
        <p>支持本地图片上传，后端接入后可扩展摄像头拍照与实时图像增强。</p>
      </div>
    </div>

    <p v-if="fileName" class="file-name">当前图片：{{ fileName }}</p>

    <div v-if="diagnostics" class="diagnostic-grid">
      <div>
        <span>清晰度</span>
        <strong>{{ Math.round(diagnostics.blurScore * 100) }} / 100</strong>
      </div>
      <div>
        <span>曝光</span>
        <strong>{{ diagnostics.exposure === 'dim' ? '偏暗' : diagnostics.exposure === 'bright' ? '偏亮' : '正常' }}</strong>
      </div>
      <div>
        <span>主体完整度</span>
        <strong>{{ diagnostics.completeness === 'good' ? '完整' : '局部裁切' }}</strong>
      </div>
    </div>

    <p v-if="diagnostics" class="helper-copy">{{ diagnostics.recommendation }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ImageDiagnostic } from '@/types';

const props = defineProps<{
  previewUrl?: string;
  fileName?: string;
  diagnostics?: ImageDiagnostic | null;
}>();

const emit = defineEmits<{
  (event: 'file-change', file: File): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

function openFilePicker() {
  fileInput.value?.click();
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    emit('file-change', file);
  }

  target.value = '';
}

function handleDrop(event: DragEvent) {
  const file = event.dataTransfer?.files?.[0];

  if (file) {
    emit('file-change', file);
  }
}
</script>

<style scoped>
.dropzone-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.card-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.card-head h3 {
  margin: 4px 0 0;
}

.hidden-input {
  display: none;
}

.dropzone {
  min-height: 300px;
  border-radius: 28px;
  border: 1px dashed rgba(26, 87, 82, 0.24);
  background:
    radial-gradient(circle at top left, rgba(245, 163, 94, 0.18), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(244, 247, 245, 0.72));
  overflow: hidden;
}

.preview,
.preview img {
  width: 100%;
  height: 100%;
}

.preview img {
  min-height: 300px;
  object-fit: cover;
}

.placeholder {
  min-height: 300px;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 28px;
}

.placeholder-art {
  width: 120px;
  height: 120px;
  border-radius: 28px;
  margin-bottom: 18px;
  background:
    linear-gradient(135deg, rgba(26, 87, 82, 0.22), rgba(245, 163, 94, 0.34)),
    linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(244, 247, 245, 0.9));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.file-name {
  margin: -2px 0 0;
  color: var(--text-muted);
}

.diagnostic-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.diagnostic-grid div {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 252, 247, 0.94);
}

.diagnostic-grid span {
  display: block;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.helper-copy {
  margin: 0;
  color: var(--text-muted);
}

@media (max-width: 720px) {
  .diagnostic-grid {
    grid-template-columns: 1fr;
  }

  .card-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
