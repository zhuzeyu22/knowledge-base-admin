<template>
    <section class="section">
        <el-main class="context-style" style="overflow: hidden">
            <div class="header-style">
                成员权限管理
            </div>
            <div style="margin-bottom: 20px; display: flex; flex-direction: row-reverse;">
                <el-button type="primary" @click="addMemberDialogVisible = true" size="default">添加成员</el-button>
            </div>
            <div style="overflow: auto; height: auto; width: 100%;">
                <el-table :data="memberList" style="overflow-y: auto;" size="default">
                    ">
                    <el-table-column label="成员" width="300" prop="account_name">
                    </el-table-column>
                    <el-table-column label="组织" prop="organization">
                    </el-table-column>
                    <el-table-column label="权限" width="100" prop="role_name">
                        <template #default="scope">
                            <el-select v-model="scope.row.role_id"
                                @change="(data: string) => handleRoleChange(scope.row, data)"
                                :disabled="ownerAccountId == scope.row.account_id || id == scope.row.account_id"
                                size="small">
                                <el-option v-for="item in roleOptions" :key="item.id" :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
<!--                    <el-table-column label="" width="80">-->
<!--                        <template #default="scope">-->
<!--                            <el-icon v-if="ownerAccountId != scope.row.account_id && id != scope.row.account_id"-->
<!--                                class="delete-icon" @click="() => handleMemberDelete(scope.row)" :size="20"-->
<!--                                color="#909399">-->
<!--                                <Delete />-->
<!--                            </el-icon>-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                  <el-table-column label="" width="80">
                    <template #default="scope">
                      <el-popconfirm
                          v-if="ownerAccountId != scope.row.account_id && id != scope.row.account_id"
                          title="确定删除该成员吗？"
                          :icon="WarningFilled"
                          icon-color="#f56c6c"
                          width="200"
                          confirm-button-type="danger"
                          confirm-button-text="确定"
                          cancel-button-text="取消"
                          @confirm="() => handleMemberDelete(scope.row)"
                      >
                        <template #reference>
                          <el-icon class="delete-icon" :size="20" color="#909399">
                            <Delete />
                          </el-icon>
                        </template>
                      </el-popconfirm>
                    </template>
                  </el-table-column>
                </el-table>
            </div>
            <div class="pagination-container">
                <el-pagination layout="total, prev, pager, next" :total="total" v-model:current-page="page"
                    v-model:page-size="pageSize" @current-change="handlePageChange" @size-change="handlePageSizeChange"
                    size="default">
                </el-pagination>
            </div>
            <AddMemberDialog v-model:visible="addMemberDialogVisible" @add="handleMemberAdd" @cancel="handleCancel" />
        </el-main>
    </section>
</template>

<script setup lang="ts">
import router from "@/router";
import { computed, onMounted, ref, watch } from "vue";
import AddMemberDialog from "./addMemberDialog.vue";
import { deleteUser, getTeamMemberList, putUserRole } from "@/service/team";
import { useTeamStore } from "@/store/team";
import { Member } from "@/models/team";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute } from 'vue-router'
import { Close, WarningFilled } from "@element-plus/icons-vue";

const route = useRoute()

const teamStore = useTeamStore();
const addMemberDialogVisible = ref(false);
const memberList = ref([]);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);

const roleOptions = computed(() => teamStore.getRoleList);
const tenantId = computed(() => router.currentRoute.value.params.teamId);

import { useUserStore } from '@/store/user';
const userStore = useUserStore()
const id = computed(() => userStore?.getUserInfo?.id)

const ownerAccountId = ref('')

watch(tenantId, () => {
    console.log('tenantId', tenantId);
    if (!tenantId.value) {
        return;
    }
    page.value = 1;
    updateData();
});

onMounted(() => {
    if (JSON.parse(localStorage.getItem('teamList')).length) {
        let obj = JSON.parse(localStorage.getItem('teamList')).find(item => {
            return item.tenant_id == route.params.teamId
        })
        if (!obj?.is_admin) {
            router.push('/team')
        }
    }
    updateData();
});

const updateData = () => {
    const tenantId = router.currentRoute.value.params.teamId
    if (!tenantId) {
        return;
    }
    getTeamMemberList(tenantId as string, page.value, pageSize.value).then((res) => {
        console.log(res);
        memberList.value = res.data.results;
        total.value = res.data.count;
        ownerAccountId.value = res.data.created_by.account_id
        console.log(total.value);
    });
}

const handlePageChange = () => {
    updateData();
}

const handlePageSizeChange = () => {
    updateData();
}

const handleRoleChange = (row: Member, roleId: string) => {
    console.log('roleOptions.value', roleOptions.value)
    const role = roleOptions.value.find(r => r.id == roleId) || {}
    console.log('handleRoleChange', row, roleId);
    const params = { ...row }
    params.role_name = role.name
    putUserRole(params).then((res) => {
        ElMessage({
            type: "success",
            message: "修改成功",
        });
    }).catch(err => {
        ElMessage({
            type: "warning",
            message: "修改失败",
        });
    })
}

const handleMemberDelete = (row: Member) => {
  deleteUser(row).then((res) => {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    updateData()
  }).catch(err => {
    ElMessage({
      type: "warning",
      message: "删除失败",
    });
  })
}

const handleMemberAdd = () => {
    console.log('handleMemberAdd updateData')
    addMemberDialogVisible.value = false
    updateData()
}
const handleCancel = () => {
    addMemberDialogVisible.value = false
}

</script>

<style scoped lang="less">
.header-style {
    display: flex;
    align-items: center;
    justify-content: start;
    height: auto;
    font-size: 14px;
    font-weight: bold;
    // border-bottom: 1px solid var(--el-border-color);
}

.section {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    -ms-overflow-style: none;
    scrollbar-width: none;
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
