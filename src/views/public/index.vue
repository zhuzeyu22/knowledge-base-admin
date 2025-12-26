<template>
  <el-container class="content-container">
    <el-header class="header-style">
      <div>公共知识库</div>
      <el-input placeholder="请输入内容" v-model="search" class="search-style" clearable @input="handleSearchChange" />
    </el-header>
    <el-main v-infinite-scroll="load" :infinite-scroll-disabled="loading" :infinite-scroll-distance="10"
      class="context-style" style="overflow: auto">
      <el-space wrap :size="16">
        <!-- <KnowledgeBaseCard 
          v-for="item in datasetList" 
          :key="item.id" 
          :dataset="item" 
        /> -->
      </el-space>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { Dataset } from '@/models/dataset'
import { ref } from 'vue'


const datasetList = ref<Dataset[]>([])
const search = ref('')
// const filterDataList = ref<Dataset[]>([])
const page = ref(1)
const limit = ref(50)
const loading = ref(false)
const total = ref(1)

const handleSearchChange = () => {
  console.log('Search changed:', search.value)
}

const load = () => {

}
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
  background-color: #f5f5f5;
}

.search-style {
  width: 300px;
}

.context-style {
  padding: 20px;
  height: 100%;
}
</style>