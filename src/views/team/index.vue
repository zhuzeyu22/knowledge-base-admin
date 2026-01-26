<template>
  <el-container class="content-container">
    <el-header class="header-style">
      <div>{{teamName || '团队知识库'}}</div>
      <el-input placeholder="搜索" v-model="search" class="search-style" clearable @input="handleSearchChange" :prefix-icon="Search"/>
    </el-header>
    <el-main v-infinite-scroll="load" :infinite-scroll-disabled="loading" :infinite-scroll-distance="10"
      class="context-style" style="overflow: auto" v-loading="loading" element-loading-text="数据加载中...">
      <el-space wrap :size="16" class="grid-container">
        <CreateCard v-if='showCreate' @create='handleCreate'/>
        <KnowledgeTeamCard v-for="item in datasetList" :key="item.id" :dataset="item" :tenant-id="tenantId" @delete='reload'/>
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
import { getTeamInfo, getTeamPermission } from "@/service/team";
import { useUserStore } from "@/store/user";
import { Search } from '@element-plus/icons-vue';
const teamName = ref('')

const datasetList = ref<TeamDataset[]>([])
const search = ref('')
// const filterDataList = ref<Dataset[]>([])
const page = ref(1)
const limit = ref(50)
const loading = ref(true)
const total = ref(1)

const tenantId = computed(() => router.currentRoute.value.params.teamId);
const userStore = useUserStore()
const id = computed(() => userStore?.getUserInfo?.id)

const showCreate = ref(false)

const reload = () => {
  datasetList.value = []
  page.value = 1
  total.value = 1
  load()
}

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

watch([tenantId, id], async ([newTenantId, newId]) => {
  console.log('tenantId', tenantId);
  if (!newTenantId || !newId) {
    total.value = 0
    datasetList.value = []
    return;
  }

  // 更新数据
  reload()
}, {
  immediate: true
});

watch([tenantId, id], async ([newTenantId, newId]) => {
  console.log('tenantId', tenantId);
  if (!newTenantId || !newId) {
    teamName.value = ''
    showCreate.value = false
    return;
  }

  // 更新名字
  const teamInfo = await getTeamInfo(newTenantId as string)
  teamName.value = teamInfo.data.name

  // 更新权限
  const teamPermission = await getTeamPermission( newId, newTenantId as string)
  showCreate.value = teamPermission?.data?.is_created || false
}, {
  immediate: true
});

const handleSearchChange = () => {
  // 搜索逻辑待实现
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
</style>