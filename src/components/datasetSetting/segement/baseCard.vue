<template>
  <section class="section">
    <div :class="disabled ? 'header can-not-click' : 'header can-click'" :style="{ backgroundColor: color }"
      @click.stop="handleSelected">
      <div class="icon">
        <slot name="icon"></slot>
      </div>
      <div class="title">
        <div class="title-content">
          <div class="name">{{ name }}</div>
          <div class="radio" v-if="showRadio" :disabled>
            <el-radio :model-value="selected" :label="''"></el-radio>
          </div>
        </div>
        <div class="description">{{ description }}</div>
      </div>
    </div>
    <div v-if="visiable" class="content">
      <slot name="content"></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const emit = defineEmits(["selected"]);

const { name, description, visiable } = defineProps({
  name: {
    type: String,
    required: false,
    default: () => "标题",
  },
  description: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
    default: () => "#f5f5f5",
  },
  visiable: {
    type: Boolean,
    required: true,
    default: () => true,
  },
  showRadio: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },
});

const selected = computed(() => visiable ? '' : 'no');

const handleSelected = () => {
  emit("selected");
}

</script>

<style scoped lang="less">
.section {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #E2E2E2;
  flex: 0;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    flex: 1;
  }

  .icon {
    align-self: flex-start;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    background: linear-gradient(180deg, #FFFFFF 0%, #FEFEFF 100%);
    box-shadow: 0px 1px 14px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;

    * {
      height: 24px;
      width: 24px;
    }
  }

  .title {
    flex: 1;
    margin-left: 12px;
    height: 100%;

    .title-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 4px;

      .name {
        font-weight: 600;
        font-size: 14px;
        color: #333333;
        line-height: 20px;
        text-align: left;
        flex: 1
      }

      .radio {
        margin-right: 0px;
        margin-top: 2px;
        height: auto;
        padding-left: 8px;
        align-self: flex-start;

        :deep(.el-radio) {
          height: auto;
        }
      }

    }

    .description {
      font-size: 10px;
      font-weight: 400;
      font-size: 12px;
      color: #455166;
      line-height: 17px;
      text-align: left;
      font-style: normal;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>