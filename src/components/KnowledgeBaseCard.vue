<template>
  <el-card class="knowledge-card" @click="goToDetails">
    <div class="knowledge-base-card">
      <div class="card-base-info">
        <div class="knowledge-base-card-background"></div>
        <div class="knowledge-base-card-name">{{ dataset.name }}</div>
        <div class="knowledge-base-card-tags">
          <el-tag type="info" style="margin-right: 2px;">{{ dataset.documentNumber }} 文档</el-tag>
          <el-tag type="info">{{ (dataset.word_count / 1000).toFixed(1) }} 千字符</el-tag>
        </div>
      </div>
      <div class="knowledge-base-card-description">
        {{ dataset.description }}
      </div>

      <!-- <div class="knowledge-base-card-label" v-if="dataset.official == 'official'">
        <img src="@\assets\official.png" alt="">
      </div> -->
      <div class="knowledge-base-card-operate" @click.stop>
        <el-dropdown trigger="click" placement="bottom-end">
          <el-icon style="cursor: pointer">
            <MoreFilled />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item @click="updateUserDialogVisible = true" divided>共享</el-dropdown-item> -->
              <el-dropdown-item @click="handleDeleteClick" class="delete-dropdown-item">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { MoreFilled } from "@element-plus/icons-vue";
import { Dataset } from "@/models/dataset";
import { ref, computed, watch,h } from "vue";

import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { deleteDataset } from "@/service/datasets";

// import '@/assets/less/messagebox.less'
const emit = defineEmits(["delete"]);

const props = defineProps<{
  dataset: Dataset;
}>();

const router = useRouter();

// 跳转到详情页
const goToDetails = () => {
  router.push({
    name: "details",
    query: {
      id: props.dataset.id,
    },
  });
};

const handleDeleteClick = () => {
  ElMessageBox.confirm(
    "删除知识库是不可逆的。用户将无法再访问您的知识库，所有的提示配置和日志将被永久删除。",
    "要删除知识库吗",
    {
      confirmButtonText: "确定删除",
      cancelButtonText: "取消",
      type:'warning',
      customClass: "delete-message-box",
      confirmButtonClass: "my-confirm-btn",
      cancelButtonClass: "my-cancel-btn",
      center: true,
    }
  )
    .then(() => {
      deleteDataset(props.dataset.id).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        // updateData();
        emit("delete");
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消",
      });
    });
  console.log("删除");
};

</script>

<style scoped>
.knowledge-card{
  border-radius: 10px;
}
:deep(.el-card__body) {
  position: relative;
}
.knowledge-base-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  width: 100%;
  flex-shrink: 0;
  height: 240px;
  flex-grow: 1;
  align-items: center;
}
.card-base-info{
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.knowledge-base-card-background {
  background-image: url("@/assets/know-title-icon.png");
  width: 60px;
  height: 60px;
  margin: 12px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
}

.knowledge-base-card-image {
  width: 70px;
  height: 70px;
  margin-bottom: 4px;
  border-radius: 8px;
}

.knowledge-base-card-name {
  line-height: 22px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;

  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
}

.knowledge-base-card-tags {
  margin-bottom: 8px;
}

.knowledge-base-card-description {
  height: 60px;
  margin-top: 5px;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-height: 20px;
}

.knowledge-base-card-label {
  position: absolute;
  top: -20px;
  left: -20px;
  padding: 6px 10px;
  background: var(--el-color-primary);
  color: #fff;
  font-size: 12px;
  border-radius: 10px 0 10px 0;
}

.knowledge-base-card-operate {
  position: absolute;
  top: 0px;
  right: 0px;
}

:deep(.el-dropdown-menu__item){
  margin: 0 3px;
  border-radius: 3px;
  color: #FF1919;
}

:deep(.el-dropdown-menu__item:hover,
      .el-dropdown-menu__item:is-active,
      .el-dropdown-menu__item:focus) {
  --el-dropdown-menuItem-hover-fill: #F4F6F7 !important;
  --el-dropdown-menuItem-hover-color: #FF1919 !important;
}
.dialog-content {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 20px;
}
</style>
