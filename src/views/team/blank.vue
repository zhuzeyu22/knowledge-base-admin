<template>
  <el-container class="content-container">
    <el-header class="header-style">
      <div>团队知识库</div>
      <el-input placeholder="请输入内容" class="search-style" clearable  :prefix-icon="Search"/>
    </el-header>
    <el-main :infinite-scroll-distance="10"
      class="context-style" style="overflow: auto" element-loading-text="数据加载中...">
      <el-space wrap :size="16" class="grid-container">
      </el-space>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
</script>
<style scoped lang="scss">
.content-container {
  width: 100%;
  height: 100%;
}

.header-style {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: transparent;
  font-size: 20px;
}

.search-style {
  margin: 0 auto;
  width: 300px;
  height: 40px;
  border-radius: 25px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  :deep(.el-input__wrapper) {
    border-radius: 25px;
  }
}

.context-style {
  padding: 20px;
  height: 100%;
}

.grid-container {
  display: grid;
  /* 关键：自适应列数 */
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  /* 列与列、行与行之间的间距 */
}
</style>