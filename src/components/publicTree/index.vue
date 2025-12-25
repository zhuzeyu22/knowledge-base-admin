<template>
    <section class="section">
        public
        <el-tree :props="props" :load="loadNode" lazy show-checkbox>
        </el-tree>
    </section>
</template>

<script setup lang="ts">



</script>

<style scoped lang="less">
.section {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
</style>