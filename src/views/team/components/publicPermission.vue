<template>
    <div class="container">
        <el-dialog v-model="dialogVisible" @update="handleClose" title="公开到公共知识库" align-center width="600px"
            style="height: 500px;">
            <span class="container-text">公开知识库
                <span style="font-weight: 700">“{{ datasetName }}”</span>到公共知识库，请选择公开的域名：</span>
            <el-select v-model="selectedValues" popper-class="tree-select-dropdown"  multiple
                placeholder="请选择公开的域名" :teleported="false" @remove-tag="handleRemoveTag">
                <el-option value="" style="min-height: 200px;" class="tree-option">
                    <el-tree ref='publicTree' :data="folderTree" class="tree-ul" show-checkbox node-key="id" :props="treeProps"
                        @check="handleDomainNameTag" :load="loadNode" lazy @node-click='handleNodeClick'>
                          <template #default="{ data }">
                            <span class="custom-tree-node hover-container">
                                <div class="label">{{ data.name }}</div>
                            </span>
                        </template>
                    </el-tree>
                </el-option>
            </el-select>
            <div class="warning"><el-icon size="25px"><WarningFilled /></el-icon>知识库公开至公共知识库域后，全行均可查看使用</div>
            <div class="button">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleKnowledgePublic">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage, ElTree } from 'element-plus'
import { usePublicStore } from '@/store/public'
import { getDatasetFolder, postKnowledgePublic } from '@/service/team'
import { useRoute } from "vue-router";

const route = useRoute()
const tenantName = route.query.tenant_name
console.log("name",tenantName)
const publicStore = usePublicStore()

const folderTree = computed(() => publicStore.folderTree)

interface Tree {
    id:string
    name: string
    children?: Tree[]
}

const props = defineProps<{
    visible: boolean;
    datasetName: string;
    datasetId:string;
}>();
const dialogVisible = computed({
    get:()=> props.visible,
    set:(val)=> {
        emits('update:visible',val)
    }
})
const emits = defineEmits(['update:visible','success'])
const selectedValues = ref<string[]>([])
const publicTree = ref<InstanceType<typeof ElTree>>()

function loadNode(node: any, resolve: any) {
    publicStore.getNodeChildren(node.data).then((res) => {
        console.log('loadNode res11', res)
        resolve(res)
    }).catch((err) => {
        console.log(err)
        ElMessage({
            type: "warning",
            message: "加载失败",
        });
        resolve([])
    })
}

const handleNodeClick = () =>{
    // todo
}

watch(() => props.visible, async (val) => {
    if (val) {
        await initSelectedData();
    } else {
        
        selectedValues.value = [];
        if (publicTree.value) {
            publicTree.value.setCheckedKeys([]);
        }
    }
});

const initSelectedData = async () => {
    try {
        const res = await getDatasetFolder(props.datasetId);
        const serverSelectedIds = res.data; 
        await nextTick();

        if (publicTree.value && serverSelectedIds.length > 0) {
            publicTree.value.setCheckedKeys(serverSelectedIds);
            const tags: string[] = [];
            for (const id of serverSelectedIds) {
                const treeNode = publicTree.value.getNode(id);
                if (treeNode) {
                    tags.push(getNodePath(treeNode));
                } else {
                    const pathStr = getPathFromStore(id);
                    if(pathStr) tags.push(pathStr);
                }
            }
            selectedValues.value = tags;
        }
    } catch (error) {
        console.error('获取已公开目录失败');
    }
};

// 【辅助】从 Store 的 nodeMap 中回溯路径 (解决懒加载未渲染 DOM 导致 getNode 为空的问题)
const getPathFromStore = (id: string): string => {
    const nodeMap = publicStore.nodeMap; 
    let currentNode = nodeMap[id];
    if (!currentNode) return ''; 
    const pathArr: string[] = [];
    while (currentNode) {
        pathArr.unshift(currentNode.name);
        if (currentNode.parent_id) {
            currentNode = nodeMap[currentNode.parent_id];
        } else {
            break;
        }
    }
    return pathArr.join('-');
}
const treeProps = ref({
    name: 'name',
    children: 'children',
    class: (data: Tree, node: any) => {
        if (!node.isLeaf) {
            return 'hide-checkout'
        }
        return 'no-hide-checkout'
    }
});
const getNodePath = (node:any):string=> {
    const path:string[] = [];
    let current = node;
    while(current && current.level > 0){
        path.unshift(current.data.name);
        current = current.parent;
    }
    return path.join('-')
}
const handleClose = (val: boolean) => {
    emits('update:visible', val)
}
const checkedNodesId = computed(() => {
    if(!publicTree.value) return [];
    const checkedNodes = publicTree.value.getCheckedNodes(true,false);
    return checkedNodes.map(node => node.id)
})
const handleRemoveTag = (tagToRemove:string) => {
    if (!publicTree.value) return;
    //获取all选中节点
    const checkedNodes = publicTree.value.getCheckedNodes(true,false)
    //遍历，找和要删除的tag相同的路径
    const targetNode = checkedNodes.find(data => {
        const node = publicTree.value!.getNode(data.id);
        const path = getNodePath(node)
        return path === tagToRemove;
    })
    //找到，用id取消
    if(targetNode){
        publicTree.value.setChecked(targetNode.id, false, false); 
    }
    
}
const handleDomainNameTag = () => {
    if (!publicTree.value) return;
    const checkedNodes = publicTree.value.getCheckedNodes(true, false);
    selectedValues.value = checkedNodes.map(data => getNodePath(publicTree.value!.getNode(data)));
}

const MockData: Tree[] = [
    {
        id:'1',
        name: '科技',
        children: [
            {
                id:'1.1',
                name: '开发',
                children: [
                    {
                        id:'1.1.1',
                        name: '规范'
                    },
                    {
                        id:'1.1.2',
                        name: '操作手册'
                    }
                ],
            }
        ],
    },
    {
        id:'2',
        name: '对公',
        children: [
            {
                id:'2.1',
                name: '公布',
                children: [
                    {
                        id:'2.1.1',
                        name: '文档'
                    },
                    {
                        id:'2.1.2',
                        name: '知识库'
                    },
                    {
                        id:'2.1.3',
                        name: '规范'
                    },
                    {
                        id:'2.1.4',
                        name: '操作手册'
                    }
                ],
            }
        ],
    },
    
]

const handleKnowledgePublic = async () => {
    if (!publicTree.value) return;
    try {
        await postKnowledgePublic(tenantName as string, checkedNodesId.value as string[], props.datasetId);
        ElMessage.success('公开成功')
        dialogVisible.value = false;
        emits('success');
    } catch (error:any) {
        ElMessage.error("公开失败")
    }
}
</script>
<style scoped lang="scss">
.container {
    position: relative;
    :deep(.el-dialog) {
        padding: 40px;
    }
    .container-text {
        display: inline-block;
        font-size: 17px;
        margin: 5px 0 10px;
    }

    .warning {
        display: flex;
        position: absolute;
        align-items: center;
        bottom: 80px;
    }
    .button {
        position: absolute;
        bottom: 40px;
        right: 50px;
    }
    :deep(.tree-select-dropdown) {
        position: relative;
        top: calc(100% + 10px) !important;
        left: 0 !important; //对齐输入框左侧
        .el-select-dropdown__item {
            background-color: transparent;
            
        }
        .tree-option{
            overflow: auto; 
            .tree-ul {
            .hide-checkout {
                >.el-tree-node__content .el-checkbox {
                    //只选择子元素，不然会波及到叶子节点
                    display: none;
                }
            }
        }
        }
    }
}
</style>