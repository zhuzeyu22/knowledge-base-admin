<template>
    <div class="container">
        <el-dialog v-model="dialogTableVisible" title="知识库权限" width="400" align-center :modal="false">
            <el-input class="input" type="text" placeholder="search" style="width: 120px;" :prefix-icon="Search" size="small"/>
            <el-table :data="MockData">
                <el-table-column type="selection" width="60"/>
                <el-table-column property="date" label="成员" width="200"/>
                <el-table-column property="" label="权限" width="60"/>
            </el-table>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue'

const dialogTableVisible = ref(true)
const MockData = [
    {
        user: '用户A',

    }
]
</script>
<style scoped lang="scss">
.container {
    display: flex;
    position: relative;
    .input {
        position: absolute;
        right: 50px;
        top: 14px;
    }
}
</style>