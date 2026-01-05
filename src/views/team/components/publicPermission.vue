<template>
    <div class="container">
        <el-dialog v-model="dialogVisible" @update="handleClose" title="公开到公共知识库" align-center width="600px"
            style="height: 500px;">
            <span class="container-text">公开知识库
                <span style="font-weight: 700">“{{ datasetName }}”</span>到公共知识库，请选择公开的域名：</span>
            <el-select v-model="selectedValues" popper-class="tree-select-dropdown"  multiple
                placeholder="请选择公开的域名" :teleported="false" @remove-tag="handleRemoveTag">
                <el-option value="" style="min-height: 200px;" class="tree-option">
                    <el-tree ref="treeRef" :data="MockData" class="tree-ul" show-checkbox node-key="id" :props="treeProps"
                        @check="handleDomainNameTag"></el-tree>
                </el-option>
            </el-select>
            <div class="warning"><el-icon size="25px"><WarningFilled /></el-icon>知识库公开至公共知识库域后，全行均可查看使用</div>
            <div class="button">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElTree } from 'element-plus'
interface Tree {
    id:string
    label: string
    children?: Tree[]
}

const props = defineProps<{
    visible: boolean;
    datasetName: string;
}>();
const dialogVisible = computed({
    get:()=> props.visible,
    set:(val)=> {
        emits('update:visible',val)
    }
})
const emits = defineEmits(['update:visible'])
const selectedValues = ref<string[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()

const treeProps = ref({
    label: 'label',
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
        path.unshift(current.label);
        current = current.parent;
    }
    return path.join('-')
}
const handleClose = (val: boolean) => {
    emits('update:visible', val)
    console.log(val)
}
const handleRemoveTag = (tagToRemove:string) => {
    if (!treeRef.value) return;
    //获取all选中节点
    const checkedNodes = treeRef.value.getCheckedNodes(true,false)
    //遍历，找和要删除的tag相同的路径
    const targetNode = checkedNodes.find(data => {
        const node = treeRef.value!.getNode(data.id);
        const path = getNodePath(node)
        return path === tagToRemove;
    })
    //找到，用id取消
    if(targetNode){
        treeRef.value.setChecked(targetNode.id, false, false); 
    }
    
}
const handleDomainNameTag = () => {
    if (!treeRef.value) return;
    const checkedNodes = treeRef.value.getCheckedNodes(true, false);
    selectedValues.value = checkedNodes.map(data => getNodePath(treeRef.value!.getNode(data)));
}

const MockData: Tree[] = [
    {
        id:'1',
        label: '科技',
        children: [
            {
                id:'1.1',
                label: '开发',
                children: [
                    {
                        id:'1.1.1',
                        label: '规范'
                    },
                    {
                        id:'1.1.2',
                        label: '操作手册'
                    }
                ],
            }
        ],
    },
    {
        id:'2',
        label: '对公',
        children: [
            {
                id:'2.1',
                label: '公布',
                children: [
                    {
                        id:'2.1.1',
                        label: '文档'
                    },
                    {
                        id:'2.1.2',
                        label: '知识库'
                    },
                    {
                        id:'2.1.3',
                        label: '规范'
                    },
                    {
                        id:'2.1.4',
                        label: '操作手册'
                    }
                ],
            }
        ],
    },
    
]

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
        left: calc(100% - 100%) !important; //对齐输入框左侧
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