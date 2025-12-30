<template>
    <section class="section">
        <el-tree :data="folderTree" node-key="id" :load="loadNode" lazy>
            <template #default="{ node, data }">
                <span class="custom-tree-node hover-container">
                    <div class="label">{{ data.name }}</div>
                    <el-icon v-if="data.level <= MAX_LEVEL" class="append hover-item"
                        @click.stop="handleNodeCreateClick(node)">
                        <plus />
                    </el-icon>
                    <el-dropdown class="more hover-item" placement="bottom-end">
                        <el-icon style="cursor: pointer">
                            <MoreFilled />
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="() => rename(node)">重命名</el-dropdown-item>
                                <el-dropdown-item @click="() => remove(node)">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </span>
            </template>
        </el-tree>
        <el-dialog title="新建文件夹" v-model="nodeCreateDialogVisible" width="30%">
            <div style="margin-bottom: 8px;">文件夹名称：</div>
            <el-input v-model="newName" placeholder="请输入名称"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleNodeCreateConfirm">确 定</el-button>
                <el-button @click="nodeCreateDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="重命名文件夹" v-model="nodeRenameDialogVisible" width="30%">
            <div style="margin-bottom: 8px;">文件夹名称：</div>
            <el-input v-model="newName" placeholder="请输入名称"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleNodeRenameConfirm">确 定</el-button>
                <el-button @click="nodeRenameDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script setup lang="ts">
import { PublicFolderNode } from '@/models/public';
import { MAX_LEVEL, usePublicStore } from '@/store/public';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, onMounted, ref } from 'vue';

const publicStore = usePublicStore()
const folderTree = ref<PublicFolderNode[]>([{
    id: '0',
    name: '根目录',
    parent_id: null,
    level: 0,
    children: [],
}])

onMounted(() => {
    console.log('node', folderTree.value)
});
// const folderTree = computed(() => publicStore.folderTree)

const newName = ref('')
const nodeCreateDialogVisible = ref(false)
const nodeRenameDialogVisible = ref(false)

// 记录点击增加按钮的节点
const updateNode = ref<Partial<PublicFolderNode>>({
    id: null,
    name: '',
    parent_id: null,
    level: 0,
    children: []
})

onMounted(() => {
    publicStore.initPublicTree()
});

function rename(node: { data: PublicFolderNode }) {
    console.log(node)
    newName.value = node.data.name
    nodeRenameDialogVisible.value = true
}

function remove(node: any) {
    console.log(node)
    ElMessageBox.confirm("删除这个节点？", "", {
        confirmButtonText: "我确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            publicStore.deleteNode(node).then(res => {
                ElMessage({
                    type: "success",
                    message: "删除成功",
                });
            }).catch(err => {
                ElMessage({
                    type: "warning",
                    message: "删除失败",
                });
            })
        })
        .catch(() => {
            ElMessage({
                type: "info",
                message: "已取消",
            });
        });
}

function loadNode(node: any, resolve: any) {
    publicStore.getNodeChildren(node).then((res) => {
        resolve(res)
    }).catch((err) => {
        resolve([])
        ElMessage({
            type: "warning",
            message: "加载失败",
        });
    })
}

const handleNodeCreateClick = (node?: Partial<PublicFolderNode>) => {
    if (!node) {
        updateNode.value = {
            id: null,
            name: '',
            parent_id: null,
            level: 0,
            children: []
        }
    } else {
        updateNode.value = node
    }

    console.log('handleNodeCreateClick')
    newName.value = ''
    nodeCreateDialogVisible.value = true
}

const handleNodeCreateConfirm = () => {
    publicStore.appendNode(updateNode.value, newName.value).then(res => {
        ElMessage({
            type: "success",
            message: "创建成功",
        });
    }).catch(err => {
        ElMessage({
            type: "warning",
            message: "创建失败",
        });
        console.log(err)
    }).finally(() => {
        nodeCreateDialogVisible.value = false
    })
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

defineExpose({
    handleNodeCreateClick
})

</script>

<style scoped lang="less">
.section {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
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

.dialog-footer {
    display: flex;
    flex-direction: row-reverse;
    gap: 16px;
    margin-top: 16px;
}
</style>