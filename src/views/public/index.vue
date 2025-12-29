<template>
  <el-container class="content-container">
    <el-header class="header-style">
      <div>公共知识库</div>
      <!-- <el-input placeholder="请输入内容" v-model="search" class="search-style" clearable @input="handleSearchChange" /> -->
    </el-header>
    <!-- <el-main v-infinite-scroll="load" :infinite-scroll-disabled="loading" :infinite-scroll-distance="10"
      class="context-style" style="overflow: auto"> -->
    <el-main class="context-style" style="overflow: auto">
      <el-space wrap :size="16" class="grid-container">
        <KnowledgePublicCard v-for="item in datasetList" :key="item.id" :dataset="item" />
        <DirectoryCard />
      </el-space>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { Dataset } from '@/models/dataset'
import DirectoryCard from '@/components/DirectoryCard.vue'
import KnowledgePublicCard from '@/components/KnowledgePublicCard.vue'
import { usePublicStore } from '@/store/public'
import { computed, ref, watch } from 'vue'
import _ from 'lodash'
import { getDatasetsByFolderId } from '@/service/public'
import { PublicFolderNode } from '@/models/public'

const publicStore = usePublicStore()
// 根据 currentNode level 切换展示列表
const currentNode = computed(() => publicStore.currentNode)
// 知识库列表
const datasetList = ref<Dataset[]>([])
// 目录列表
const publicFolderList = computed<PublicFolderNode[]>(() => publicStore.currentNode?.children || publicStore.getPublicTree)

// const search = ref('')
// const page = ref(1)
// const limit = ref(50)
// const loading = ref(false)
// const total = ref(1)

watch(() => currentNode.value, (newValue) => {
  console.log('currentNode changed:', newValue)
  load(newValue?.id || '')
})

// 下一版本加
// watch(() => search.value, (newValue) => {
//   console.log('search changed:', newValue)
// })

// const handleSearchChange = () => {
//   console.log('Search changed:', search.value)
// }

const load = _.debounce((folderId: string) => {
  getDatasetsByFolderId(folderId).then((res) => {
    datasetList.value = res.data.data
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

.grid-container {
  display: grid;
  /* 关键：自适应列数 */
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  /* 列与列、行与行之间的间距 */
}
</style>