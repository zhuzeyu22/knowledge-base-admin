<template>
    <el-dialog title="添加成员" v-model="addMemberDialogvisible" width="60%">
        <el-row class="add-member">
            <el-col :span="11" style="height: 100%;">
                <el-input v-model="filterText" placeholder="搜索"></el-input>
                <div class="org">
                    <el-tree ref="orgTree" :data="testTree" node-key="id" show-checkbox @check="handleCheckClick">
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="2" style="height: 100%;">
            </el-col>

            <el-col :span="11" style="height: 100%;">
                <div style="height: 90%; overflow-y: auto;">
                    <div v-for="data in selected" class="custom-tree-node">
                        <div class="label">{{ data.label }}</div>
                        <div placement="bottom-end">
                            <div @click="handleSelectedMemberDelete">删除</div>
                        </div>
                    </div>
                </div>
                <span class="dialog-footer">
                    <el-button type="primary">确 定</el-button>
                    <el-button @click="addMemberDialogvisible = false">取 消</el-button>
                </span>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const addMemberDialogvisible = ref(false);

function generateBfsTree(totalNodes = 20000, childrenPerNode = 20) {
    if (totalNodes <= 0) return [];

    // 第一个节点（根）
    const root = { id: 1, label: 'Node 1', children: [], path: '1' };
    if (totalNodes === 1) return [root];

    const allNodes = [root]; // 用于按 BFS 顺序存储所有节点（方便找父节点）
    const queue = [root];    // BFS 队列：存入待分配子节点的父节点
    let nextId = 2;

    while (nextId <= totalNodes && queue.length > 0) {
        const parent = queue.shift(); // 取出队首父节点

        // 为该 parent 创建子节点（最多 childrenPerNode 个，且不超过 totalNodes）
        const remaining = totalNodes - nextId + 1; // 还能创建多少个
        const childCount = Math.min(childrenPerNode, remaining);

        for (let i = 0; i < childCount; i++) {
            const child = {
                id: nextId,
                label: `Node ${nextId}`,
                path: `${parent?.path || ''}/${nextId}`,
                children: []
            };
            parent.children.push(child);
            allNodes.push(child);
            queue.push(child); // 子节点将来也可能有孩子
            nextId++;

            if (nextId > totalNodes) break;
        }
    }

    return [root]; // el-tree 需要数组格式的根
}

const mockTree = generateBfsTree();
const testTree = ref(mockTree);
const filterText = ref('');
const orgTree = ref();
const selected = ref([]);

const handleCheckClick = (node, obj) => {
    console.log(node, obj);
    selected.value = obj.checkedNodes;
    console.log('selected.value', selected.value)
};

const handleSelectedMemberDelete = () => {
    console.log('handleSelectedMemberDelete');
};

</script>

<style scoped lang="less">
.add-member {
    height: 600px;
    overflow: hidden;
}

:deep(.org) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
}

.custom-tree-node {
    width: calc(100% - 30px);
    overflow: auto;
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

}

.dialog-footer {
    display: flex;
    flex-direction: row-reverse;
    gap: 16px;
    margin-top: 16px;
}
</style>