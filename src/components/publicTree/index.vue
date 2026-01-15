<template>
    <section class="section">
        <el-tree ref='publicTree' :data="folderTree" node-key="id" @node-click='handleNodeClick'>
            <template #default="{ node, data }">
                <span class="custom-tree-node hover-container">
                    <div class="label">{{ data.name }}</div>
                    <el-icon v-if="data.level < MAX_LEVEL && hasPermission" class="append hover-item"
                        @click.stop="handleNodeCreateClick(data)">
                        <plus />
                    </el-icon>
                    <el-dropdown v-if="hasPermission" class="more hover-item" placement="bottom-end">
                        <el-icon style="cursor: pointer">
                            <MoreFilled />
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="() => rename(data)">重命名</el-dropdown-item>
                                <el-dropdown-item @click="() => remove(node, data)">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </span>
            </template>
        </el-tree>
        <el-dialog title="新建文件夹" v-model="nodeCreateDialogVisible" width="30%">
            <div style="margin-bottom: 8px;">文件夹名称：</div>
            <el-input v-model="newName" placeholder="请输入名称" maxlength='30' show-word-limit></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleNodeCreateConfirm">确 定</el-button>
                <el-button @click="nodeCreateDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="重命名文件夹" v-model="nodeRenameDialogVisible" width="30%">
            <div style="margin-bottom: 8px;">文件夹名称：</div>
            <el-input v-model="newName" placeholder="请输入名称" maxlength='30' show-word-limit></el-input>
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
import { useUserStore } from "@/store/user";

const userStore = useUserStore()
const publicStore = usePublicStore()

const hasPermission = computed(() => userStore.getIsAdmin)
const folderTree = computed(() => publicStore.folderTree)

const newName = ref('')
const nodeCreateDialogVisible = ref(false)
const nodeRenameDialogVisible = ref(false)

const publicTree = ref()

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

function rename(data: PublicFolderNode) {
    newName.value = data.name
    updateNode.value = data
    nodeRenameDialogVisible.value = true
}

async function remove(node: any, data: PublicFolderNode) {
    console.log('remove', node)
    console.log('remove', data)
    // 查询是否有子节点
    if(node.expanded == false && data.children && data.children.length == 0){
        await publicStore.getNodeChildren(data)
    }

    ElMessageBox.confirm("删除这个节点？", "", {
        confirmButtonText: "我确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            publicStore.deleteNode(data).then(res => {
                ElMessage({
                    type: "success",
                    message: "删除成功",
                });
                publicTree.value.remove(data)
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

// function loadNode(node: any, resolve: any) {
//     publicStore.getNodeChildren(node.data).then((res) => {
//         console.log('loadNode res11', res)
//         resolve(res)
//     }).catch((err) => {
//         console.log(err)
//         ElMessage({
//             type: "warning",
//             message: "加载失败",
//         });
//         resolve([])
//     })
// }

const handleNodeCreateClick = (node?: Partial<PublicFolderNode>) => {
    console.log('handleNodeCreateClick node', node)
    if (!node) {
        updateNode.value = {
            id: null,
            name: '',
            parent_id: null,
            // 从根的层级进行创建需要是 -1
            level: -1,
            children: []
        }
    } else {
        updateNode.value = node
    }
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

const handleNodeClick = (data: PublicFolderNode, node:any, vnode:any) =>{
    publicStore.updateCurrentNode(data)
}

</script>

<style scoped lang="less">
.section {
    display: flex;
    flex-direction: column;
    width: 100%;
    // height: 100%;
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