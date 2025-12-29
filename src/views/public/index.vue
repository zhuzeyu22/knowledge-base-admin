<template>
  <el-container class="content-container">
    <el-header class="header-style">
      <div>公共知识库</div>
      <el-input placeholder="请输入内容" v-model="search" class="search-style" clearable @input="handleSearchChange" />
    </el-header>
    <!-- <el-main v-infinite-scroll="load" :infinite-scroll-disabled="loading" :infinite-scroll-distance="10"
      class="context-style" style="overflow: auto"> -->
    <el-main :loading="loading" class="context-style" style="overflow: auto">
      <el-space wrap :size="16" class="grid-container">
        <KnowledgePublicCard v-for="item in datasetMockList" :key="item.id" :dataset="item" />
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
const currentNode = computed(() => publicStore.currentNode)

// 知识库列表
const datasetList = ref<Dataset[]>([])
// 目录列表
const publicFolderList = computed(() => publicStore.currentNode?.children || publicStore.getPublicTree)

// const search = ref('')
// const page = ref(1)
// const limit = ref(50)
// const loading = ref(false)
// const total = ref(1)

const datasetMockList = [
  {
    id: "model_001",
    name: "通用文档检索模型V1",
    official: "official",
    imageUrl: "",
    description: "官方出品的通用文档检索模型，适配各类文本格式，支持中英文混合检索，准确率达95%以上",
    documentNumber: 15890,
    characterNumber: 89765432,
    retrieval_model_dict: {
      "text-embedding-ada-002": {
        modelName: "OpenAI 文本嵌入模型",
        similarity: 0.92,
        enable: true
      },
      "bge-large-zh": {
        modelName: "中文大模型嵌入",
        similarity: 0.89,
        enable: true
      }
    }
  },
  {
    id: "model_002",
    name: "行业定制法律检索模型",
    official: "unofficial",
    imageUrl: "",
    description: "第三方开发的法律文档专用检索模型，针对法律条文、判例等专业文本做了优化，支持法条关联检索",
    documentNumber: 3450,
    characterNumber: 12890765,
    retrieval_model_dict: {
      "law-embedding-v2": {
        modelName: "法律专用嵌入模型",
        similarity: 0.95,
        enable: true
      },
      "text-embedding-3-small": {
        modelName: "轻量级文本嵌入",
        similarity: 0.85,
        enable: false
      }
    }
  },
  {
    id: "model_003",
    name: "医疗文献检索模型Beta",
    official: "official",
    imageUrl: "",
    description: "官方测试版医疗文献检索模型，覆盖中英文医疗期刊、病例报告等，持续优化中",
    documentNumber: 876,
    characterNumber: 5678901,
    retrieval_model_dict: {
      "medical-bert-embedding": {
        modelName: "医疗BERT嵌入模型",
        similarity: 0.90,
        enable: true
      }
    }
  }
]

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

.grid-container {
  display: grid;
  /* 关键：自适应列数 */
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  /* 列与列、行与行之间的间距 */
}
</style>