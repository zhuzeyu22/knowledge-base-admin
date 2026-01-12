<template>
  <el-container class="content-container">
    <el-header class="header-style">
      <div>团队知识库</div>
      <el-input placeholder="请输入内容" v-model="search" class="search-style" clearable @input="handleSearchChange" />
    </el-header>
    <el-main v-infinite-scroll="load" :infinite-scroll-disabled="loading" :infinite-scroll-distance="10"
      class="context-style" style="overflow: auto" v-loading="loading" element-loading-text="数据加载中...">
      <el-space wrap :size="16" class="grid-container">
        <CreateCard v-if='tenantId' @create='handleCreate'/>
        <KnowledgeTeamCard v-for="item in datasetList" :key="item.id" :dataset="item" />
      </el-space>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import router from "@/router";
import CreateCard from '@/components/createCard/index.vue';
import { ref, onMounted, computed, watch } from 'vue'
import { TeamDataset } from '@/models/dataset'
import { getPublicDatasetList } from '@/service/datasets'
import KnowledgeTeamCard from '@/components/KnowledgeTeamCard.vue'
import { useTeamStore } from "@/store/team";
const datasetList = ref<TeamDataset[]>([])
const search = ref('')
// const filterDataList = ref<Dataset[]>([])
const page = ref(1)
const limit = ref(50)
const loading = ref(false)
const total = ref(1)

const tenantId = computed(() => router.currentRoute.value.params.teamId);
const teamStore = useTeamStore()
const showCreate = computed(() => teamStore.getCurrentTeam);

watch(tenantId, () => {
  console.log('tenantId', tenantId);
  if (!tenantId.value) {
    total.value = 0
    datasetList.value = []
    return;
  }
  reload()
});


const handleSearchChange = () => {
  // 搜索逻辑待实现
}

const getTotal = async () => {
  await getPublicDatasetList(page.value, limit.value).then((res) => {
    total.value = res.total
  })
}
onMounted(() => {
  getTotal().then(() => {
    load()
  })
})

const load = () => {
  if (datasetList.value.length >= total.value) {
    return
  }
  loading.value = true
  getPublicDatasetList(
    page.value,
    limit.value
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

const handleCreate = ()=>{
    router.push(`/team/${tenantId.value}/create`)
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

.grid-container {
  display: grid;
  /* 关键：自适应列数 */
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  /* 列与列、行与行之间的间距 */
}
</style>