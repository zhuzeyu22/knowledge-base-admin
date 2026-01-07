<template>
    <el-dialog title="添加成员" v-model="addMemberDialogvisible" width="60%">
        <el-row class="add-member">
            <el-col :span="11" style="height: 100%;">
                <el-select v-model="filter" filterable remote reserve-keyword placeholder="搜索"
                    :remote-method="remoteSearch" :loading="searchLoading" @change="handleFilterChange">
                    <el-option v-for="item in searchoptions" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <div class="org">
                    <el-tree ref="orgTree" :data="orgTreeData" node-key="id" show-checkbox @check="handleCheckClick" highlight-current accordion>
                        <template #default="{ node, data }">
                            <span class="custom-tree-node hover-container">
                                <div class="label">{{ data.name }}</div>
                            </span>
                        </template>
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
import { OrganizationNode } from '@/models/organization';
import { getOrganizationTree, searchOrganizationNode } from '@/service/organization';
import { ref, onMounted } from 'vue';

const addMemberDialogvisible = ref(false);

const filter = ref('');
const orgTree = ref();
const orgTreeData = ref([])
const selected = ref([]);

// 远程搜索
const searchLoading = ref(false);
const searchoptions = ref<OrganizationNode[]>([]);

onMounted(() => {
    getOrganizationTree().then(res => {
        orgTreeData.value = res.data;
    });
});

const handleCheckClick = (node, obj) => {
    console.log(node, obj);
    selected.value = obj.checkedNodes;
    console.log('selected.value', selected.value)
};

const handleSelectedMemberDelete = () => {
    console.log('handleSelectedMemberDelete');
};

const remoteSearch = (query: string) => {
    searchLoading.value = true;
    searchOrganizationNode(query).then(res => {
        searchoptions.value = res.results;
    }).finally(() => {
        searchLoading.value = false;
    });
}

const handleFilterChange = (val) => {
    orgTree.value.store.nodesMap[id]?.expand() // 展开该节点
}
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