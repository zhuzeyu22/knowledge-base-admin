<template>
  <BaseCard name="QA分段" color="#FFFCF6FF" :visiable="visiable" description="使用QA分段处理文档" :disabled="disabled"
    @selected="handleSelected">
    <template #icon>
      <img src="@/assets/dataset-setting/qa-model.png" width="20" alt="" />
    </template>
    <template v-if="visiable" #content>
      <div class="context">
        <el-row>
          <el-button class="preview-btn" size="default"  @click="handlePreviewClick">
            <img src="@/assets/dataset-setting/preview.png" width="14" height="14" class="btn-icon" />
            预览</el-button>
        </el-row>
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './baseCard.vue';

const emit = defineEmits(["selected", "preview", "reset"]);

const { disabled, visiable } = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  visiable: {
    type: Boolean,
    required: false,
    default: () => true,
  },
});

const handleSelected = () => {
  emit("selected");
}

const handlePreviewClick = () => {
  emit("preview");
}

const handleResetClick = () => {
  emit("reset");
}
</script>

<style scoped lang="less">
.section {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 0;
}

.context {
  padding: 12px 16px;
}

.segmentation {
  margin-bottom: 10px;
}
.preview-btn {
  background-color: #ffffff;
  color: var(--el-color-primary);
  padding: 4px 6px;
  border-radius: 4px;
  &:hover {
    background-color: rgba(81, 105, 240, 0.1);
  }
}
.btn-icon {
  margin-right: 4px;
  vertical-align: middle;
}
</style>
