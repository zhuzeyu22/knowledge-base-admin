<template>
  <router-view />
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { onBeforeMount } from "vue";

const userStore = useUserStore()

// 全局初始化
onBeforeMount(async () => {
  // user proofile init
  await userStore.updateUserInfo();
})


</script>