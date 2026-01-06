<template>
    <section class="section">
        <el-header class="header-style">
            <el-button type="primary" link size="default" @click="router.back()" style="padding: 0; margin-right: 16px">
                <el-icon>
                    <Back />
                </el-icon>
            </el-button>
            <div>成员权限管理</div>
        </el-header>
        <el-main class="context-style" style="overflow: hidden">
            <div style="margin-bottom: 20px; display: flex; flex-direction: row-reverse;">
                <el-button type="primary" size="default" @click="addMemberDialogvisible = true">添加成员</el-button>
            </div>
            <div style="overflow: auto; height: auto; width: 100%;">
                <el-table :data="memberList" style="overflow-y: auto;">
                    <el-table-column label="成员" width="300" prop="account_name">
                    </el-table-column>
                    <el-table-column label="组织" prop="organization">
                    </el-table-column>
                    <el-table-column label="权限" width="200" prop="role_name">
                        <template #default="scope">
                            <el-select v-model="scope.row.role_id" @change="() => handleRoleChange(scope.row)"
                                :disabled="!hasPermission(permissions, Permission.MEMBER_MANAGEMENT_DROPDOWN_ROLE_SETTING_BUTTON_VISIBLE)">
                                <el-option v-for="item in roleOptions" :key="item.id" :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="" width="80" prop="role_name">
                        <template #default="scope">
                            <el-icon class="delete-icon" @click="handleDeleteFile(file.id)" :size="20" color="#909399">
                                <Delete />
                            </el-icon>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-container">
                <el-pagination layout="sizes, total, prev, pager, next" :total="total" v-model:current-page="page"
                    v-model:page-size="page_size" @current-change="handlePageChange"
                    @size-change="handlePageSizeChange">
                </el-pagination>
            </div>
            <AddMemberDialog v-model="addMemberDialogvisible" />
        </el-main>
    </section>
</template>

<script setup lang="ts">
import router from "@/router";
import { computed, onMounted, ref, watch } from "vue";
import AddMemberDialog from "./addMemberDialog.vue";
import { getTeamMemberList } from "@/service/team";
import { useTeamStore } from "@/store/team";
import { hasPermission, Permission } from "@/utils/permission";
const teamStore = useTeamStore();
const addMemberDialogvisible = ref(false);
const memberList = ref([]);
const page = ref(1);
const page_size = ref(20);
const total = ref(0);

const roleOptions = computed(() => teamStore.getRoleList);
const tenantId = computed(() => String(router.currentRoute.value.params.teamId));
const permissions = computed(() => teamStore.getPermissions);

const role = ref('')

watch(tenantId, () => {
    console.log('tenantId', tenantId);
    if (!tenantId.value) {
        return;
    }
    page.value = 1;
    updateData();
});

onMounted(() => {
    updateData();
});

const updateData = () => {
    if (!tenantId.value) {
        return;
    }
    getTeamMemberList(tenantId.value, page.value, page_size.value).then((res) => {
        console.log(res);
        memberList.value = res.data.results;
        total.value = res.data.count;
        console.log(total.value);
    });
}

const handlePageChange = () => {
    updateData();
}

const handlePageSizeChange = () => {
    updateData();
}

const handleRoleChange = (data) => {
    console.log('handleRoleChange', data);
}

</script>

<style scoped lang="less">
.section {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.header-style {
    display: flex;
    background-color: #f5f5f5;
    align-items: center;
    height: auto;
    // border-bottom: 1px solid var(--el-border-color);
}

.context-style {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

.delete-icon {
    cursor: pointer;
    flex-shrink: 0;
    margin-left: 12px;
    transition: color 0.3s ease;

    &:hover {
        color: #f56c6c !important;
    }
}

.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>