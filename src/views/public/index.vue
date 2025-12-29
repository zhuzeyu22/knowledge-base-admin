<template>
  <el-container class="content-container">
    <el-header class="header-style">
      <div>公共知识库</div>
      <el-input placeholder="请输入内容" v-model="search" class="search-style" clearable @input="handleSearchChange" />
    </el-header>
    <!-- <el-main v-infinite-scroll="load" :infinite-scroll-disabled="loading" :infinite-scroll-distance="10"
      class="context-style" style="overflow: auto"> -->
    <el-main :loading="loading" class="context-style" style="overflow: auto">
      <el-space wrap :size="16">
        <KnowledgeBaseCard v-for="item in datasetList" :key="item.id" :dataset="item" />
      </el-space>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { Dataset } from '@/models/dataset'
import { usePublicStore } from '@/store/public'
import { computed, ref, watch } from 'vue'
import _ from 'lodash'
import { getDatasetsByFolderId } from '@/service/public'

const publicStore = usePublicStore()
const currentNode = computed(() => publicStore.currentNode)

const datasetList = ref<Dataset[]>([])
const search = ref('')
const page = ref(1)
const limit = ref(50)
const loading = ref(false)
const total = ref(1)

watch(() => currentNode.value, (newValue) => {
  console.log('currentNode changed:', newValue)
  load(newValue?.id || '')
})

// 下一版本加
// watch(() => search.value, (newValue) => {
//   console.log('search changed:', newValue)
// })

const handleSearchChange = () => {
  console.log('Search changed:', search.value)
}

const load = _.debounce((folderId: string) => {
  loading.value = true
  getDatasetsByFolderId(folderId).finally(() => {
    loading.value = false
  })
}, 500)
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