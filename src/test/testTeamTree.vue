<template>
    <section class="section">
        <el-tree :data="data" node-key="id" :load="loadNode" lazy>
            <template #default="{ node, data }">
                <span class="custom-tree-node">
                    <span>{{ node.data.name }}</span>
                    <span>
                        <el-button type="text" @click="() => remove(node, data)">
                        </el-button>
                    </span>
                </span>
            </template>
        </el-tree>
    </section>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"
const data = ref<[]>([])

const loadNode = (node: any, resolve: any) => {
}


</script>

<style scoped lang="less">
.section {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
</style>