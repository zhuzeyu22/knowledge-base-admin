<template>
  <el-header class="header-style">
    <div class="header-left">
      <el-button
        type="primary"
        link
        size="default"
        @click="handleClose"
        style="padding: 0; margin-right: 16px"
      >
        <el-icon>
          <Back />
        </el-icon>
      </el-button>
      <div>
        <div>{{ document.name }}</div>
      </div>
    </div>
    <div class="header-right">
      <el-button @click="handleCreateSegementClick">添加分段</el-button>
      <div>{{ display_status ? "可用" : "已禁用" }}</div>
      <el-switch v-model="display_status" @change="handleChange" />
      <!-- <el-button>分段设置</el-button> -->
      <el-dropdown trigger="click" placement="bottom-end">
        <el-icon style="cursor: pointer">
          <MoreFilled />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="showRenameModel = true"
              >重命名</el-dropdown-item
            >
            <el-dropdown-item divided @click="handleDeleteClick"
              >删除</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
  <div>
    <el-col :span="11">
      <el-table :data="segementList" @selection-change="handleSelectionChange">
        <el-table-column :label="`${total} 分段`">
          <template #default="scope">
            <el-row>
              <el-col :span="6">分段 {{ scope.row.position }} </el-col>
              <el-col :span="6"> {{ scope.row.word_count }} 字符</el-col>
              <el-col :span="6">召回次数 {{ scope.row.hit_count }} </el-col>
              <el-col :span="4"
                >{{ scope.row.status == "completed" ? "已启用" : "已禁用" }}
              </el-col>
              <el-col :span="2">
                <el-dropdown trigger="click" placement="bottom-end">
                  <el-icon style="cursor: pointer">
                    <MoreFilled />
                  </el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        @click="handleUpdateSegementClick(scope.row)"
                        >编辑</el-dropdown-item
                      >
                      <el-dropdown-item
                        divided
                        @click="handleDeleteSegement(scope.row)"
                        >删除</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-col>
            </el-row>
            <el-row>
              {{ scope.row.content }}
            </el-row>
            <el-row>
              <el-tag v-for="value in scope.row.keywords">{{ value }}</el-tag>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        v-model:current-page="page"
        v-model:page-size="limit"
        @change="handlePageChange"
      />
    </el-col>
    <el-col :span="2"> </el-col>
    <el-col :span="11"> </el-col>
  </div>

  <el-dialog v-model="showRenameModel" title="重命名" width="800">
    <div>重命名</div>
    <el-input v-model="rename"></el-input>
    <div class="dialog-footer">
      <el-button type="primary" @click="handleRenameEnsure">确定 </el-button>
      <el-button @click="showRenameModel = false">取消</el-button>
    </div>
  </el-dialog>

  <UpdateSegement
    v-model="showUpdateSegementModel"
    :segement="newSegement"
    :documentId="document.id"
    :datasetId="datasetId"
    @update_data="handleUpdateData"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { MoreFilled } from "@element-plus/icons-vue";
import { getSegmentList, deleteSegment } from "@/service/segement";
import { ElMessage, ElMessageBox } from "element-plus";
import UpdateSegement from "@/components/updateSegement.vue";

const { document, datasetId } = defineProps(["document", "datasetId"]);
const emit = defineEmits(["close", "update_status", "rename"]);
const showRenameModel = ref(false);
const rename = ref(document.name);
const segementList = ref([]);
const limit = ref(10);
const page = ref(1);
const total = ref(0);

// 分段编辑
const showUpdateSegementModel = ref(false);
const newSegement = ref(null);

const display_status = computed(() => {
  return document.display_status == "available";
});

const handleClose = () => {
  emit("close");
};
const handleChange = (status) => {
  emit("update_status", status);
};

const handleRenameEnsure = () => {
  emit("rename", rename.value);
  showRenameModel.value = false;
};

const handleDeleteClick = () => {};

// 段落编辑
const handleSelectionChange = () => {};

const updateData = () => {
  getSegmentList(datasetId, document.id, page.value, limit.value).then(
    (res) => {
      segementList.value = res.data;
      limit.value = res.limit | 0;
      page.value = res.page | 0;
      total.value = res.total | 0;
    }
  );
};

const handlePageChange = (currentPage: number, pageSize: number) => {
  updateData();
};

const handleDeleteSegement = (row) => {
  ElMessageBox.confirm("删除这个分段？", "", {
    confirmButtonText: "我确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteSegment(datasetId, document.id, row.id).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        updateData();
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消",
      });
    });
};

const handleUpdateData = () => {
  updateData();
};

onMounted(() => {
  updateData();
});

// 分段编辑相关
const handleCreateSegementClick = () => {
  newSegement.value = null;
  showUpdateSegementModel.value = true;
};

const handleUpdateSegementClick = (row) => {
  newSegement.value = row;
  showUpdateSegementModel.value = true;
};
</script>

<style lang="less" scoped>
.header-style {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dialog-footer {
  display: flex;
  flex-direction: row-reverse;
  gap: 16px;
  margin-top: 16px;
}
</style>
