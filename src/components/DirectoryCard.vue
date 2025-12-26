<template>
  <el-card @click="goToNextLevelDirectory">
    <div class="knowledge-base-card">
      <div class="knowledge-base-card-background"></div>
      <div class="knowledge-base-card-name">目录名称</div>
      <div class="knowledge-base-card-operate" @click.stop>
        <el-dropdown trigger="click" placement="bottom-end">
          <el-icon style="cursor: pointer">
            <Operation />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleUpdateDirectory">修改</el-dropdown-item>
              <el-dropdown-item @click="handleDeleteDirectory">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>



const goToNextLevelDirectory = () => {
  //todo
  console.log('跳转下一级目录')
}
const handleUpdateDirectory = () => {
  //todo
  console.log('修改目录')
}
const handleDeleteDirectory = () => {
  //todo
  console.log('删除目录')
}

</script>

<style scoped>
.knowledge-base-card {
  display: flex;
  flex-direction: column;
  position: relative;
  /* width: 100%; */
  width: 360px;
  flex-shrink: 0;
  height: 200px;
  flex-grow: 1;
  align-items: center;
}
.knowledge-base-card-background {
  background-image: url("@/assets/know-title-icon.png");
  width: 80px;
  height: 60px;
  margin: 40px 0;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
}
.knowledge-base-card-name {
  font-size: 18px;
}
.knowledge-base-card-operate {
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>
