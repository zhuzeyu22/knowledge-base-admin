<template>
  <section class="section">
      <el-header class="header-style">
          <el-button type="primary" link size="default" @click="router.back()" style="padding: 0; margin-right: 16px">
              <el-icon>
                  <Back />
              </el-icon>
          </el-button>
          <div>基本信息</div>
      </el-header>
      <el-main class="context-style" style="overflow: hidden">
          <div class="form-item">
              <label class="form-label">团队名称</label>
              <el-input v-model="name" style="width: 200px" placeholder="团队名称"/>
          </div>
          <div class="form-actions">
            <el-button type="danger" @click="handleDelete" >删除</el-button>
            <el-button type="primary" @click="handleSave">保存修改</el-button>
          </div>
      </el-main>
  </section>
</template>

<script setup lang="ts">
import router from "@/router";
import { computed, onMounted, ref, watch } from "vue";
import { deleteTeam, deleteTenant, deleteUser, getTeamInfo, getTeamMemberList, putTeamNameModify, putUserRole } from "@/service/team";
import { ElMessage, ElMessageBox } from "element-plus";
import { useTeamStore } from "@/store/team";
const tenantId = computed(() => router.currentRoute.value.params.teamId);
const name = ref('')

watch(tenantId, async (newVal) => {
    if(newVal){
        const res = await getTeamInfo(newVal)
        console.log(res.data.name)
        name.value = res.data.name
    }
},{
    deep: true,
    immediate: true
});

const handleSave = () =>{
    const tenantId = router.currentRoute.value.params.teamId
    console.log('tenantId', tenantId);
    putTeamNameModify(tenantId as string, name.value).then(res => {
        ElMessage({
            type: "success",
            message: "保存成功",
        });
        location.reload()
    }).catch(err => {
        ElMessage({
            type: "warning",
            message: "保存失败",
        });
    })
}

const handleDelete = ()=>{
    const tenantId = router.currentRoute.value.params.teamId
    ElMessageBox.confirm("删除这个团队？", "", {
        confirmButtonText: "我确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(()=>{
        deleteTeam(tenantId as string).then(res => {
            ElMessage({
                type: "success",
                message: "删除成功",
            });
            router.push('/private')
        }).catch(err => {
            ElMessage({
                type: "warning",
                message: "删除失败",
            });
        })
    })
}

</script>

<style scoped lang="less">
.section {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.header-style {
  display: flex;
  background-color: #f5f5f5;
  align-items: center;
  height: auto;
  // border-bottom: 1px solid var(--el-border-color);
}

.context-style {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.form-item {
    margin-top: 24px;

    .form-label {
        display: block;
        margin: 10px 0;
        font-size: 22px;
        font-weight: 500;
    }

}

.form-actions {
    position: absolute;
    bottom: 30px;
    right: 50px
}
</style>