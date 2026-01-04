<template>
  <router-view />
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { onBeforeMount } from "vue";
import { useTeamStore } from "@/store/team";

const userStore = useUserStore()
const teamStore = useTeamStore()

// 全局初始化
onBeforeMount(async () => {
  // user proofile init
  await userStore.updateUserInfo();
  teamStore.updateRoleList();
})


</script>