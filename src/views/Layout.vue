<template>
    <div class="common-layout">
        <el-container style="height: 100%;">
            <el-aside width="200px">
                <el-menu class="menu">
                    <el-menu-item index="1" @click="$router.push('/private')">个人知识库</el-menu-item>
                    <el-menu-item index="2" @click="$router.push('/public')" class="hover-container">
                        <div style="flex: 1;">公共知识库</div>
                        <el-icon @click.stop="handleAddPublic" class="hover-button">
                            <plus />
                        </el-icon>
                    </el-menu-item>
                    <PublicTree v-if="$router.currentRoute.value.name?.toString().match('public')" class="tree">
                    </PublicTree>
                    <el-menu-item index="8" @click="$router.push('/team')" class="hover-container">
                        <div style="flex: 1;">团队知识库</div>
                        <el-icon @click.stop="handleAddPublic" class="hover-button">
                            <plus />
                        </el-icon>
                    </el-menu-item>
                    <TeamTree v-if="$router.currentRoute.value.name?.toString().match('team')" class="tree"></TeamTree>
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
        </el-container>
    </div>
</template>
<script setup lang="ts">
import { getRolePermissionNameList, getTenantRole } from "@/service/tenant";
import { getAccountProfile, getWorkspaceCurrent } from "@/service/workspace";
import { computed, onBeforeMount, ref } from "vue";
import { Permission, hasPermission } from "@/utils/permission";
import PublicTree from "@/components/publicTree/index.vue";
import TeamTree from "@/components/teamTree/index.vue";

const permissions = ref([]);
const showStat = computed(() => hasPermission(permissions.value, Permission.STAT_MENU_BUTTON_VISIBLE));
const showConversationLog = computed(() => hasPermission(permissions.value, Permission.CONVERSATION_LOG_MENU_BUTTON_VISIBLE));
const showLoginLog = computed(() => hasPermission(permissions.value, Permission.LOGIN_LOG_MENU_BUTTON_VISIBLE));
const showAuthLog = computed(() => hasPermission(permissions.value, Permission.AUTH_LOG_MENU_BUTTON_VISIBLE));
const showOpLog = computed(()=> hasPermission(permissions.value,Permission.OP_MENU_BUTTON_VISIBLE))

onBeforeMount(async () => {
    const { id: userId } = await getAccountProfile();
    localStorage.setItem("authId", userId);
    localStorage.removeItem("roleId");

    const { id: tenantId } = await getWorkspaceCurrent();
    const { data } = await getTenantRole(tenantId, userId);

    if (data && data[0]) {
        const roleId = data[0].role_id;
        localStorage.setItem("roleId", roleId);
        permissions.value = (await getRolePermissionNameList(roleId)).data;
    }
});

const handleAddPublic = () => {
    // postCreateFolder()
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