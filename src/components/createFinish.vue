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
                          <img :src="getFileIcon(file.ext)" width="24" alt="" />
                            <div class="file-details ellipsis">
                                <div class="file-name ellipsis">
                                    <div > {{ file.name }}</div>
                                    <div> {{ file.percentage }} %</div>
                                </div>
                                <div v-if="file.indexing_status == 'error'" class="warning"> {{ file.error }}
                                </div>
                                <el-progress v-else :percentage="file.percentage" :show-text="false"> </el-progress>
                            </div>
                        </div>
                    </section>
                    <el-row :gutter="10" style="margin-top: 30px;">
                        <el-col :span="12">
                            <div class="title">分段模式</div>
                            <div class="context">{{ ChunkingModeText[doc_form as ChunkingMode] }}</div>
                        </el-col>
                        <el-col :span="12">
                            <div class="title">分段最大长度</div>
                            <div class="context">{{ max_tokens }}</div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-top: 30px;">
                        <el-col :span="12">
                            <div class="title">文本预处理规则</div>
                            <div v-if="pre_processing_rules[0].enabled" class="context">替换掉连续的空格、换行符和制表符</div>
                            <div v-if="pre_processing_rules[1].enabled" class="context">删除所有 URL 和电子邮件地址</div>
                        </el-col>
                        <el-col :span="12">

                        </el-col>
                    </el-row>
                </div>
                <el-button style="align-self: flex-end;" type="primary" @click="handleClick()" size="default">
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
import { ChunkingModeText, ChunkingMode } from "@/models/dataset";

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

const { dataset, process_rule, max_tokens, pre_processing_rules, doc_form } = defineProps(["dataset", "process_rule", "max_tokens", "pre_processing_rules", "doc_form"]);

const statusList = ref<FileStatus[]>([]);
// 文件图标映射表
const fileIconMap: Record<string, string> = {
  pdf: 'pdf.png',
  doc: 'doc.png',
  docx: 'docx.png',
  html: 'html.png',
  markdown: 'markdown.png',
  md: 'markdown.png',
  csv: 'csv.png',
  txt: 'txt.png',
  xls: 'xls.png',
  xlsx: 'xlsx.png',
  pptx: 'pptx.png',
};

// 获取文件图标路径
const getFileIcon = (ext: string): string => {
  const iconFile = fileIconMap[ext?.toLowerCase()] || 'default.png';
  return new URL(`../assets/dataset-setting/file-icon/${iconFile}`, import.meta.url).href;
};
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
                } else if (find.indexing_status == IndexingStatus.Completed) {
                    find.percentage = Number(100).toFixed(2)
                } else {
                    find.percentage = Number(0).toFixed(2)
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

    // 团队知识库 trick surprise
    const tenantId = router.currentRoute.value.params.teamId
    console.log('handleClick tenantId', tenantId)
    if (tenantId) {
        router.push({
            path: `/team/${tenantId}/details`,
            query: { id: dataset.dataset.id },
        });
    } else {
        router.push({
            name: "details",
            query: { id: dataset.dataset.id },
        });
    }

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
    height: 70px;
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
        height: 40px;

        .file-name {
            color: #303133;
            font-weight: 500;
            padding-top: 10px;
            padding-bottom: 10px;
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
    font-size: 14px;
    color: #455166;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    margin-bottom: 8px;
}

.context {
    font-weight: 400;
    font-size: 12px;
    color: #000000;
    line-height: 14px;
    text-align: left;
    font-style: normal;
}
</style>
