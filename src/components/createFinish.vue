<template>
    <el-row class="wrapper" :gutter="10">
        <el-col :span="12">
            <div class="left">
                <div style='margin-bottom: 10px; font-weight: bold;' :class="status == '嵌入发生错误' ? 'warning' : ''">
                    {{ status }}
                </div>
                <div class="file-list">
                    <section v-for="file in statusList">
                        <div class="file-info">
                            <img v-if="file.ext === 'pdf'" src="@/assets/dataset-setting/file-icon/pdf.png" width="24"
                                alt="" />
                            <img v-else-if="file.ext === 'doc'" src="@/assets/dataset-setting/file-icon/doc.png"
                                width="24" alt="" />
                            <img v-else-if="file.ext === 'docx'" src="@/assets/dataset-setting/file-icon/docx.png"
                                width="24" alt="" />
                            <img v-else-if="file.ext === 'html'" src="@/assets/dataset-setting/file-icon/html.png"
                                width="24" alt="" />
                            <img v-else-if="file.ext === 'markdown'"
                                src="@/assets/dataset-setting/file-icon/markdown.png" width="24" alt="" />
                            <img v-else-if="file.ext === 'md'" src="@/assets/dataset-setting/file-icon/markdown.png"
                                width="24" alt="" />
                            <img v-else-if="file.ext === 'csv'" src="@/assets/dataset-setting/file-icon/csv.png"
                                width="24" alt="" />
                            <img v-else-if="file.ext === 'txt'" src="@/assets/dataset-setting/file-icon/txt.png"
                                width="24" alt="" />
                            <img v-else-if="file.ext === 'xls'" src="@/assets/dataset-setting/file-icon/xls.png"
                                width="24" alt="" />
                            <img v-else-if="file.ext === 'xlsx'" src="@/assets/dataset-setting/file-icon/xlsx.png"
                                width="24" alt="" />
                            <div class="file-details ellipsis">
                                <div class="file-name ellipsis">
                                    <div> {{ file.name }}</div>
                                    <div> {{ file.percentage }} %</div>
                                </div>
                                <div v-if="file.indexing_status == 'error'" class="warning"> {{ file.error }}
                                </div>
                                <el-progress v-else :percentage="file.percentage" :show-text="false"> </el-progress>
                            </div>
                        </div>
                    </section>
                    <el-row :gutter="10" style="margin-top: 8px;">
                        <el-col :span="12">
                            <div class="title">分段模式</div>
                            <div class="context">{{ ProcessModeText[process_rule as ProcessMode] }}</div>
                        </el-col>
                        <el-col :span="12">
                            <div class="title">分段最大长度</div>
                            <div class="context">{{ max_tokens }}</div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-top: 8px;">
                        <el-col :span="12">
                            <div class="title">文本预处理规则</div>
                            <div v-if="pre_processing_rules[0].enabled" class="context">替换掉连续的空格、换行符和制表符</div>
                            <div v-if="pre_processing_rules[1].enabled" class="context">删除所有 URL 和电子邮件地址</div>
                        </el-col>
                        <el-col :span="12">

                        </el-col>
                    </el-row>
                </div>
                <el-button style="align-self: flex-end;" type="primary" @click="handleClick()" size="small">
                    前往文档
                </el-button>
            </div>
        </el-col>
        <el-col :span="12" class="right">
            <img src="@/assets/dataset-setting/processing-file.png" alt="" width="60%">
            <div>嵌入中，请稍等…</div>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { getIndexingStatus } from "@/service/datasets";
import { ref, watch, onMounted, computed, onBeforeMount } from "vue";
import router from "@/router";
import { DataSourceType, DataSourceTypeText, ProcessMode, ProcessModeText } from "@/models/dataset";

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

const { dataset, process_rule, max_tokens, pre_processing_rules } = defineProps(["dataset", "process_rule", "max_tokens", "pre_processing_rules"]);

const statusList = ref<FileStatus[]>([]);

onBeforeMount(() => {
    statusList.value = dataset.documents.map((file: { id: any; name: any; }) => {
        return {
            id: file.id,
            name: file.name,
            indexing_status: IndexingStatus.Parsing,
            total_segments: 1,
            completed_segments: 0,
            percentage: 0,
            ext: file.name.split(".").pop(),
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
        return '嵌入中...'
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
            if (find) {
                if (Number(find.total_segments) != 0) {
                    find.percentage = (Number(find.completed_segments) * 100 / Number(find.total_segments)).toFixed(2)
                } else {
                    find.percentage = Number(100).toFixed(2)
                }
            }

            return {
                ...s,
                ...find,
            }
        })

        if (status.value == '嵌入中...') {
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
.wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .left {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

}

.warning {
    color: #f56c6c;
}

.file-list {
    flex: 1;
}

.file-info {
    display: flex;
    align-items: center;
    flex: 1;
    overflow-x: hidden;
    padding: 8px;
    background: #F9FBFF;
    border-radius: 8px;
    border: 1px solid #E4EEFF;
    margin-bottom: 4px;

    img {
        margin-right: 12px;
        flex-shrink: 0;
    }

    .file-details {
        flex: 1;
        min-width: 0;
        font-size: 12px;

        .file-name {
            color: #303133;
            font-weight: 500;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

    }
}

.title {
    font-weight: 500;
    font-size: 10px;
    color: #455166;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    margin-bottom: 2px;
}

.context {
    font-weight: 400;
    font-size: 10px;
    color: #000000;
    line-height: 14px;
    text-align: left;
    font-style: normal;
}
</style>
