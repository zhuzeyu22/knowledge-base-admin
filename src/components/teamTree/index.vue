<template>
    <section class="section">
        <el-tree :data="teamList" node-key="id" v-infinite-scroll="load" :infinite-scroll-disabled="loading"
            :infinite-scroll-distance="10">
            <template #default="{ node, data }">
                <span class="custom-tree-node">
                    <span>{{ data.tenant_name }}</span>
                    <!-- <span>
                        <el-button type="text" @click="() => remove(node, data)">
                        </el-button>
                    </span> -->
                </span>
            </template>
        </el-tree>
    </section>
</template>

<script setup lang="ts">
import { Team } from "@/models/team";
import { getTenantList } from "@/service/team";
import { useUserStore } from "@/store/user";
import { ref, watch, computed, onMounted } from "vue"

const userStore = useUserStore()
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
    loading.value = true
    getTenantList(
        userStore.getUserInfo.id,
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

watch(
    () => userStore.getUserInfo.id,
    () => {
        teamList.value = []
        page.value = 1
        nowIndex.value = 0
        total.value = 1
        load()
    },
    {
        immediate: true,
        deep: true,
    }
);



</script>

<style scoped lang="less">
.section {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
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