<template>
    <section class="section">
        <el-tree :data="folderTree" node-key="id" :load="loadNode" lazy>
            <template #default="{ node, data }">
                <span class="custom-tree-node hover-container">
                    <div class="label">{{ node.data.name }}</div>
                    <el-icon v-if="node.data.level <= MAX_LEVEL" class="append hover-item"
                        @click.stop="handleNodeCreateClick(node)">
                        <plus />
                    </el-icon>
                    <el-dropdown class="more hover-item" placement="bottom-end">
                        <el-icon style="cursor: pointer">
                            <MoreFilled />
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="">重命名</el-dropdown-item>
                                <el-dropdown-item @click="() => remove(node)">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </span>
            </template>
        </el-tree>
        <el-dialog title="提示" :visible.sync="nodeCreateDialogVisible" width="30%">
            <span>请输入名称：</span>
            <el-input v-model="newNode.name" placeholder="请输入名称"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newNodeName = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script setup lang="ts">
import { PublicFolderNode } from '@/models/public';
import { getFolder } from '@/service/public';
import { MAX_LEVEL, usePublicStore } from '@/store/public';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, onMounted, ref } from 'vue';

const publicStore = usePublicStore()
const folderTree = computed(() => publicStore.folderTree)

const nodeCreateDialogVisible = ref(false)
const newNode = ref<PublicFolderNode>({
    id: '',
    name: '',
    parentId: '',
    level: 0,
    children: []
})
const nodeRenameDialogVisible = ref(false)

onMounted(() => {
    getFolder().then(res => {
        // todo
    }).catch(err => {
        console.log(err)
    }).finally(() => {
        publicStore.setPublicTree([{
            id: '1',
            name: '1',
            parentId: '',
            level: 0,
            children: []
        }, {
            id: '2',
            name: '2',
            parentId: '',
            level: 0,
            children: []
        }])
    })
});

function append(data: PublicFolderNode) {
    console.log(data)
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

const handleNodeCreateClick = (node: PublicFolderNode) => {
    newNode.value = {
        id: '',
        name: '',
        parentId: node.id,
        level: node.level + 1,
        children: []
    }
    nodeCreateDialogVisible.value = true
}

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
</style>