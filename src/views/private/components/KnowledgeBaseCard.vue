<template>
    <el-card @click="goToDetails">
        <div class="knowledge-base-card">
            <!-- <el-image class="knowledge-base-card-image" :src="dataset.imageUrl" fit="fill" /> -->
            <el-icon class="knowledge-base-card-image">
                <Folder style="width: 50px; height: auto;" />
            </el-icon>
            <div class="knowledge-base-card-name">{{ dataset.name }}</div>
            <div class="knowledge-base-card-tags">
                <el-tag type="info">{{ dataset.documentNumber }} 文档</el-tag>
                <el-tag type="info">{{ (dataset.word_count / 1000).toFixed(1) }} 千字符</el-tag>
            </div>
            <div class="knowledge-base-card-description">{{ dataset.description }}</div>

            <div class="knowledge-base-card-label">{{ dataset.isOfficial ? '官方' : '非官方' }}</div>
            <div class="knowledge-base-card-operate" @click.stop>
                <el-dropdown trigger="click" placement="bottom-end">
                    <el-icon style="cursor: pointer">
                        <MoreFilled />
                    </el-icon>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <!-- <el-dropdown-item @click="updateUserDialogVisible = true">共享</el-dropdown-item> -->
                            <el-dropdown-item divided>删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </el-card>
    <el-dialog v-model="updateUserDialogVisible" title="添加成员" width="800">

    </el-dialog>
</template>

<script lang="ts" setup>
import { MoreFilled } from '@element-plus/icons-vue'
import { Dataset } from '@/models/dataset';
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
    dataset: Dataset;
}>()

const router = useRouter()
const updateUserDialogVisible = ref(false)

// 跳转到详情页
const goToDetails = () => {
    router.push({
        name: 'details',
        query: { id: props.dataset.id }
    })
}
// 定义节点类型
interface TreeNode {
    id: number | string
    label: string
    children?: TreeNode[]
    disabled?: boolean
}

const data: TreeNode[] = [
    {

        id: 1,
        label: '节点1',
        children: [
            {
                id: 2,
                label: '节点1-1',
                children: []
            },
            {
                id: 3,
                label: '节点1-2',
                children: []
            }
        ]
    },
    {
        id: 4,
        label: '节点2',
        children: []
    }
]

</script>

<style scoped>
.knowledge-base-card {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 200px;
    flex-shrink: 0;
    height: 200px;
    flex-grow: 1;
    align-items: center;
}

.knowledge-base-card-image {
    width: 70px;
    height: 70px;
    margin-bottom: 4px;
    border-radius: 8px;
}

.knowledge-base-card-name {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 4px;
}

.knowledge-base-card-tags {
    margin-bottom: 4px;
}

.knowledge-base-card-description {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
}

.knowledge-base-card-label {
    position: absolute;
    top: 0px;
    left: 0px;
    font-size: 12px;
    background-color: #3b82f6;
    color: white;
    padding: 1px 12px;
    border-radius: 3px;
}

.knowledge-base-card-operate {
    position: absolute;
    top: 0px;
    right: 0px;
}

.dialog-content {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: 20px;
}
</style>
