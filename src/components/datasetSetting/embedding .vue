<template>
  <div class="title">Embedding 模型</div>
  <el-input v-model="embedding_model" disabled></el-input>
</template>

<script setup lang="ts">
const embedding_model = defineModel('embedding_model');
</script>
