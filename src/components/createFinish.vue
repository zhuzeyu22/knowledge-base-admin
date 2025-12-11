<template>
    <el-card class="card-wrapper">
        <el-row style="height: 100%">
            <el-col :span="11" style="height: 100%">
                <div class="left-wrapper">
                    <div style="margin-bottom: 20px">
                        <div class="title">知识库已创建</div>
                        <div class="description">
                            我们自动为该知识库起了个名称，您也可以随时修改
                        </div>
                    </div>
                    <div class="context">
                        <div class="title">知识库名称: {{ dataset.dataset.name }}</div>
                    </div>
                    <el-divider></el-divider>
                    <div style='margin-bottom: 10px; font-weight: bold;' :class="status == '嵌入发生错误' ? 'warning' : ''">
                        {{ status }}
                    </div>
                    <div style="flex-grow: 1">
                        <section v-for="file in statusList" style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        ">
                            <el-row>
                                <el-col :span="12">{{ file.name }}</el-col>
                                <el-col :span="12" style="display: flex; flex-direction: row-reverse;"
                                    :class="file.indexing_status == 'error' ? 'warning' : ''">
                                    <el-icon v-if="
                                        file.indexing_status == 'completed'
                                    " style="margin-left: 16px;">
                                        <SuccessFilled style="color: green" />
                                    </el-icon>
                                    <el-progress v-else type="dashboard" :width="16" style="margin-left: 16px;"
                                        :percentage="file.percentage" status="success">
                                    </el-progress>
                                    <div>
                                        {{
                                            file.indexing_status == "completed"
                                                ? "处理完成"
                                                : file.indexing_status == "error"
                                                    ? "处理失败"
                                                    : "处理中..."
                                        }}
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row v-if="file.indexing_status == 'error'" class="warning"
                                style="margin-top: 4px; font-size: 10px;">
                                {{ file.error }}
                            </el-row>
                        </section>
                    </div>
                    <el-button style="align-self: flex-end" type="primary" @click="handleClick()">前往文档</el-button>
                </div>
            </el-col>
            <el-col :span="2" style="height: 100%"> </el-col>
            <el-col :span="11" style="height: 100%"> </el-col>
        </el-row>
    </el-card>
</template>

<script setup lang="ts">
import { getIndexingStatus } from "@/service/datasets";
import { ref, watch, onMounted, computed, onBeforeMount } from "vue";
import router from "@/router";

enum IndexingStatus {
    Parsing = "parsing",
    Indexing = "indexing",
    Completed = "completed",
    Error = "error",
    Splitting = "splitting"
}

type FileStatus = {
    id: string
    name: string
    indexing_status: IndexingStatus
    total_segments: number
    completed_segments: number
    percentage: number
    error?: string
}

const { dataset } = defineProps(["dataset"]);

const statusList = ref<FileStatus[]>([]);

onBeforeMount(() => {
    statusList.value = dataset.documents.map((file: { id: any; name: any; }) => {
        return {
            id: file.id,
            name: file.name,
            indexing_status: IndexingStatus.Parsing,
            total_segments: 1,
            completed_segments: 0,
            percentage: 0
        };
    });
})

// a computed ref
const status = computed(() => {
    if (statusList.value.find((x) => x.indexing_status == IndexingStatus.Error)) {
        return '嵌入发生错误'
    } else if (statusList.value.find((x) => x.indexing_status == IndexingStatus.Completed)) {
        return '嵌入已完成'
    } else {
        return '嵌入处理中'
    }
});

onMounted(() => {
    updateStatus();
});
const updateStatus = () => {
    getIndexingStatus(dataset.dataset.id, dataset.batch).then((res) => {
        statusList.value = statusList.value.map(s => {
            const find = res.data.find(x => x.id == s.id)
            find.percentage = 0
            if (find && Number(find.total_segments) != 0) {
                find.percentage = (Number(find.completed_segments) * 100 / Number(find.total_segments)).toFixed(2)
            }

            return {
                ...s,
                ...find,
            }
        })

        if (status.value == '嵌入处理中') {
            setTimeout(() => {
                updateStatus();
            }, 5 * 1000);
        }
    });
};

const handleClick = () => {
    router.push({
        name: "details",
        query: { id: dataset.dataset.id },
    });
};
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

.warning {
    color: #f56c6c;
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
