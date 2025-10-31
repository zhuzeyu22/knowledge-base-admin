<template>
    <CreateFinish name="yes" :files="files" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CreateFinish from '@/components/createFinish.vue';

const files = ref<any>([]);
</script>