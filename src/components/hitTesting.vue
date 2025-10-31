<!-- 召回测试页面 -->
<template>
    <section class="hit-testing">
        <el-card class="card-wrapper">
            <el-row style="height: 100%;">
                <el-col :span="11" style="height: 100%;">
                    <div class="left-wrapper">
                        <div style="margin-bottom: 20px;">
                            <div class="title">召回测试</div>
                            <div class="description">根据给定的查询文本测试知识的召回效果</div>
                        </div>
                        <div class="context">
                            <div class="title">
                                <i class="style_title-left-line"></i>
                                源文本
                            </div>
                            <el-input v-model="query" style="width: 100%" :rows="5" type="textarea" maxlength="200"
                                show-word-limit placeholder="请输入文本">
                            </el-input>
                            <el-button type="primary" style="margin-top: 10px; align-self: flex-end;"
                                :disabled="query.length == 0" @click="handleHitTesting">测试</el-button>
                        </div>
                        <div class="record">
                            <div class="title">
                                <i class="style_title-left-line"></i>
                                记录
                            </div>
                            <el-table :data="data" style="width: 100%">
                                <el-table-column prop="source" label="数据源" width="180" />
                                <el-table-column prop="content" label="文本" width="180" />
                                <el-table-column prop="created_at" label="时间">
                                    <template #default="scope">
                                        {{ new Date(scope.row.created_at * 1000).toLocaleString('zh-CN') }}
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination layout="prev, pager, next" :total="total" v-model:current-page="page"
                                v-model:page-size="limit" @change="handlePageChange" />
                        </div>
                    </div>
                </el-col>
                <el-col :span="2" style="height: 100%;">
                </el-col>
                <el-col :span="11" style="height: 100%;">
                    <div class="right-wrapper">
                        <div class="title">召回段落
                            <span>{{ records.length }} </span>
                        </div>
                        <el-card v-for="(item, index) in records" :key="index" class="card-item">
                            <!-- <template #header> -->
                            <div style="display: flex; justify-content: space-between">
                                <div>Chunk-{{ item.segment.position }}·{{ item.segment.word_count }} 字符</div>
                                <div>score{{ item.score.toFixed(2) }}</div>
                            </div>
                            <el-divider />
                            <!-- </template> -->
                            <div class="segment"> {{ item.segment.content }} </div>
                            <div class="tag">
                                <el-tag v-for="value in item.segment.keywords">{{ value }}</el-tag>
                            </div>
                            <!-- <template #footer> -->
                            <div>{{ item.segment.document.name }}</div>
                            <!-- </template> -->
                        </el-card>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getDatasetHitTestingRecords, postDatasetHitTesting } from '@/service/datasets';

const { datasetId, retrieval_model } = defineProps(['datasetId', 'retrieval_model'])

const records = ref([])
const data = ref([])
const limit = ref(10)
const page = ref(1)
const total = ref(1)
const query = ref<string>('')

const updateRecords = async () => {
    getDatasetHitTestingRecords(datasetId, limit.value, page.value)
        .then((res) => {
            data.value = res.data
            total.value = res.total | 0
            page.value = res.page | 0
            limit.value = res.limit | 0
            console.log(total.value, page.value, limit.value)
        }).catch(error => {
            console.log(error)
        })
}

const handleHitTesting = async () => {
    postDatasetHitTesting(datasetId, { query: query.value, retrieval_model }).then(res => {
        records.value = res.records
    })
}

const handlePageChange = (currentPage: number, pageSize: number) => {
    updateRecords()
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

.description {
    font-size: 14px;
    font-weight: 400;
    color: #676f83;
}

.hit-testing {
    width: 100%;
    height: 100%;
}

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

    .record {
        display: flex;
        flex-direction: column;
        grow-flex: 1;
        overflow: auto;
    }

}

.right-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;

    .card-item {
        margin-bottom: 10px;
        cursor: pointer;

        .segment {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.5;
            max-height: 3em;
        }

        .tag {
            // display: flex;
            // gap: 0.5rem;
            // flex-wrap: wrap
            // display: inline-block;
            // margin: 0 8px 8px 0;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 4px;
        }

        :deep(.el-card__header) {
            padding: 16px;
        }

        :deep(.el-card__body) {
            padding: 16px;
            // height: 100px;
        }
    }
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

.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
</style>