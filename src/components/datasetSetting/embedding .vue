<template>
  <div class="title">Embedding 模型</div>
  <el-input v-model="embedding_model" disabled></el-input>
</template>

<script setup lang="ts">
const embedding_model = defineModel('embedding_model');
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}
</style>
