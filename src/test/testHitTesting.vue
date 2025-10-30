<template>
    <HitTesting :datasetId='datasetId' :retrieval_model="retrieval_model" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HitTesting from '@/components/hitTesting.vue';

const datasetId = '22ba2469-5a09-4cdc-91d2-8f2125a0e5da'
const retrieval_model = {
    "search_method": "semantic_search",
    "reranking_enable": true,
    "reranking_mode": null,
    "reranking_model": {
        "reranking_provider_name": "langgenius/tongyi/tongyi",
        "reranking_model_name": "gte-rerank-v2"
    },
    "weights": null,
    "top_k": 3,
    "score_threshold_enabled": false,
    "score_threshold": 0.5
}
</script>