<template>
    <section class="section">
        <el-tree :data="data" node-key="id" :load="loadNode" lazy>
            <template #default="{ node, data }">
                <span class="custom-tree-node">
                    <span>{{ node.data.name }}</span>
                    <span>
                        <el-button type="text" @click="() => append(data)">
                        </el-button>
                        <el-button type="text" @click="() => remove(node, data)">
                        </el-button>
                    </span>
                </span>
            </template>
        </el-tree>
    </section>
</template>

<script setup lang="ts">
import { PublicFolderNode } from '@/models/public';
import { getFolder } from '@/service/public';
import { onMounted, ref } from 'vue';

const data = ref<PublicFolderNode[]>([])


onMounted(() => {
    getFolder().then(res => {
        // todo
    }).catch(err => {
        console.log(err)
    }).finally(() => {
        data.value = [{
            id: '1',
            name: '1',
            parentId: '',
            level: 0,
        }, {
            id: '2',
            name: '2',
            parentId: '',
            level: 0,
        }]
    })
});

function append(data: PublicFolderNode) {
    console.log(data)
}

function remove(node: any, data: any) {
    console.log(node, data)
}

function loadNode(node: any, resolve: any) {
    getFolder(node.id).then(res => {
        // todo
    }).catch(err => {
        console.log(err)
    }).finally(() => {
        resolve([{
            id: '12',
            name: 'last',
            parentId: '1',
            level: 0,
        }])
    })
}

const handleNodeCreate = (id: string = '') => {
}

defineExpose({
    handleNodeCreate
})
</script>

<style scoped lang="less">
.section {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>