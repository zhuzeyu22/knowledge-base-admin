<template>
  <el-container class="content-container">
    <el-header class="header-style">
      <div>公共知识库</div>
      <!-- <el-input placeholder="请输入内容" v-model="search" class="search-style" clearable @input="handleSearchChange" /> -->
    </el-header>
    <!-- <el-main v-infinite-scroll="load" :infinite-scroll-disabled="loading" :infinite-scroll-distance="10"
      class="context-style" style="overflow: auto"> -->
    <el-main class="context-style" style="overflow: auto" v-loading="loading" element-loading-text="加载中...">
      <el-space wrap :size="16" class="grid-container">
        <KnowledgePublicCard v-for="item in datasetList" :key="item.id" :dataset="item" :folderId ="folderId" :folderNames ="folderNames" @status-updated="handleStatusUpdated"/>
        <DirectoryCard v-for="item in publicFolderList" :key="item.id" :dirList="item" />
      </el-space>
      <div class="no-content" v-if="!loading && datasetList.length === 0 && publicFolderList.length === 0 ">
        <img src="@\assets\no-content.png" alt="">
        <span class="text">暂无内容</span>
      </div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { PublicDataset } from '@/models/dataset'
import DirectoryCard from '@/components/DirectoryCard.vue'
import KnowledgePublicCard from '@/components/KnowledgePublicCard.vue'
import { usePublicStore } from '@/store/public'
import { computed, ref, watch } from 'vue'
import _ from 'lodash'
import { getDatasetsByFolderId, getFolder } from '@/service/public'
import { PublicFolderNode } from '@/models/public'

const publicStore = usePublicStore()
// 根据 currentNode level 切换展示列表
const currentNode = computed(() => publicStore.getCurrentNode)
// const getCurrentNodeNumber = computed(() => publicStore.getCurrentNodeNumber)
// 知识库列表
const loading = ref(false)
const datasetList = ref<PublicDataset[]>([])
const dirList = computed(() => currentNode.value?.children || [])
const folderId = computed(() => [currentNode.value?.id])
const folderNames = computed(() =>[currentNode.value?.name])
// 目录列表
const publicFolderList = computed<PublicFolderNode[]>(() => publicStore.currentNode?.children || publicStore.getPublicTree)

watch(
  () => currentNode.value, 
  async (newValue) => {
  loading.value = true;
  datasetList.value=[]
  const id = newValue.id
  const res = await getFolder(id).catch((err) => {
      console.log(err);
    });
    if(res.data && res.data.length > 0 ){
      dirList.value = res.data
      loading.value = false
    } else {
      load(id)
    }
})

const load = _.debounce((folderId: string) => {
  getDatasetsByFolderId(folderId).then((res) => {
    datasetList.value = res.data
  })
  .finally(() => {
      loading.value = false
    })
}, 500)

const handleStatusUpdated = () => {
  if(currentNode.value?.id) {
    load(currentNode.value.id)
  }
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
.no-content {
  display: flex;
  justify-content: center; 
  align-items: center;
  margin-top: 15%;
  flex-direction: column;
  .text {
    font-size: 16px;
    line-height: 22px;
  }
}
</style>