<template>
  <el-dialog v-model="visible" :title="`${isNew ? '新增' : '编辑'}分段`">
    <el-row style="margin-bottom: 16px">
      <el-col :span="6">
        {{ isNew ? `新分段` : `分段 ${newSegement.position}` }}
      </el-col>
      <el-col :span="6"> {{ content.length }} 字符 </el-col>
    </el-row>
    <el-row style="margin-bottom: 16px">
      <el-input
        v-model="content"
        style="width: 100%"
        :rows="20"
        type="textarea"
        placeholder="请输入文本"
      >
      </el-input>
    </el-row>
    <el-row
      style="
        margin-bottom: 16px;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        gap: 8px;
      "
    >
      <el-tag
        v-for="value in newSegement.keywords"
        closable
        @close="handleCloseTag(value)"
        >{{ value }}</el-tag
      >
      <el-input
        v-if="inputVisible"
        ref="InputRef"
        v-model="inputTag"
        style="width: 4rem"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag" size="small" @click="showInput">
        + New Tag
      </el-button>
    </el-row>
    <div class="dialog-footer">
      <el-button
        type="primary"
        :disabled="content.length == 0"
        @click="handleUpdateSegement"
        >确定
      </el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  nextTick,
  watch,
  reactive,
  onMounted,
} from "vue";
import { patchSegment, createSegment } from "@/service/segement";
import { ElMessage, ElMessageBox } from "element-plus";

const visible = defineModel({ default: false });
const emit = defineEmits(["update_data"]);
const { segement, documentId, datasetId } = defineProps({
  segement: { required: false },
  documentId: String,
  datasetId: String,
});
const newData = {
  id: "",
  position: 0,
  word_count: 0,
  keywords: [],
};
const newSegement = ref<Segment>(newData);
const isNew = computed(() => newSegement.value.id == "");
const content = ref("");
const inputTag = ref("");
const inputVisible = ref(false);
const InputRef = ref<InputInstance>();

watch(
  () => segement,
  (val) => {
    if (val != null) {
      newSegement.value = val;
      content.value = val.content;
    } else {
      newSegement.value = newData;
      content.value = "";
    }
  }
);

const handleUpdateSegement = () => {
  if (isNew.value) {
    createSegment(datasetId, documentId, content.value, [
      ...newSegement.value.keywords,
    ])
      .then(() => {
        ElMessage.success("创建成功");
        emit("update_data");
        visible.value = false;
      })
      .catch((err) => {
        console.log(err);
        ElMessage.error("创建失败");
      });
  } else {
    patchSegment(datasetId, documentId, newSegement.value.id, content.value, [
      ...newSegement.value.keywords,
    ])
      .then(() => {
        ElMessage.success("更新成功");
        emit("update_data");
        visible.value = false;
      })
      .catch((err) => {
        console.log(err);
        ElMessage.error("更新失败");
      });
  }
};

const handleCloseTag = (value: string) => {
  newSegement.value.keywords = newSegement.value.keywords.filter(
    (item) => item != value
  );
};
const handleInputConfirm = () => {
  if (inputTag.value) {
    newSegement.value.keywords.push(inputTag.value);
  }
  inputTag.value = "";
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

onMounted(() => {
  console.log(segement);
  console.log(newSegement);
});
</script>

<style lang="less" scoped>
.dialog-footer {
  display: flex;
  flex-direction: row-reverse;
  gap: 16px;
  margin-top: 16px;
}
</style>
