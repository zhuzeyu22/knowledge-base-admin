<template>
    <el-container class="content-container">
        <BackHeader title="基本信息" />
        <div class="form-item">
            <label class="form-label">团队名称</label>
            <el-input v-model="name" style="width: 200px" placeholder="团队名称" />
        </div>
        <div class="form-item">
            <label class="form-label">解散团队</label>
            <el-button type="danger" @click="handleDelete">删除</el-button>
        </div>
        <div class="form-actions">
            <el-button type="primary" @click="handleSave">保存修改</el-button>
        </div>
    </el-container>
</template>

<script setup lang="ts">
import router from "@/router";
import { computed, onMounted, ref, watch } from "vue";
import { deleteTeam, deleteTenant, deleteUser, getTeamInfo, getTeamMemberList, putTeamNameModify, putUserRole } from "@/service/team";
import { ElMessage, ElMessageBox } from "element-plus";
import { useTeamStore } from '@/store/team';
import BackHeader from "@/components/backHeader/index.vue";

const tenantId = computed(() => router.currentRoute.value.params.teamId);
const name = ref('')
const teamStore = useTeamStore()

watch(tenantId, async (newVal) => {
    if (newVal) {
        const res = await getTeamInfo(newVal)
        console.log(res.data.name)
        name.value = res.data.name
    }
}, {
    deep: true,
    immediate: true
});

const handleSave = () => {
    const tenantId = router.currentRoute.value.params.teamId
    console.log('tenantId', tenantId);
    putTeamNameModify(tenantId as string, name.value).then(res => {
        ElMessage({
            type: "success",
            message: "保存成功",
        });
        location.reload()
    }).catch(err => {
        ElMessage({
            type: "warning",
            message: "保存失败",
        });
    })
}

const handleDelete = () => {
    const tenantId = router.currentRoute.value.params.teamId
    ElMessageBox.confirm("删除这个团队？", "", {
        confirmButtonText: "我确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        deleteTeam(tenantId as string).then(res => {
            ElMessage({
                type: "success",
                message: "删除成功",
            });

            teamStore.refreshTeamList()
            router.push('/team')
        }).catch(err => {
            ElMessage({
                type: "warning",
                message: "删除失败",
            });
        })
    })
}

</script>

<style scoped lang="less">
.content-container {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 16px;
    height: calc(100%);
    padding: 24px;
    gap: 12px;
}

.context-style {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

.form-item {
    .form-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 600;
    }
}

.form-actions {
    position: absolute;
    bottom: 30px;
    right: 50px
}
</style>