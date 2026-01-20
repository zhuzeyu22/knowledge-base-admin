<template>
    <div class="common-layout">
        <el-container style="height: 100%;">
            <el-aside width="240px" class="main-aside">
                <div class="layout-main">
                    <div class="header-img">
                        <img src="@/assets/layout-header.png" alt="">
                    </div>
                    <el-menu class="menu">
                        <el-menu-item index="1" @click="$router.push('/private')" class="text-container">
                            <img src="@/assets/private.png" alt="">个人知识库
                        </el-menu-item>
                        <el-sub-menu index="2" @click="$router.push('/public')" class="hover-container">
                            <template #title>
                                <div style="flex: 1;" class="text-container">
                                    <img src="@/assets/public.png" alt="">公共知识库
                                    <el-icon @click.stop="handleAddPublic" class="hover-button"
                                        v-if="$router.currentRoute.value.fullPath?.toString().match('/public') && isAdmin">
                                        <plus />
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
                                <div style="flex: 1;" class="text-container">
                                    <img src="@/assets/team.png" alt="">团队知识库
                                    <el-icon @click.stop="handleAddTeam" class="hover-button"
                                        v-if="$router.currentRoute.value.fullPath?.toString().match('/team')">
                                        <plus />
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
                    <div class="layout-user">
                        <img src="@/assets/user-default.png" alt="" class="user-img">
                        <span>{{  }}用户名</span>
                        <img src="@/assets/user-icon.png" alt="" class="user-icon">
                    </div>
                </div>
                
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
import { getTenantRole } from "@/service/tenant";

const userStore = useUserStore()

const showStat = computed(() => userStore.getIsAdmin)
const showConversationLog = computed(() => userStore.getIsAdmin)
const showLoginLog = computed(() => userStore.getIsAdmin)
const showAuthLog = computed(() => userStore.getIsAdmin)
const showOpLog = computed(() => userStore.getIsAdmin)
const isAdmin = computed(() => userStore.getIsAdmin)

const pbTreeRef = ref(null);
const addTeamDialogVisible = ref(false);

onBeforeMount(async () => {
    const { id: userId } = await getAccountProfile();
    localStorage.setItem("authId", userId);
    localStorage.removeItem("roleId");

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

const handleAddPublic = async () => {
    console.log("加号被点击");
    console.log("当前 ref 对象:", pbTreeRef.value); // 检查这一行打印的是不是 null

    // 1. 确保 ref 存在
    if (pbTreeRef.value) {
        // 2. 确保方法存在 (防止子组件改名了父组件不知道)
        if (typeof pbTreeRef.value.handleNodeCreateClick === 'function') {
            pbTreeRef.value.handleNodeCreateClick();
        } else {
            console.error("找到了组件，但没找到 handleNodeCreateClick 方法，请检查子组件是否 defineExpose");
        }
    } else {
        console.error("未找到 PublicTree 组件实例，可能是 v-if 还没渲染完成");
        // 如果是因为 v-if 刚切换导致 dom 没刷新，可以使用 nextTick
        // import { nextTick } from 'vue';
        // await nextTick();
        // 再次尝试调用...
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
}

.main-aside {
    padding: 10px;
    background: transparent;
}

.layout-main {
    position: relative;
    background: #fff;
    border-radius: 16px;
    height: calc(100%);
    padding: 10px;
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
    flex-direction: column;
    height: calc(100% - 100px);
    .tree {
        // flex: 1;
        padding: 0px 10px;
    }
}

.text-container {
    display: flex;
    align-items: center;
}

/* 默认隐藏按钮 */
.hover-button {
    height: 60%;
    width: 30px;
    opacity: 0;
    visibility: hidden;
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

.layout-user {
    display: flex;
    position: absolute;
    bottom: 0;
    height: 100px;
    width: calc(100% - 20px);
    align-items: center;
    justify-content: space-around;
    
    background-color: #fff;
    border-top: #f0f0f0 solid 1px;
    border-radius:  0  0 16px 16px;
    .user-img {
        width: 50px;
        height: 50px;
        background-color: pink;
        border-radius: 50%;
    }
}
</style>