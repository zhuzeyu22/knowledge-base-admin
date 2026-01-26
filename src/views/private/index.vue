<template>
    <el-container class="content-container">
        <el-header class="header-style">
            <div>个人知识库</div>
            <el-input placeholder="请输入内容" v-model="search" class="search-style" clearable @input="handleSearchChange" :prefix-icon="Search"/>
        </el-header>
        <el-main v-infinite-scroll="load" :infinite-scroll-disabled="loading" :infinite-scroll-distance="10"
            class="context-style" style="overflow: auto" v-loading="loading" element-loading-text="数据加载中...">
            <el-space wrap :size="16" class="grid-container">
                <CreateCard @create='handleCreate'/>
                <KnowledgeBaseCard v-for="item in datasetList" :key="item.id" :dataset="item" @delete='reload' />
            </el-space>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import router from '@/router'
import { onMounted, ref } from 'vue'
import KnowledgeBaseCard from '@/components/KnowledgeBaseCard.vue'
import { Dataset } from '@/models/dataset';
import CreateCard from './components/createCard.vue';
import { getPrivateDatasetList } from '@/service/datasets';
import { Search } from '@element-plus/icons-vue';
const datasetList = ref<Dataset[]>([])
const search = ref('')
// const filterDataList = ref<Dataset[]>([])
const page = ref(1)
const limit = ref(50)
const loading = ref(false)
const total = ref(1)

const handleSearchChange = () => {
    console.log('Search changed:', search.value)
    reload()
}

const getTotal = async () => {
    await getPrivateDatasetList(
        page.value,
        limit.value,
        search.value,
    ).then((res) => {
        total.value = res.total
    })
}

onMounted(() => {
    getTotal()
})

const load = () => {
    if (datasetList.value.length >= total.value) {
        return
    }
    loading.value = true
    getPrivateDatasetList(
        page.value,
        limit.value,
        search.value,
    ).then((res) => {
        datasetList.value.push(...res.data)
        total.value = res.total
        page.value++
        loading.value = false
    }).catch(err => {
        console.log(err)
    })
}

const reload = () => {
    datasetList.value = []
    page.value = 1
    total.value = 1
    load()
}

load()

const handleCreate = ()=>{
    router.push({ name: 'create' })
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