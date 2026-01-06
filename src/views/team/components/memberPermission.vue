<template>
    <div class="container">
        <el-dialog v-model="dialogVisible" title="知识库权限" align-center width="500px" style="height: 500px;" >
            <el-input class="input" v-model="searchName" type="text" placeholder="搜索" :prefix-icon="Search"
                size="small" clearable/>
            <div class="scroll-container">
                <el-table :data="filteredData" @selection-change="handleSelectedRows" ref="tableRef">
                    <el-table-column type="selection" width="60" />
                    <el-table-column property="account_name" label="成员" width="240" />
                    <el-table-column property="role_name" label="权限" width="120">
                        <template #default=scope>
                            <el-select class="select" v-model="scope.row.permission" @change="handlePermissionChange(val, scope.row)">
                                <el-option v-for="item in permissionOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="toolbar" v-if="selectedRows.length > 0">
                <span class="permission-text">{{ selectedRows.length }}名成员权限修改为
                <el-select class="select" v-model="selectedToolbarPermission" placeholder="请选择权限" style="width: 120px;">
                    <el-option 
                    v-for="item in permissionOptions" 
                    :key="item.value" 
                    :label="item.label"
                    :value="item.value" 
                    />
                </el-select></span>
                <span class="permission-button">
                   <el-button type="info" plain style="width:100px" @click="handleCancelSelection">取消</el-button>
                   <el-button type="primary" style="width:100px" @click="handleBatchUpdate">确认</el-button> 
                </span>
                
            </div>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, computed, onMounted  } from 'vue'
import { getTeamMemberPermissionList } from '@/service/team';
import { ElTable } from "element-plus";
import { MemberPermission } from '@/models/team';

const props = defineProps<{
    visible:boolean;
    datasetId:string
}>();
const emits = defineEmits(['update:visible','refresh'])

const searchName = ref('')
const selectedRows = ref<MemberPermission[]>([])
const tableRef = ref<InstanceType<typeof ElTable> | null>(null);
const selectedToolbarPermission = ref('');
const memberPermissionList = ref<MemberPermission[]>([]);
const datasetId = String(props.datasetId);
// interface MemberPermission {
//   account_name: string,
//   role_name: string,
// }

const dialogVisible = computed({
    get:()=> props.visible,
    set:(val)=> {
        emits('update:visible',val)
    }
})


const permissionOptions = [
    {
        value: '管理',
        label: '管理'
    },
    {
        value: '协作',
        label: '协作'
    },
    {
        value: '使用',
        label: '使用'
    },
]

const MockData = [
    {
        account_name: '用户A',
        role_name: '协作',
    },
    {
        account_name: '用户B',
        role_name: '使用',
    },
    {
        account_name: '用户C',
        role_name: '管理',
    },
    {
        account_name: '用户D',
        role_name: '使用',
    },

]
const loadData = () => {
    getTeamMemberPermissionList(datasetId)
    .then((res)=>{
        memberPermissionList.value = res.data.results;
    })
    .catch((error:any) => {
        memberPermissionList.value = MockData;
        console.log(memberPermissionList)
    })
} 
const filteredData = computed(() => {
    if (!searchName.value.trim()) {
        console.log(memberPermissionList);
        return memberPermissionList.value;
    }
    return memberPermissionList.value.filter(item => {
        return item.account_name.toLowerCase().includes(searchName.value.trim().toLowerCase());
    });
});
const handlePermissionChange = async(newRowName:string, row:MemberPermission) => {
    
}
const handleSelectedRows = (rows:any) => {
    selectedRows.value = rows;
}
const handleCancelSelection = () => {
    tableRef.value?.clearSelection();
    selectedRows.value = [];
    selectedToolbarPermission.value = '';
}
onMounted(()=>{
    loadData()
})
</script>
<style scoped lang="scss">
.container {
    display: flex;
    position: relative;
    :deep(.el-dialog) {
        padding: 40px;
    }
    .select {
        :deep(.el-select__wrapper){
            box-shadow: none;
        }
        :deep(.el-select__wrapper:hover) {
            background-color: transparent;
            box-shadow: none; 
        }
        :deep(.el-select__placeholder){
            color:#409eff;
        }
    }
    .scroll-container {
        overflow-x: hidden;
        :deep(.el-select__wrapper) {
        background-color: transparent !important;
        box-shadow: none !important; 
    }
    }

    .input {
        position: absolute;
        right: 50px;
        top: 34px;
        width: 120px;
    }
    .toolbar {
        position: absolute;
        bottom: 10px;
        left: 0px;
        border-top: 1px solid;
        padding: 10px;
        width: 100%;
        :v-deep(.el-dialog){
            --el-dialog-padding-primary: 10px;
        }
        .permission-text {
            display: inline-block;
            display: flex;
            justify-content: space-around;
            align-items: center;
            font-size: 16px;
        }
        .permission-button{
            display: flex;
            padding-top: 20px;
            justify-content: space-around;
            align-items: center;
        }
    }
}
</style>