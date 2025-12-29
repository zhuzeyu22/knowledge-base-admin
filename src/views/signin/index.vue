<template>
    <div class="common-layout">
        <el-container style="height: 100%;">
            <el-main>
            </el-main>
            <el-aside width="400px" class="login-wrapper">
                <section class="login-container">
                    <el-form :model="form" label-width="auto">
                        <el-form-item label="邮箱">
                            <el-input v-model="form.email" />
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="form.pw" type="password" />
                        </el-form-item>
                        <el-form-item>
                            <div style="width: 100%; display: flex;flex-direction: row-reverse;">
                                <el-button type="primary" @click="onSubmit">登录</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </section>
            </el-aside>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { postLogin } from '@/service/login'
import { reactive } from 'vue'
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox, rowContextKey } from "element-plus";

const router = useRouter();

// do not use same name with ref
const form = reactive({
    email: '',
    pw: ''
})

const onSubmit = async () => {
    const res = await postLogin(form.email, form.pw)
    if (res?.result === 'success') {
        localStorage.setItem('console_token', res.data.access_token)
        localStorage.setItem('refresh_token', res.data.refresh_token)
        router.replace('/private')
        ElMessage.success('登录成功')
    } else {
        ElMessage.error('登录失败', res?.data)
        return
    }
    console.log('submit!')
}

</script>
<style scoped lang="less">
.common-layout {
    width: 100%;
    height: 100%;
    background-image: url('@/assets/login-bg.png');
    background-size: cover;
    background-position: left center;
    background-repeat: no-repeat;
}

.login-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 16rem;
}

.login-container {
    width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>