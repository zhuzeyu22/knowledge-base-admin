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
                    <el-tree ref="orgTreeRef" :data="orgTreeData" node-key="id" show-checkbox @check="handleCheckClick" highlight-current accordion>
                        <template #default="{ node, data }">
                            <div>{{ data.name }}</div>
                        </template>
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="2" style="height: 100%;">
            </el-col>

            <el-col :span="11" style="height: 100%;">
                <div style="height: calc(100% - 50px); overflow-y: auto;">
                    <div v-for="data in selected" class="custom-tree-node">
                        <div class="label">{{ data.name }}</div>
                        <div placement="bottom-end" class='delete-icon'>
                            <div @click="() => handleSelectedMemberDelete(data)">删除</div>
                        </div>
                    </div>
                </div>
                <span class="dialog-footer">
                    <el-button type="primary" @click='handleEnsureClick'>确 定</el-button>
                    <el-button @click="addMemberDialogvisible = false">取 消</el-button>
                </span>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script setup lang="ts">
import { OrganizationNode } from '@/models/organization';
import { getOrganizationTree, searchOrganizationNode } from '@/service/organization';
import { postUser } from '@/service/team';
import { ref, onMounted, watch, computed } from 'vue';
import router from "@/router";

const emit = defineEmits(["add"]);

const addMemberDialogvisible = ref(false);

const filter = ref('');
const orgTreeRef = ref();
const orgTreeData = ref<OrganizationNode[]>([])
const selected = ref([]);

// 远程搜索
const searchLoading = ref(false);
const searchoptions = ref<OrganizationNode[]>([]);
const tenantId = computed(() => String(router.currentRoute.value.params.teamId));

onMounted(()=>{
    getOrganizationTree().then(res => {
        orgTreeData.value = res.tree;
    });
});

watch(
    addMemberDialogvisible,
    (addMemberDialogvisible) =>{
        if(addMemberDialogvisible){
            getOrganizationTree().then(res => {
                orgTreeData.value = res.tree;
            });
        }
    },
    {
        deep: true
    }
)

const handleCheckClick = (node, obj) => {
    console.log(node, obj);
    selected.value = obj.checkedNodes.filter(n => n.type == 'user')
    console.log('selected.value', selected.value)
};

const handleSelectedMemberDelete = (data) => {
    const ckeys = selected.value
    const nkeys = ckeys.reduce((acc, curr) =>{
        if(curr.id !== data.id){
            acc.push(curr)
        }
        return acc
    },[])
    selected.value = nkeys
    orgTreeRef.value.setCheckedNodes(nkeys)
};

const remoteSearch = (query: string) => {
    searchLoading.value = true;
    searchOrganizationNode(query).then(res => {
        searchoptions.value = res.results;
    }).finally(() => {
        searchLoading.value = false;
    });
}


const highlightNode = (id: string) => {
    if (!orgTreeRef.value) return

    // 1. 【关键】先收起所有根节点（清空展开状态）
    // todo 不知道为啥没生效

    // 2. 递归展开目标路径
    expandPathTo(id)

    // 3. 高亮目标节点
    orgTreeRef.value.setCurrentKey(id)
}

// 辅助：递归展开从根到目标节点的路径 
const expandPathTo = (targetId: string) => {
  const expandNode = (nodeId: string) => {
    const node = orgTreeRef.value?.store.nodesMap[nodeId]
    if (node) {
      node.expand()
      if (node.parent && node.parent.id !== 'root') {
        expandNode(node.parent.key)
      }
    }
  }
  expandNode(targetId)
}

const handleFilterChange = (id) => {
    console.log('id', id)
    highlightNode(id)
    // orgTreeRef.value.
    // orgTreeRef.value?.setCurrentKey(id)
}

// todo
const handleEnsureClick = () => {
    const users = selected.value.map(s => {
        const user = s.code
        const name = s.name
        return { user, name }
    })
    let t = tenantId.value
    console.log('handleEnsureClick', t)
    postUser(t, users).then(()=>{
        console.log('handleEnsureClick add')
        emit("add");
    })
}

</script>

<style scoped lang="less">
.add-member {
    height: 60vh;
    overflow: hidden;
}

:deep(.org) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 40px);
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