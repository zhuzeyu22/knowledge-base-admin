<template>
    <div class="common-layout">
        <el-container style="height: 100%; overflow: hidden;">
            <el-aside width="260px" class="main-aside">
                <div class="layout-main">
                    <div class="header-img">
                        <img src="@/assets/layout-header.png" alt="">
                    </div>
                    <el-menu class="menu" :unique-opened="true" :default-active="activeMenu">
                        <el-menu-item index="1" @click="$router.push('/private')" class="text-container">
                            <img src="@/assets/private.png" alt="">个人知识库
                        </el-menu-item>
                        <el-sub-menu index="2" @click="$router.push('/public')" class="hover-container">
                            <template #title>
                                <div style="flex: 1;" class="text-container" :class="{'is-active-title':$route.path.includes('/public')}">
                                    <img src="@/assets/public.png" alt="">公共知识库
                                    <el-icon @click.stop="handleAddPublic" class="hover-button"
                                        v-if="$router.currentRoute.value.fullPath?.toString().match('/public') && isAdmin">
                                        <plus class="icon"/>
                                    </el-icon>
                                </div>
                            </template>
                            <el-menu-item-group>
                                <PublicTree ref="pbTreeRef"
                                    v-if="$router.currentRoute.value.fullPath?.toString().match('/public')"
                                    class="tree">
                                </PublicTree>
                            </el-menu-item-group>
                        </el-sub-menu>
                        <el-sub-menu index="3" @click="handleTeamClick" class="hover-container">
                            <template #title>
                                <div style="flex: 1;" class="text-container" :class="{'is-active-title':$route.path.includes('/team')}">
                                    <img src="@/assets/team.png" alt="">团队知识库
                                    <el-icon @click.stop="handleAddTeam" class="hover-button"
                                        v-if="$router.currentRoute.value.fullPath?.toString().match('/team')">
                                        <plus class="icon"/>
                                    </el-icon>
                                </div>
                            </template>
                            <el-menu-item-group>
                                <TeamTree v-if="$router.currentRoute.value.fullPath?.toString().match('/team')" class="tree">
                                </TeamTree>
                            </el-menu-item-group>
                        </el-sub-menu>
                        <el-menu-item v-if="showStat" index="4" @click="$router.push('/stat')" class="text-container">
                            <img src="@/assets/stat.png" alt="">数据统计</el-menu-item>
                        <el-menu-item v-if="showConversationLog" index="5" @click="$router.push('/conversation-log')"
                            class="text-container">
                            <img src="@/assets/conversation-log.png" alt="">对话记录</el-menu-item>
                        <el-menu-item v-if="showLoginLog" index="6" @click="$router.push('/login-log')"
                            class="text-container">
                            <img src="@/assets/login-log.png" alt="">登录记录</el-menu-item>
                        <el-menu-item v-if="showAuthLog" index="7" @click="$router.push('/auth-log')"
                            class="text-container">
                            <img src="@/assets/auth-log.png" alt="">授权记录</el-menu-item>
                        <el-menu-item v-if="showOpLog" index="8" @click="$router.push('/op-log')"
                            class="text-container">
                            <img src="@/assets/op-log.png" alt="">操作记录</el-menu-item>
                        <!-- <el-menu-item index="8" @click="$router.push('/logout')" class="text-container">退出登录</el-menu-item> -->
                    </el-menu>
                    
                </div>
                <div class="layout-user">
                    <img src="@/assets/user-default.png" alt="" class="user-img">
                    <span>{{ userName }}</span>
                    <img src="@/assets/user-icon.png" alt="" class="user-icon">
                </div>
            </el-aside>
            <el-main class="main-container">
                <router-view />
            </el-main>
            <CreateTeamDialog v-model:visible="addTeamDialogVisible"></CreateTeamDialog>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import router from "@/router";
import { useRoute } from 'vue-router';
import { getAccountProfile, getWorkspaceCurrent } from "@/service/workspace";
import { computed, onBeforeMount, ref, onMounted } from "vue";
import PublicTree from "@/components/publicTree/index.vue";
import TeamTree from "@/components/teamTree/index.vue";
import CreateTeamDialog from "@/views/team/createTeamDialog.vue";
import { useUserStore } from "@/store/user";
import { useTeamStore } from "@/store/team";
import { getTenantRole } from "@/service/tenant";

const route = useRoute();
const userStore = useUserStore()

const showStat = computed(() => userStore.getIsAdmin)
const showConversationLog = computed(() => userStore.getIsAdmin)
const showLoginLog = computed(() => userStore.getIsAdmin)
const showAuthLog = computed(() => userStore.getIsAdmin)
const showOpLog = computed(() => userStore.getIsAdmin)
const isAdmin = computed(() => userStore.getIsAdmin)
const userName = computed(() => userStore.getUserName)

const pbTreeRef = ref(null);
const addTeamDialogVisible = ref(false);

onBeforeMount(async () => {
    const { id: userId, name:name } = await getAccountProfile();
    localStorage.setItem("authId", userId);
    localStorage.removeItem("roleId");
    localStorage.setItem("userName",name);

    const { id: tenantId } = await getWorkspaceCurrent();
    const { data } = (await getTenantRole(tenantId, userId)) || {};

    if (data && data[0]) {
        const roleId = data[0].role_id;
        localStorage.setItem("roleId", roleId);
    }

    // 全局初始化
    const userStore = useUserStore()
    const teamStore = useTeamStore()
    try {
        userStore.updatePermission()
        userStore.updateUserInfo().then(async () => {
            await teamStore.updatePrivateTenantId()
            await teamStore.updateRoleList();
            await teamStore.refreshTeamList();
        });
    } catch (e) {
        console.log(e)
    }

});

onMounted(() => {
    console.log('showOpLog', showOpLog.value)
})

//动态计算当前激活的菜单index
const activeMenu = computed(() => {
    const path = route.path;
    if (path.includes('/private')) return '1';
    if (path.includes('/public')) return '2';
    if (path.includes('/team')) return '3';
    if (path.includes('/stat')) return '4';
    if (path.includes('/conversation-log')) return '5';
    if (path.includes('/login-log')) return '6';
    if (path.includes('/auth-log')) return '7';
    if (path.includes('/op-log')) return '8';

    return ''; //默认不选中
});
const handleAddPublic = async () => {
    if (pbTreeRef.value) {
        if (typeof pbTreeRef.value.handleNodeCreateClick === 'function') {
            pbTreeRef.value.handleNodeCreateClick();
        } 
    }
}
const handleAddTeam = () => {
    addTeamDialogVisible.value = true;
}

const handleTeamClick = () => {
    router.push('/team')
}
</script>

<style scoped lang="less">
.common-layout {
    width: 100%;
    height: 100%;
    background-image: url('@/assets/background.png');
    background-size: 100% 100%;
    background-position: left center;
    background-repeat: no-repeat;
}

.main-aside {
    position: relative;
    padding: 10px;
    background: transparent;
}

.main-container{
    padding: 10px;
    overflow: hidden;
}

.layout-main {
    display: flex;
    position: relative;
    background: #fff;
    border-radius: 16px;
    height: calc(100%);
    padding: 10px;
    flex-direction: column; 
}

.header-img img {
    width: 200px;
}

.common-aside {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.el-menu {
  border-right: none !important;
}
.menu {
    display: flex;
    overflow-x: hidden;
    flex-direction: column;
    height: calc(100% - 140px);
    .tree {
        padding: 0px 10px;
    }
    :deep(.el-menu-item-group__title) {
        padding: 0;
    }
    //美化滚动条
    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
        background: #d6d8de;
        border-radius: 4px;
    }
}
.text-container {
    display: flex;
    align-items: center;
}
.is-active-title {
    color: #409EFF;
}
.icon {
    width: 10px;
}
/* 默认隐藏按钮 */
.hover-button {
    height: 22px;
    width: 22px;
    opacity: 0;
    visibility: hidden;
    margin-left: 25px;
    transition: opacity 0.2s ease, visibility 0.2s ease;
    background-color: rgba(64, 158, 255, 0.2);
    border-radius: 50%;
}

/* 悬停时显示 */
.hover-container:hover .hover-button {
    opacity: 1;
    visibility: visible;
}

.hover-button:hover {
    color: #409EFF;
}

.layout-user {
    display: flex;
    position: absolute;
    bottom: 0;
    height: 100px;
    width: calc(100% - 20px);
    align-items: center;
    justify-content: space-around;
    
    border-top: #f0f0f0 solid 1px;
    border-radius:  0  0 16px 16px;
    .user-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
}
</style>