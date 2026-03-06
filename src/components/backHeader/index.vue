<template>
  <section class="header-style">
    <div @click="router.back()" class="back-wrapper can-click">
      <el-icon class="back-icon">
        <ArrowLeftBold />
      </el-icon>
      <span class="back-text">返回</span>
    </div>
    <div class="title">{{ title }}</div>
  </section>
</template>

<script setup lang="ts">
import router from "@/router";
import {ArrowLeft} from "@element-plus/icons-vue";

const { title } = defineProps({
  title: {
    type: String,
    required: false,
    default: "",
  },
});

</script>

<style scoped lang="less">
.back-icon {
  font-size: 14px;
  font-weight: bold;
}
.back-text {
  font-size: 14px;
  margin-left: 4px;
}
.back-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.header-style {
  display: flex;
  background-color: #ffffff;
  align-items: center;
  justify-content: start;
  margin-bottom: 30px;
  line-height: 20px;
  // border-bottom: 1px solid var(--el-border-color);
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-left: 20px;

  }
}
</style>
