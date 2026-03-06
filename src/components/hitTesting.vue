<!-- 召回测试页面 -->
<template>
    <section class="hit-testing">
      <div class="card-wrapper">
        <div class="left-wrapper">
          <div style="margin-bottom: 20px;">
            <div class="title">召回测试</div>
            <div class="description">根据给定的查询文本测试知识的召回效果</div>
          </div>
          <div class="context">
            <div class="title">
              源文本
            </div>
            <div class="input-wrapper">
              <el-input v-model="query" class="chat-input" :rows="5" type="textarea" maxlength="200"
                         placeholder="请输入文本">
              </el-input>
              <div class="input-footer">
                <span class="char-count">{{ query.length }}/200</span>
                <el-button type="primary" size="small" :disabled="query.length == 0" @click="handleHitTesting">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 4px;">
                    <path d="M4 12C4 12 6 6 12 6C18 6 20 12 20 12C20 12 18 18 12 18C6 18 4 12 4 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span>测试</span>
                </el-button>
              </div>
            </div>
          </div>
          <div class="record">
            <div class="title">
              记录
            </div>
            <el-table :data="data" style="width: 100%">
              <el-table-column prop="source" label="数据源" width="180"/>
              <el-table-column prop="content" show-overflow-tooltip  label="文本" width="180"/>
              <el-table-column prop="created_at" label="时间">
                <template #default="scope">
                  {{ new Date(scope.row.created_at * 1000).toLocaleString('zh-CN') }}
                </template>
              </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :total="total" v-model:current-page="page"
                           v-model:page-size="limit" @change="handlePageChange"/>
          </div>
        </div>
        <div class="right-wrapper" v-loading='segmentLoading'>
          <div class="title">召回段落
            <span>{{ records.length }} </span>
          </div>
          <el-scrollbar class="segment-wrap">
            <div v-for="(item, index) in records" :key="index" class="segment-item"
                 @click="handleSegementClick(item)">
              <div class="card-header">
                <div>Chunk-{{ item.segment.position }}·{{ item.segment.word_count }} 字符</div>
                <div>SCORE {{ item.score.toFixed(2) }}</div>
              </div>
              <div v-if="item.segment.answer" class="segment">
                <div class="qa-item">
                  <div class="qa-icon q-icon">问</div>
                  <div class="qa-text">{{ item.segment.content }}</div>
                </div>
                <div class="qa-item">
                  <div class="qa-icon a-icon">答</div>
                  <div class="qa-text">{{ item.segment.answer }}</div>
                </div>
              </div>
              <div v-else class="qa-item qa-text">{{ item.segment.content }}</div>
              <div class="segement-foot">
                <div class="segment-name">
                  {{ item.segment.document.name }}
                </div>
                <div class="tag">
                  <el-tag size="small" v-for="value in item.segment.keywords">{{ value }}</el-tag>
                </div>
              </div>

              <!-- <template #footer> -->

              <!-- </template> -->
            </div>
          </el-scrollbar>
        </div>
      </div>
        <el-dialog v-model="detailVisible" title="段落详情" :modal="false" class="detail" @close="detailVisible = false">
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                <div style="display: flex; flex-direction: row; margin-bottom: 10px;">
                    <div style="margin-right: 20px;">
                        Chunk-{{ detail.segment.position }}·{{ detail.segment.word_count }} 字符
                    </div>
                    <div>{{ detail.segment.document.name }}</div>
                </div>
                <div>score {{ detail.score.toFixed(2) }}</div>
            </div>
            <div class="context"> {{ Boolean(detail.segment.answer) ? `问题 ${detail.segment.content}` :
                detail.segment.content }}
            </div>
            <div v-if="detail.segment.answer" class="context">答案 {{ detail.segment.answer }}</div>
            <div class="tag">
                <el-tag v-for="value in detail.segment.keywords">{{ value }}</el-tag>
            </div>
        </el-dialog>
    </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getDatasetHitTestingRecords, postDatasetHitTesting } from '@/service/datasets';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();

const { datasetId, retrieval_model } = defineProps(['datasetId', 'retrieval_model'])

const records = ref([])
const data = ref([])
const limit = ref(10)
const page = ref(1)
const total = ref(1)
const query = ref<string>('')

const detailVisible = ref(false)
const detail = ref({})

const segmentLoading = ref(false)

const updateRecords = async () => {
    getDatasetHitTestingRecords(datasetId, limit.value, page.value)
        .then((res) => {
            data.value = res.data
            total.value = res.total | 0
            page.value = res.page | 0
            limit.value = res.limit | 0
        }).catch(error => {
            console.log(error)
        })
}

const handleHitTesting = async () => {
    segmentLoading.value = true
    // 公共知识库增加参数
    const sign = router.currentRoute.value.fullPath?.toString().match('/public/details') ? 'public' : ''
    postDatasetHitTesting(datasetId, { query: query.value, retrieval_model, sign }).then(res => {
        records.value = res.records
        updateRecords()
    }).catch(error => {
        console.log(error)
        ElMessage.error(error?.message);
    }).finally(() => {
        segmentLoading.value = false
    })
}

const handlePageChange = (currentPage: number, pageSize: number) => {
    updateRecords()
}

const handleSegementClick = (item) => {
    detail.value = item
    console.log('kankan', detail.value)
    detailVisible.value = true
}

onMounted(() => {
    updateRecords()
})
</script>

<style lang="less" scoped>
:deep(.el-table) {
  .el-table__header-wrapper {
    border-radius: 8px 8px 0 0;
    th.el-table__cell {
      background-color: #f0f0f0;
      font-size: 12px;
      color: rgba(76, 84, 100, 0.4);
    }
  }
  .el-table__body-wrapper {
    .el-table__cell {
      height: 52px;
      box-sizing: border-box;
      padding: 0;
    }
  }
}
:deep(.page-main){
  background: red !important;
}
.title {
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 600;
    color: #000;
}

.description {
    font-size: 12px;
    font-weight: 400;
    color: #676f83;
    margin-top: -10px;
}

.hit-testing {
    width: 100%;
    height: 100%;
}

.card-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-items: stretch;
}
.left-wrapper {
    border-right: 1px solid #dcdfe6;
    padding-right: 12px;
    flex: 1;
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
        overflow: auto;
    }

}
.right-wrapper {
    flex: 1;
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
    flex-direction: column;
  .title{
    flex-shrink: 0;
    line-height: 1.2;
  }
}
.segment-wrap{
  flex: 1;
  display: flex;
  overflow: auto;
  padding-right: 10px;
  flex-direction: column;
  margin-bottom: 10px;
}
.card-header{
  display: flex;
  justify-content:space-between;
  padding-bottom: 12px;
  color: #676F83;
  font-size: 14px;
}
.qa-item{
  display: flex;
  margin-bottom: 12px;
  cursor:pointer;
}
.qa-text{
  font-size: 16px;
  color: #000;
  line-height: 1.2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.segement-foot{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 4px;
}


.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
.qa-icon{
  padding: 2px;
  height: fit-content;
  font-size: 12px;
  line-height: 1.2;
  margin-right: 8px;
}
.q-icon{
  color: #f06851;
  background: #FFEDE9;
}
.a-icon{
  background: #E9F2FF;
  color: #5169F0;
}
.segment-name{
  font-size: 14px;
  color: #333;
  background: rgba(150,159,173,0.1);
  padding: 4px 6px;
  border-radius: 4px;
}
.input-wrapper {
  background: rgba(150,159,173,0.1);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 30px;

  .chat-input {
    :deep(.el-textarea__inner) {
      background-color: transparent;
      border: none;
      resize: none;
      box-shadow: none;
      padding: 0;
      font-size: 14px;
      line-height: 1.5;

      &::placeholder {
        color: #999;
      }

      &:focus {
        box-shadow: none;
      }
    }
  }

  .input-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;

    .char-count {
      font-size: 12px;
      color: #999;
    }

    .el-button {
      border-radius: 8px;
      padding: 6px 8px;
    }
  }
}
.segment-item{
  padding: 12px 0 12px 12px;
  border-bottom: 1px solid #f2f2f2;
  font-size: 14px;
}
.segment-item:last-child{
  border-bottom: none;
}
</style>
