<template>
  <el-card @click="goToDetails">
    <div class="knowledge-base-card">
      <div class="knowledge-base-card-background"></div>
      <div class="knowledge-base-card-name">{{ dataset.name }}</div>
      <div class="knowledge-base-card-creator">
        <el-icon class="icon"><User /></el-icon>
        <!-- 这里展示团队知识库的创建者 字段未给   -->
        <span>{{ dataset.created_by_name }}</span>
      </div>
      <div class="knowledge-base-card-tags">
        <el-tag type="info" style="margin-right: 2px;">{{ dataset.documentNumber }} 文档</el-tag>
        <el-tag type="info">{{ (dataset.word_count / 1000).toFixed(1) }} 千字符</el-tag>
      </div>
      <div class="knowledge-base-card-description">
        {{ dataset.description }}
      </div>

      <div class="knowledge-base-card-label">
        {{ dataset.official == "official" ? "官方" : "非官方" }}
      </div>
      <div class="knowledge-base-card-operate" @click.stop>
        <el-dropdown trigger="click" placement="bottom-end">
          <el-icon style="cursor: pointer">
            <MoreFilled />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleMemberPermission">知识库权限</el-dropdown-item>
              <el-dropdown-item @click="handlePublicPermission">公开</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <memberPermission v-model:visible="isMemberPermissionShow" :dataset-id="props.dataset.id"/>
        <publicPermission v-model:visible="isPublicPermissionShow" :dataset-name = "props.dataset.name" :team = "props.dataset.team" :dataset-id="props.dataset.id" />
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { MoreFilled } from "@element-plus/icons-vue";
import { TeamDataset } from "@/models/dataset";
import { ref, computed, watch } from "vue";
import { useRouter,useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { deleteDataset } from "@/service/datasets";
import memberPermission from "@/views/team/components/memberPermission.vue";
import publicPermission from "@/views/team/components/publicPermission.vue";
const emit = defineEmits(["delete"]);

const props = defineProps<{
  dataset: TeamDataset;
}>();

const router = useRouter();
const route = useRoute()
const isMemberPermissionShow = ref(false)
const isPublicPermissionShow = ref(false)

// 跳转到详情页
const goToDetails = () => {
  router.push({
    name: "details",
    query: { 
      id: props.dataset.id,
      is_admin:String(props.dataset.is_admin),
    },
  });
};

const handleDeleteClick = () => {
  ElMessageBox.confirm(
    "删除知识库是不可逆的。用户将无法再访问您的知识库,所有的提示配置和日志将被永久删除。",
    "要删除知识库吗？",
    {
      confirmButtonText: "我确定",
      cancelButtonText: "取消",
      type: "warning",
      confirmButtonClass: "my-confirm-btn",
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

const handleMemberPermission = () => {
  isMemberPermissionShow.value = true;
}
const handlePublicPermission = () => {
  isPublicPermissionShow.value = true;
}
</script>

<style scoped>
.knowledge-base-card {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex-shrink: 0;
  height: 200px;
  flex-grow: 1;
  align-items: center;
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
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 4px;
}
.knowledge-base-card-creator {
  display: flex;
  margin: 4px 0;
  font-size: 13px;
}
.knowledge-base-card-creator .icon {
    margin-right: 2px;
}
.knowledge-base-card-tags {
  margin-bottom: 8px;
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

<style>
/*MessageBox样式,不用scoped */
.my-confirm-btn:focus,
.my-confirm-btn:active,
.my-confirm-btn:hover {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}
</style>
