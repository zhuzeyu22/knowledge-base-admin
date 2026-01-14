<template>
    <div class="container">
        <el-dialog v-model="dialogVisible" title="知识库权限" align-center width="500px" style="height: 500px;" >
            <el-input class="input" v-model="searchName" type="text" placeholder="搜索" :prefix-icon="Search"
                size="small" clearable/>
            <div class="scroll-container">
                <el-table :data="filteredData" @selection-change="handleSelectedRows" ref="tableRef">
                    <el-table-column type="selection" width="60" />
                    <el-table-column property="account_name" label="成员" width="220" >
                        <template #default=scope >
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <div>{{ scope.row.account_name }}</div>
                                <div v-if="scope.row.account_id == createdBy" class="token">创建</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column property="role_name" label="权限" width="120">
                        <template #default=scope>
                            <el-select class="select" :disabled="scope.row.account_id == id" v-model="scope.row.role_name" @change="(val:string)=>handlePermissionChange(val, scope.row)">
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
                   <el-button type="primary" style="width:100px" @click="handleBatchUpdate" >确认</el-button> 
                </span>
                
            </div>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, computed, watch  } from 'vue'
import { getTeamMemberPermissionList, putTeamMemberPermission } from '@/service/team';
import { ElMessage, ElTable } from "element-plus";
import { MemberPermission } from '@/models/team';

import { useUserStore } from '@/store/user';
const userStore = useUserStore()
const id = computed(() => userStore?.getUserInfo?.id)

const props = defineProps<{
    visible: boolean;
    datasetId: string;
    createdBy: string;
}>();
const emits = defineEmits(['update:visible','refresh'])

const searchName = ref('')
const selectedRows = ref<MemberPermission[]>([])
const tableRef = ref<InstanceType<typeof ElTable> | null>(null);
const selectedToolbarPermission = ref('');
const memberPermissionList = ref([]);
const datasetId = String(props.datasetId);
const createdBy = String(props.createdBy);

const dialogVisible = computed({
    get:()=> props.visible,
    set:(val)=> {
        emits('update:visible',val)
    }
})

const permissionOptions = [
    {
        value: '管理',
        role_name:'管理',
    },
    {
        value: '协作',
        role_name:'协作',
    },
    {
        value: '使用',
        role_name:'使用',
    },
]

const filteredData = computed(() => {
    if (!searchName.value.trim()) {
        console.log(memberPermissionList);
        return memberPermissionList.value;
    }
    return memberPermissionList.value.filter(item => {
        return item.account_name.toLowerCase().includes(searchName.value.trim().toLowerCase());
    });
});

const loadData = async() => {
    try {
        const res = await getTeamMemberPermissionList(datasetId);
        memberPermissionList.value = res.data.results;
        console.log(res)
    }
    catch(error:any) {
        console.log(error, memberPermissionList)
    }
} 

//修改单个成员权限
const handlePermissionChange = async(newRoleName:string, row:MemberPermission) => {
    try {
        const updatedMember:MemberPermission[] = [
            {
                id:row.id,
                role_name:newRoleName,
            }
        ]
        await putTeamMemberPermission(updatedMember);
        ElMessage.success('权限修改成功')
        loadData()
    } catch(error:any) {
        ElMessage.error('权限修改失败')
        console.log(error)
        loadData()
    }
}

//批量修改成员权限
const handleBatchUpdate = async () => {
    if(!selectedToolbarPermission.value) {
        ElMessage.warning('未选择权限')
        return
    }
    try {
        const updatedMembers:MemberPermission[] = selectedRows.value.map((row) =>{
            return {
                id: row.id,
                role_name: selectedToolbarPermission.value,  
            } as MemberPermission
        })
        await putTeamMemberPermission(updatedMembers);
        ElMessage.success("批量修改成功");
        handleCancelSelection();
        loadData(); 
    } catch(error:any) {
        ElMessage.error("修改失败");
        loadData();
    }
}

const handleSelectedRows = (rows:any) => {
    selectedRows.value = rows;
}
const handleCancelSelection = () => {
    tableRef.value?.clearSelection();
    selectedRows.value = [];
    selectedToolbarPermission.value = '';
}

watch(() => props.visible, (val) => {
    if(val) {
        loadData();
    }
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
        height: 300px;
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
.token {
  position: relative;
  left: 8px;
  border-radius: 4px;
  width: 32px;
  height: 16px;
  background-color: #8080ff;
  font-size: 10px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>