<template>
    <el-container class="content-container">
        <el-header class="header-style">
            <div>个人知识库</div>
            <el-input placeholder="请输入内容" v-model="search" class="search-style" clearable @input="handleSearchChange" />
        </el-header>
        <el-main v-infinite-scroll="load" :infinite-scroll-disabled="loading" :infinite-scroll-distance="10"
            class="context-style" style="overflow: auto">
            <!-- <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
                <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
            </ul> -->
            <el-space wrap :size="16">
                <CreateCard />
                <KnowledgeBaseCard v-for="item in datasetList" :key="item.id" :dataset="item" />
            </el-space>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeBaseCard from './components/KnowledgeBaseCard.vue'
import { getKnowledgeBaseList } from '@/service/datasets';
import { Dataset } from '@/models/dataset';
import CreateCard from './components/createCard.vue';

const datasetList = ref<Dataset[]>([])
const search = ref('')
// const filterDataList = ref<Dataset[]>([])
const page = ref(1)
const limit = ref(50)
const loading = ref(false)
const handleSearchChange = () => {
    console.log('Search changed:', search.value)
}

const load = () => {
    loading.value = true
    // getKnowledgeBaseList({
    //     page: page.value,
    //     limit: limit.value,
    //     include_all: true
    // }).finally(() => {
        datasetList.value.push(... new Array(50).fill(0).map((_, index) => ({
            id: String(index + 1),
            name: `知识库${index + 1}`,
            isOfficial: Boolean(index % 2 === 0),
            imageUrl: 'https://www.baidu.com',
            description: '这是一个个人知识库',
            documentNumber: 10,
            characterNumber: 3211,
        })))
        loading.value = false
    // })
}

load()

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