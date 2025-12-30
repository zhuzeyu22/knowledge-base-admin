<template>
    <div class="container">
        <el-dialog v-model="$props.visible" title="知识库权限" align-center width="500px" style="height: 500px;">
            <el-input class="input" v-model="searchName" type="text" placeholder="搜索" style="width: 120px; " :prefix-icon="Search"
                size="small" clearable/>
            <div class="scroll-container">
                <el-table :data="filteredData" @selection-change="handleSelectedRows" ref="tableRef">
                    <el-table-column type="selection" width="60" />
                    <el-table-column property="user" label="成员" width="260" />
                    <el-table-column property="permission" label="权限" width="120">
                        <template #default=scope>
                            <el-select v-model="scope.row.permission">
                                <el-option v-for="item in permissionOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="toolbar" v-if="selectedRows.length > 0">
                <span class="permission-text">{{ selectedRows.length }}名成员权限修改为
                <el-select v-model="selectedToolbarPermission" placeholder="请选择权限" style="width: 120px;">
                    <el-option 
                    v-for="item in permissionOptions" 
                    :key="item.value" 
                    :label="item.label"
                    :value="item.value" 
                    />
                </el-select></span>
                <span class="permission-button">
                   <el-button type="info" plain style="width:120px" @click="handleCancelSelection">取消</el-button>
                   <el-button type="primary" style="width:120px" @click="handleBatchUpdate">确认</el-button> 
                </span>
                
            </div>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, computed  } from 'vue'

const searchName = ref('')
// const dialogTableVisible = ref(true)
const selectedRows = ref([])
const tableRef = ref('')
const selectedToolbarPermission = ref('');
const props = defineProps<{
    visible:boolean;
    datasetId:string
}>();
const emit = defineEmits(['update:visible','refresh'])

const permissionOptions = [
    {
        value: 'management',
        label: '管理'
    },
    {
        value: 'collaboration',
        label: '协作'
    },
    {
        value: 'use',
        label: '使用'
    },
]

const filteredData = computed(() => {
    if (!searchName.value.trim()) {
        return MockData;
    }
    return MockData.filter(item => {
        return item.user.toLowerCase().includes(searchName.value.trim().toLowerCase());
    });
});
const MockData = [
    {
        user: '用户A',
        permission: 'collaboration',
    },
    {
        user: '用户B',
        permission: 'use',
    },
    {
        user: '用户C',
        permission: 'management',
    },
    {
        user: '用户D',
        permission: 'use',
    },

]
const handleSelectedRows = (rows:any) => {
    selectedRows.value = rows;
}
const handleCancelSelection = () => {
    tableRef.value?.clearSelection();
    selectedRows.value = [];
    selectedToolbarPermission.value = '';
}
const handleClose = () => {
    emit('update:visible',false)
}
</script>
<style scoped lang="scss">
.container {
    display: flex;
    position: relative;

    .scroll-container {
        height: 340px;
        overflow-x: hidden;
    }

    .input {
        position: absolute;
        right: 50px;
        top: 14px;
    }
    .toolbar {
        border-top: 1px solid;
        padding: 10px;
        :v-deep(.el-dialog){
            --el-dialog-padding-primary: 0px;
        }
        .permission-text {
            display: inline-block;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
        }
        .permission-button{
            display: flex;
            padding-top: 10px;
            justify-content: space-around;
            align-items: center;
        }
    }
}
</style>