<!-- 召回测试页面 -->
<template>
    <section class="hit-testing">
        <el-card class="card-wrapper">
            <el-row style="height: 100%;">
                <el-col :span="12">
                    <div style="margin-bottom: 20px;">
                        <div class="title">召回测试</div>
                        <div class="description">根据给定的查询文本测试知识的召回效果</div>
                    </div>
                    <div class="context">
                        <div class="title">
                            <i class="style_title-left-line"></i>
                            源文本
                        </div>
                        <el-input v-model="query" style="width: 100%" :rows="10" type="textarea" maxlength="200"
                            show-word-limit placeholder="请输入文本">
                        </el-input>
                        <el-button type="primary" style="margin-top: 10px; align-self: flex-end;"
                            @click="handleHitTesting">测试</el-button>
                    </div>

                    <div class="record">
                        <div class="title">
                            <i class="style_title-left-line"></i>
                            记录
                        </div>
                        <el-table :data="records" style="width: 100%">
                            <el-table-column prop="source" label="数据源" width="180" />
                            <el-table-column prop="content" label="文本" width="180" />
                            <el-table-column prop="created_at" label="时间">
                                <template #default="scope">
                                    {{ new Date(scope.row.created_at * 1000).toLocaleString('zh-CN') }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination size="small" layout="prev, pager, next" :page-size="limit" :current-page="page"
                            :total="total" />
                    </div>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary">测试</el-button>
                </el-col>
            </el-row>
        </el-card>
    </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getDatasetHitTestingRecords, postDatasetHitTesting, RetrievalModel } from '@/service/datasets';

const { datasetId, retrieval_model } = defineProps(['datasetId', 'retrieval_model'])

const records = ref([])
const limit = ref(10)
const page = ref(1)
const total = ref(1)
const query = ref<string>('')

const updateRecords = async () => {
    getDatasetHitTestingRecords(datasetId, limit.value, page.value)
        .then((res) => {
            records.value = res.data
            total.value = res.total
            page.value = res.page
            limit.value = res.limit
            console.log(total.value, page.value, limit.value)
        }).catch(error => {
            console.log(error)
        })
}

const handleHitTesting = async () => {
    postDatasetHitTesting(datasetId, { query: query.value, retrieval_model })
}

onMounted(() => {
    updateRecords()
})
</script>

<style lang="less" scoped>
.title {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 600;
}

.hit-testing {
    width: 100%;
    height: 100%;
}

.card-wrapper {
    width: 100%;
    height: 100%;

    :deep(.el-card__body) {
        height: 100%;
    }
}

.context {
    display: flex;
    flex-direction: column;
}

.record {
    flex-grow: 1;
}

.style_title-left-line {
    display: inline-block;
    width: 4px;
    height: 16px;
    background: #5169f0;
    border-radius: 2px;
    margin-right: 8px;
    color: #333;
}
</style>