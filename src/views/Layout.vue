<template>
    <div class="common-layout">
        <el-container style="height: 100%;">
            <el-aside width="200px">
                <el-menu style="height: 100%;">
                    <el-menu-item index="1" @click="$router.push('/management')">Management</el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({

})
</script>
<style>
.common-layout {
    width: 100%;
    height: 100%;
}
</style>