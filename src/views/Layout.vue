<template>
    <div class="common-layout">
        <el-container style="height: 100%;">
            <el-aside width="240px">
                <el-menu class="menu">
                    <el-menu-item index="1" @click="$router.push('/private')">个人知识库</el-menu-item>
                    <el-menu-item index="2" @click="$router.push('/public')" class="hover-container">
                        <div style="flex: 1;">公共知识库</div>
                        <el-icon @click.stop="handleAddPublic" class="hover-button"
                            v-if="$router.currentRoute.value.fullPath?.toString().match('/public')">
                            <plus />
                        </el-icon>
                    </el-menu-item>
                    <PublicTree ref="pbTreeRef" v-if="$router.currentRoute.value.fullPath?.toString().match('/public')"
                        class="tree">
                    </PublicTree>
                    <el-menu-item index="3" @click="handleTeamClick" class="hover-container">
                        <div style="flex: 1;">团队知识库</div>
                        <el-icon @click="handleAddTeam" class="hover-button"
                            v-if="$router.currentRoute.value.fullPath?.toString().match('/team')">
                            <plus />
                        </el-icon>
                    </el-menu-item>
                    <TeamTree v-if="$router.currentRoute.value.fullPath?.toString().match('/team')" class="tree"></TeamTree>
                    <el-menu-item v-if="showStat" index="4" @click="$router.push('/stat')">数据统计</el-menu-item>
                    <el-menu-item v-if="showConversationLog" index="5"
                        @click="$router.push('/conversation-log')">对话记录</el-menu-item>
                    <el-menu-item v-if="showLoginLog" index="6" @click="$router.push('/login-log')">登录记录</el-menu-item>
                    <el-menu-item v-if="showAuthLog" index="7" @click="$router.push('/auth-log')">授权记录</el-menu-item>
                    <el-menu-item v-if="showOpLog" index="8" @click="$router.push('/op-log')">操作记录</el-menu-item>
                    <!-- <el-menu-item index="8" @click="$router.push('/logout')">退出登录</el-menu-item> -->
                </el-menu>
            </el-aside>
            <el-main>
                <router-view />
            </el-main>
            <CreateTeamDialog v-model:visible="addTeamDialogVisible"></CreateTeamDialog>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import router from "@/router";
import { getAccountProfile, getWorkspaceCurrent } from "@/service/workspace";
import { computed, onBeforeMount, ref, onMounted } from "vue";
import PublicTree from "@/components/publicTree/index.vue";
import TeamTree from "@/components/teamTree/index.vue";
import CreateTeamDialog from "@/views/team/createTeamDialog.vue";
import { useUserStore } from "@/store/user";
import { useTeamStore } from "@/store/team";

const userStore = useUserStore()
const teamStore = useTeamStore()

const showStat = computed(() => userStore.getIsAdmin)
const showConversationLog = computed(() => userStore.getIsAdmin)
const showLoginLog = computed(() => userStore.getIsAdmin)
const showAuthLog = computed(() => userStore.getIsAdmin)
const showOpLog = computed(() => userStore.getIsAdmin)

const pbTreeRef = ref(null);
const addTeamDialogVisible = ref(false);


onBeforeMount(async () => {
    const { id: userId } = await getAccountProfile();
    localStorage.setItem("authId", userId);
    localStorage.removeItem("roleId");
});

onMounted(() => {
    console.log('showOpLog', showOpLog.value)
})

const handleAddPublic = () => {
    pbTreeRef.value.handleNodeCreateClick();
}
const handleAddTeam = () => {
    addTeamDialogVisible.value = true;
}

const handleTeamClick = ()=>{
    router.push('/team')
}
</script>

<style scoped lang="less">
.common-layout {
    width: 100%;
    height: 100%;
}

.common-aside {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.menu {
    height: 100%;
    display: flex;
    flex-direction: column;

    .tree {
        flex: 1;
        padding: 0px 10px;
    }
}

.hover-container {}

/* 默认隐藏按钮 */
.hover-button {
    height: 60%;
    width: 30px;
    opacity: 0;
    visibility: hidden;
    border-left: #409EFF solid 2px;
    padding-left: 10px;
    transition: opacity 0.2s ease, visibility 0.2s ease;
}

/* 悬停时显示 */
.hover-container:hover .hover-button {
    opacity: 1;
    visibility: visible;
}

.hover-button:hover {
    color: #409EFF;
}
</style>