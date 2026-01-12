<template>
  <el-card @click="goToNextLevelDirectory">
    <div class="knowledge-base-card">
      <div class="knowledge-base-card-background"></div>
      <div class="knowledge-base-card-name">{{ dirList.name }}</div>
      <div class="knowledge-base-card-operate" @click.stop>
        <el-dropdown trigger="click" placement="bottom-end">
          <el-icon style="cursor: pointer">
            <Operation />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              
              <!-- <el-dropdown-item @click="() => rename(dirList.name)">修改</el-dropdown-item> -->
              <!-- <el-dropdown-item @click="handleDeleteDirectory">删除</el-dropdown-item> -->
              
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-card>
  <el-dialog title="重命名文件夹" v-model="nodeRenameDialogVisible" width="30%">
      <div style="margin-bottom: 8px;">文件夹名称：</div>
      <el-input v-model="newName" placeholder="请输入名称" maxlength='30' show-word-limit></el-input>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleNodeRenameConfirm">确 定</el-button>
          <el-button @click="nodeRenameDialogVisible = false">取 消</el-button>
      </span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { PublicFolderNode } from '@/models/public';
import { ref } from 'vue';
import { usePublicStore } from '@/store/public';
import { ElMessage } from 'element-plus';
const publicStore = usePublicStore()

const props = defineProps<{
  dirList:PublicFolderNode;
}>();
const nodeRenameDialogVisible = ref(false)
const newName = ref('')
// 记录点击增加按钮的节点
const updateNode = ref<Partial<PublicFolderNode>>({
    id: null,
    name: '',
    parent_id: null,
    level: 0,
    children: []
})

const goToNextLevelDirectory = () => {
  //todo
  console.log('跳转下一级目录')
}
const handleUpdateDirectory = () => {
  //todo
  console.log('修改目录')
}
function rename(data: PublicFolderNode) {
    newName.value = data.name
    updateNode.value = data
    nodeRenameDialogVisible.value = true
}
const handleNodeRenameConfirm = () => {
    publicStore.renameNode(updateNode.value, newName.value).then(res => {
        ElMessage({
            type: "success",
            message: "重命名成功",
        });
        nodeRenameDialogVisible.value = false
    }).catch(err => {
        ElMessage({
            type: "warning",
            message: "重命名失败",
        });
    })
}


</script>

<style scoped>
.knowledge-base-card {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex-shrink: 0;
  height: 200px;
  flex-grow: 1;
  align-items: center;
}
.knowledge-base-card-background {
  background-image: url("@/assets/know-directory-icon.png");
  width: 80px;
  height: 60px;
  margin: 40px 0;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
}
.knowledge-base-card-name {
  font-size: 18px;
}
.knowledge-base-card-operate {
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>
