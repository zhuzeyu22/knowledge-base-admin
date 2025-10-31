<template>
    <el-card class="card-wrapper">
        <el-row style="height: 100%;">
            <el-col :span="11" style="height: 100%;">
                <div class="left-wrapper">
                    <div style="margin-bottom: 20px;">
                        <div class="title">知识库已创建</div>
                        <div class="description">我们自动为该知识库起了个名称，您也可以随时修改</div>
                    </div>
                    <div class="context">
                        <div class="title">
                            知识库名称: {{ dataset.documents[0].name }}
                        </div>
                    </div>
                    <el-divider></el-divider>
                    <div>
                        {{ status ? '嵌入已完成' : '嵌入处理中' }}
                    </div>
                    <div v-for="file in dataset.documents"
                        style="display: flex; justify-content: space-between; align-items: center">
                        <div>{{ file.name }}
                        </div>
                        <div>
                            {{indexingStatus.find(item => item.id === file.id)?.indexing_status == 'completed' ? '处理完成'
                                : '处理中...'}}
                        </div>
                    </div>
                    <el-button :disabled="!status" type="primary" @click="handleClick()">前往文档</el-button>
                </div>
            </el-col>
            <el-col :span="2" style="height: 100%;">
            </el-col>
            <el-col :span="11" style="height: 100%;">

            </el-col>
        </el-row>
    </el-card>
</template>

<script setup lang="ts">
import { getIndexingStatus } from '@/service/datasets';
import { ref, watch, onMounted, computed } from 'vue'
import router from '@/router';
import { useRoute } from 'vue-router'

const { dataset } = defineProps(['dataset', 'files'])


const indexingStatus = ref([])

// a computed ref
const status = computed(() => {
    return !Boolean(indexingStatus.value.find(x => x.indexing_status != 'completed'))
})

onMounted(() => {
    updateStatus()
})
const updateStatus = () => {
    getIndexingStatus(dataset.dataset.id, dataset.batch).then(res => {
        console.log('res', res)
        indexingStatus.value = res.data

        if (status.value !== true) {
            setTimeout(() => {
                updateStatus()
            }, 5 * 1000);
        }
    })
}

const handleClick = () => {
    router.push({
        name: 'details',
        query: { id: dataset.dataset.id }
    })
}
</script>

<style lang="less" scoped>
.card-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
        height: 100%;
    }
}

.left-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .context {
        display: flex;
        flex-direction: column;
    }


}

.right-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;

}

.title {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 600;
}

.description {
    font-size: 14px;
    font-weight: 400;
    color: #676f83;
}
</style>