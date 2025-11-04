<template>
  <div class="title">索引方式</div>
  <el-collapse
    v-model="indexing_technique"
    accordion
    disabled
  >
    <el-collapse-item title="高质量" name="high_quality"> </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
const indexing_technique = defineModel('indexing_technique');
</script>
