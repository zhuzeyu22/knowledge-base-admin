<!-- 知识库设置页面 -->
<template>
    <section class="setting">
        <h2>知识库设置</h2>
        <div class="form-item">
            <label class="form-label">知识库名称</label>
            <el-input v-model="localName" placeholder="输入知识库新名称" clearable :disabled="!isAdmin"/>
        </div>

        <div class="form-item">
            <label class="form-label">知识库描述</label>
            <el-input v-model="localDescription" placeholder="输入知识库新描述" clearable :disabled="!isAdmin"/>
        </div>
        <div class="form-item">
            <label class="form-label">知识库类型</label>
            <el-radio-group v-model="official" :disabled="!isAdmin">
                <el-radio-button value="official">官方</el-radio-button>
                <el-radio-button value="unofficial">非官方</el-radio-button>
            </el-radio-group>
        </div>
        <div class="form-item">
            <label class="form-label">知识库存储路径</label>
            <el-input v-model="storagePath" placeholder="知识库存储路径" disabled/>
        </div>
        <div>
            <el-button class="form-actions" type="primary" @click="handleSave" :loading="saveLoading" :disabled="!isAdmin">保存修改</el-button>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import apiService from '@/service/knowledge/use-document-list';
import { updateKnowledgeBase } from '@/service/datasets';

const { datasetId, isAdmin } = defineProps(['datasetId','isAdmin'])

const localName = ref<string>('')
const localDescription = ref<string>('')
const official = ref<'official' | 'unofficial'>()
const storagePath = ref<string>('')
const saveLoading = ref<boolean>(false)

const loadDatasetInfo = async () => {
    try {
        const response = await apiService.getDatasetById(datasetId)
        localName.value = response.name
        localDescription.value = response.description
        official.value = response.official
        storagePath.value = response.path
        if (official.value == undefined) {
            ElMessage.warning('official字段为空')
        }
    } catch (error: any) {
        ElMessage.error('获取知识库信息失败')
    }
}

const emit = defineEmits(['refresh'])

const handleSave = async () => {
    if (!localName.value.trim()) {
        ElMessage.warning('知识库名称不能为空')
        return
    }

    if (localName.value.length < 1 || localName.value.length > 40) {
        ElMessage.warning('知识库名称长度必须在1-40个字符之间')
        return
    }

    if(localDescription.value.length > 400){
        ElMessage.warning('知识库描述长度不能超过400个字符')
        return
    }

    try {
        saveLoading.value = true
        await updateKnowledgeBase(datasetId, {
            name: localName.value,
            description: localDescription.value,
            official: official.value
            // patch:storagePath.value
        })
        ElMessage.success('保存成功')
        emit('refresh')
    } catch (error: any) {
        ElMessage.error(error.message || '保存失败')
    } finally {
        saveLoading.value = false
    }
}

onMounted(() => {
    loadDatasetInfo()
})
</script>

<style lang="less" scoped>
.setting {
    position: relative;
    padding: 20px;
    height: 100%;

    h2 {
        font-size: 22px;
        font-weight: 700;
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

    .demo-tabs>.el-tabs__content {
        padding: 32px;
        color: #6b778c;
        font-size: 32px;
        font-weight: 600;
    }

    .form-actions {
        margin: 20px 0 10px;
    }
}
</style>