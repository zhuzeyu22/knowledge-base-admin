<template>
  <el-card class="card-container" shadow="hover" @click="handleCardClick">
    <div class="knowledge-base-card">
      <div class="knowledge-base-card-background"></div>
      <div class="knowledge-base-card-name" :title="folderData.name">{{ folderData.name }}</div>
      <div class="knowledge-base-card-operate" @click.stop>
        <el-dropdown trigger="click" placement="bottom-end">
          <el-icon style="cursor: pointer; padding: 5px;">
            <Operation />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$emit('update', folderData)">修改</el-dropdown-item>
              <el-dropdown-item @click="$emit('delete', folderData)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  folderData: {
    type: Object,
    required: true,
    default: () => ({ id: '', name: '' })
  }
});

const emit = defineEmits(['enter-folder','update', 'delete']);

const handleCardClick = () => {
  emit('enter-folder', props.folderData)
}

</script>

<style scoped>
.card-container {
    cursor: pointer; 
}
.knowledge-base-card {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex-shrink: 0;
  height: 200px;
  flex-grow: 1;
  align-items: center;
}
.knowledge-base-card-background {
  background-image: url("@/assets/know-directory-icon.png");
  width: 80px;
  height: 60px;
  margin: 40px 0;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
}
.knowledge-base-card-name {
  font-size: 18px;
}
.knowledge-base-card-operate {
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>
