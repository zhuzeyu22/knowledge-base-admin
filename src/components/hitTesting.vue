<!-- 召回测试页面 -->
<template>
    <section class="hit-testing">
        <el-card class="card-wrapper">
            <el-col>
                <el-row>
                    <el-col :span="12">
                        <el-button type="primary">测试</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-button type="primary">测试</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-card>
    </section>
</template>

<script lang="ts" setup>

const props = defineProps({

})

</script>

<style lang="less" scoped>
.hit-testing {
    width: 100%;
    height: 100%;
}

.card-wrapper {
    width: 100%;
    height: 100%;
}
</style>