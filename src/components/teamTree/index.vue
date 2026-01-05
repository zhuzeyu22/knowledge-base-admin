<template>
    <section class="section">
        <el-tree :data="teamList" node-key="id" v-infinite-scroll="load" :infinite-scroll-disabled="loading"
            :infinite-scroll-distance="10">
            <template #default="{ node, data }">
                <span class="custom-tree-node hover-container" @click.stop="handleTeamClick(data)">
                    <div class="label">{{ data.tenant_name }}</div>
                    <el-dropdown class="more hover-item" placement="bottom-end">
                        <el-icon style="cursor: pointer">
                            <MoreFilled />
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="() => config(data)">基本信息</el-dropdown-item>
                                <el-dropdown-item @click="() => member(data)">成员权限管理</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </span>
            </template>
        </el-tree>
    </section>
</template>

<script setup lang="ts">
import { Team } from "@/models/team";
import { Profile } from "@/models/user";
import router from "@/router";
import { getTenantList } from "@/service/team";
import { useTeamStore } from "@/store/team";
import { useUserStore } from "@/store/user";
import { ref, watch, computed, onMounted, onBeforeUnmount, nextTick } from "vue"

const userStore = useUserStore()
const teamStore = useTeamStore()
const teamList = ref<Team[]>([])

const page = ref(1)
const limit = ref(50)
const loading = ref(false)
const nowIndex = ref(-1)
const total = ref(1)

const load = () => {
    if (nowIndex.value >= total.value) {
        return
    }
    if (!userStore?.getUserInfo?.id) {
        return
    }
    loading.value = true
    const account_id = userStore.getUserInfo.id
    getTenantList(
        account_id,
        page.value,
        limit.value,
    ).then((res) => {
        teamList.value.push(...res.data.results.filter((item) => item.is_public === true))
        nowIndex.value = page.value * limit.value
        total.value = res.data.count
        page.value++
        loading.value = false
    })
}

const reload = () => {
    teamList.value = []
    page.value = 1
    nowIndex.value = 0
    total.value = 1
    load()
}

defineExpose({ reload })

watch(
    () => userStore.getUserInfo,
    (userInfo: Profile) => {
        if (userInfo?.id) {
            reload()
        }
    }
);

onMounted(() => {
    reload()
})

const handleTeamClick = (data: Team) => {
    teamStore.updateCurrentTeam(data)
    console.log('handleTeamClick', teamStore.getCurrentTeam)
    router.push(`/team/${data.tenant_id}/datasets`)
}

const config = (data: Team) => {
    console.log('config', data)
}
const member = (data: Team) => {
    console.log('member', data)
    router.push(`/team/${data.tenant_id}/member`)
}

</script>

<style scoped lang="less">
.section {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.section::-webkit-scrollbar {
    display: none;
}

.custom-tree-node {
    width: calc(100% - 30px);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    flex-shrink: 0;

    .label {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .append {
        margin-right: 10px;
    }

    .append:hover {
        color: var(--el-color-primary);
    }

    .more:hover {
        color: var(--el-color-primary);
    }

}
</style>