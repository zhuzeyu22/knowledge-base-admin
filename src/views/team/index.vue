<template>
  <el-container class="content-container">
    <el-header class="header-style">
      <div>{{ teamName || '团队知识库' }}</div>
      <div class="search-wrapper-expend" :class="[isExpend ? 'isMore' : '']">
        <div class="input-x">
          <el-input placeholder="搜索" v-model="search" class="search-style-expend" clearable @input="handleSearchChange"
                    :prefix-icon="Search">
            <template #suffix>
              <img src="@/assets/search/more.png" class="can-click" width="14" alt=""
                   @click.stop="isExpend = !isExpend" />
            </template>
          </el-input>
        </div>
        <div class="more" v-show="isExpend">
          <el-input v-model="createdByName" placeholder="创建人" clearable @input="handleSearchChange">
            <template #prefix>
              <img src="@/assets/search/user.png" class="can-click" width="14" alt="" />
            </template>
          </el-input>
          <el-select v-model="time" clearable placeholder="创建时间" @change="handleSearchChange">
            <el-option v-for="item in dateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
            <template #prefix>
              <img src="@/assets/search/user.png" class="can-click" width="14" alt="" />
            </template>
          </el-select>
        </div>
      </div>
    </el-header>
    <el-main v-infinite-scroll="load" :infinite-scroll-disabled="loading" :infinite-scroll-distance="10"
      class="context-style" style="overflow: auto" v-loading="loading" element-loading-text="数据加载中...">
      <div class="number">共 {{ datasetList.length }} 个知识库</div>
      <el-space wrap :size="16" class="grid-container">
        <CreateCard v-if='showCreate' @create='handleCreate' />
        <KnowledgeTeamCard v-for="item in datasetList" :key="item.id" :dataset="item" :tenant-id="tenantId"
          @delete='reload' />
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

const isExpend = ref(false)

const createdByName = ref('')
const time = ref('')

// created_by_name：“张三”，
// time:"week/month/half_year/one_yaer"
const dateOptions = [
  { label: '不限', value: '' },
  { label: '7天内', value: 'week' },
  { label: '30天内', value: 'month' },
  { label: '半年内', value: 'half_year' },
  { label: '1年内', value: 'one_yaer' },
]

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
    limit.value,
    false,
    search.value,
    isExpend.value ? createdByName.value : '',
    isExpend.value ? time.value : '',
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
  const teamPermission = await getTeamPermission(newId, newTenantId as string)
  showCreate.value = teamPermission?.data?.is_created || false
}, {
  immediate: true
});

const handleSearchChange = () => {
  // 搜索逻辑待实现
  reload()
}

const handleCreate = () => {
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
  background: transparent;
  font-size: 20px;
  position: relative;
}


.search-wrapper-expend {
  position: absolute;
  transform: translate(-50%);
  left: 50%;
  width: 300px;
  //height: 40px;
  display: flex;
  padding: 5px;
  flex-direction: column;
  background-color: transparent;
  z-index: 100;
  &.isMore{
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    .search-style-expend{
      height: 20px;
    }
  }

  .input-x {
    position: relative;
    z-index: 101;
    .search-style-expend {
      height: 40px;
      :deep(.el-input__wrapper) {
        border-radius: 20px;
      }
    }
  }

  .more {
    position: absolute;
    left: 0;
    border: 10px solid #fff;
    border-bottom: 5px solid #fff;
    border-top: 5px solid #fff;
    border-radius: 0 0 20px 20px;
    bottom: -40px;
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    //padding: 12px;
    //border-top: 1px solid #e4e7ed;
    //background-color: #fff;
    //border-radius: 0 0 20px 20px;

    :deep(.el-input__wrapper),
    :deep(.el-select__wrapper) {
      border-radius: 20px;
    }
  }
}
.context-style {
  padding: 20px;
  height: 100%;
}

.number {
  font-size: 14px;
  margin-bottom: 10px;
  color: #4C5464;
}
</style>
