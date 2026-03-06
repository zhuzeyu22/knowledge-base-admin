<template>
  <div class="file-info" @click="handleClick">
    <img 
      :src="iconPath" 
      width="20" 
      alt="" 
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  file: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click', props.file.id);
};

const iconPath = computed(() => {
  const ext = props.file.data_source_detail_dict.upload_file.extension;

  // 定义特殊情况的映射关系
  // 后缀名和图片名不一样（md -> markdown.png
  const specialIcons = {
    'md': 'markdown', 
    'markdown': 'markdown' 
  };

  const iconName = specialIcons[ext] || ext;

  // 使用 Vite 的 new URL 方式动态引用图片
  return new URL(`/src/assets/dataset-setting/file-icon/${iconName}.png`, import.meta.url).href;
});
</script>

<style scoped>
.file-info {
  display: inline;
  vertical-align: middle;
  cursor: pointer;
  margin-right: 4px;
}
</style>