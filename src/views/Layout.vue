<template>
    <div class="common-layout">
        <el-container style="height: 100%;">
            <el-aside width="200px">
                <el-menu style="height: 100%;">
                    <el-menu-item index="1" @click="$router.push('/private')">个人知识库</el-menu-item>
                    <el-menu-item index="2" @click="$router.push('/public')">共享知识库</el-menu-item>
                    <el-menu-item index="4" @click="$router.push('/stat')">数据统计</el-menu-item>
                    <el-menu-item index="5" @click="$router.push('/conversation-log')">对话记录</el-menu-item>
                    <el-menu-item index="6" @click="$router.push('/login-log')">登录记录</el-menu-item>
                    <el-menu-item index="7" @click="$router.push('/auth-log')">授权记录</el-menu-item>
                    <el-menu-item index="8" @click="$router.push('/logout')">退出登录</el-menu-item>
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

const logout = () => {
    console.log('logout')
    localStorage.removeItem('token')
}

</script>
<style>
.common-layout {
    width: 100%;
    height: 100%;
}
</style>