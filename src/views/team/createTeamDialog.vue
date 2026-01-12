<template>
    <el-dialog title="新建团队" v-model="visible" width="30%" :before-close="handleClose">
        <div style="margin-bottom: 8px;">团队名称：</div>
        <el-input v-model="newName" placeholder="请输入名称"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleCreateConfirm">确 定</el-button>
            <el-button @click="visible = false">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script setup lang="ts">
import { postAddTenant } from '@/service/team';
import { useTeamStore } from '@/store/team';
import { useUserStore } from '@/store/user';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';

const newName = ref('')
const visible = defineModel("visible")
const userStore = useUserStore()
const teamStore = useTeamStore()

const id = computed(() => userStore?.getUserInfo?.id)

const handleClose = () => {
    // 关闭对话框的回调函数
    visible.value = false;
};

const handleCreateConfirm = () => {
    const owner = id.value
    // 确定按钮的回调函数
    postAddTenant({
        name: newName.value,
        is_public: true,
        description: "",
        avatar: '',
        owner,
    }).then(() => {
        ElMessage({
            type: "success",
            message: "创建成功",
        });
        teamStore.refreshTeamList()
    }).catch((e) => {
        console.log(e)
        if(e.response){
            
        }
        ElMessage({
            type: "warning",
            message: e.message,
        });
    }).finally(() => {
        visible.value = false;
    })
};

</script>

<style scoped lang="less">
.dialog-footer {
    display: flex;
    flex-direction: row-reverse;
    gap: 16px;
    margin-top: 16px;
}
</style>