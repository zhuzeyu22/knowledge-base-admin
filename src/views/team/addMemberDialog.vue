<template>
    <el-dialog title="添加成员" v-model="addMemberDialogVisible" width="60%">
        <div class="add-member"  v-loading="loadingOrgTree">
            <div class="left-col">
                <el-select v-model="filter" filterable remote reserve-keyword placeholder="搜索成员"
                    :remote-method="remoteSearch" :loading="searchLoading" @change="handleFilterChange" size="default">
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                  <el-option class="search-item" v-for="item in searchoptions" :key="item.id" :label="item.name"
                             :value="item.id">
                    <div class="option-content">
                      <div v-if="item.type == 'user'" class="user-avatar" :style="{ backgroundColor: getAvatarColor(item.name) }">
                        {{ item.name ? item.name.charAt(0) : '' }}
                      </div>
                      <span class="user-name">{{ item.name }}</span>
                      <span v-if="item.type == 'user'" class="user-code">
                                ({{ item.code }})
                            </span>
                      <span class="user-path">{{ item.path }}</span>
                    </div>
                  </el-option>
                </el-select>
                <div class="normal-user">普通用户</div>
                <div ref="treeWrapperRef" class="org">
                    <el-tree-v2 ref="orgTreeRef" :data="orgTreeData" show-checkbox @check="handleCheckClick"
                        highlight-current accordion node-key="id" :height="treeHeight">
                      <template #default="{ node, data }">
                        <div class="tree-node-content">
                          <div v-if="data.type == 'user'" class="user-avatar tree-avatar" :style="{ backgroundColor: getAvatarColor(data.name) }">
                            {{ data.name ? data.name.charAt(0) : '' }}
                          </div>
                          <div class="node-name">{{ data.name }}</div>
<!--                          <span v-if="data.type == 'user'" class="user-code">-->
<!--                                    {{ data.code }}-->
<!--                                </span>-->
                        </div>
                      </template>
                    </el-tree-v2>
                </div>
            </div>
            <div class="right-col" style="height: 100%;">
                <div class="selected-label">已选择 {{ selected.length }}</div>
                <el-scrollbar class="selected-list">
                  <div v-for="data in selected" class="custom-tree-node">
                    <div class="user-info">
                      <div v-if="data.type == 'user'" class="user-avatar tree-avatar" :style="{ backgroundColor: getAvatarColor(data.name) }">
                        {{ data.name ? data.name.charAt(0) : '' }}
                      </div>
                      <div class="label">{{ data.name }}</div>
<!--                      <span v-if="data.type == 'user'" style="float: right; color: #8492a6; font-size: 12px">-->
<!--                        {{ data.code }}-->
<!--                      </span>-->
                    </div>
                    <el-popconfirm
                        title="确定移除此人吗？"
                        confirm-button-text="移除"
                        cancel-button-text="取消"
                        confirm-button-type="danger"
                        :disabled="data.disabled"
                        :icon="WarningFilled"
                        icon-color="#f56c6c"
                        width="200"
                        @confirm="() => handleSelectedMemberDelete(data)"
                    >
                      <template #reference>
                        <el-button :disabled="data.disabled" size="default" type="text">
                          <el-icon>
                            <Close />
                          </el-icon>
                        </el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </el-scrollbar>
            </div>
        </div>
      <div class="dialog-footer">
                    <el-button type="primary" @click='handleEnsureClick'>添加</el-button>
                    <el-button @click="handleCancelClick">取消</el-button>
                </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { OrganizationNode } from '@/models/organization';
import { getOrganizationTree, searchOrganizationNode } from '@/service/organization';
import { postUser } from '@/service/team';
import { ref, onMounted, watch, computed, nextTick, onBeforeUnmount } from 'vue';
import router from "@/router";
import { ElMessage, ElMessageBox } from 'element-plus';
import { Close, WarningFilled } from "@element-plus/icons-vue";

const emit = defineEmits(["add", "cancel"]);
const addMemberDialogVisible = defineModel("visible");

const filter = ref('');
const orgTreeRef = ref();
const orgTreeData = ref<OrganizationNode[]>([])
const selected = ref([]);

// 远程搜索
const searchLoading = ref(false);
const searchoptions = ref<OrganizationNode[]>([]);
const tenantId = computed(() => String(router.currentRoute.value.params.teamId));

// 使用 ResizeObserver 监听容器大小变化
let resizeObserver: ResizeObserver | null = null
const treeWrapperRef = ref();
const treeHeight = ref(300);

const loadingOrgTree = ref(true);

onMounted(() => {
    loadingOrgTree.value = true
    getOrganizationTree().then(res => {
        orgTreeData.value = res.tree;
        // orgTreeData.value. = res.exist_emp_ids
    }).finally(() => {
        loadingOrgTree.value = false
    })
});

watch(
    addMemberDialogVisible,
    (addMemberDialogVisible) => {
        if (addMemberDialogVisible) {
            loadingOrgTree.value = true
            getOrganizationTree().then(async res => {
                // orgTreeData.value = res.tree;
                orgTreeRef.value.setData(res.tree)
                console.log('orgTreeRef.value', orgTreeRef.value)
                orgTreeRef.value.setCheckedKeys(res.exist_emp_ids)
                selected.value = orgTreeRef.value.getCheckedNodes().filter(n => n.type == 'user')
                updateTreeHeight()
            }).finally(() => {
                loadingOrgTree.value = false
            })
        }
    },
    {
        deep: true
    }
)

const updateTreeHeight = () => {
    if (treeWrapperRef.value) {
        const height = treeWrapperRef.value.clientHeight
        // 留一点padding，避免滚动条
        treeHeight.value = Math.max(height - 4, 100)
    }
}


onMounted(() => {
    // 初始化计算
    nextTick(() => {
        updateTreeHeight()
    })

    // 监听容器大小变化
    if (treeWrapperRef.value) {
        resizeObserver = new ResizeObserver(() => {
            updateTreeHeight()
        })
        resizeObserver.observe(treeWrapperRef.value)
    }

    // 监听窗口大小变化
    window.addEventListener('resize', updateTreeHeight)
})

onBeforeUnmount(() => {
    if (resizeObserver) {
        resizeObserver.disconnect()
    }
    window.removeEventListener('resize', updateTreeHeight)
})
// 预定义一组背景色用于区分不同用户
const avatarColors = [
  '#409EFF', // 蓝色
  '#67C23A', // 绿色
  '#E6A23C', // 黄色
  '#F56C6C', // 红色
  '#909399', // 灰色
  '#9254DE', // 紫色
  '#36CFC9', // 青色
  '#FF9C6E', // 橙色
];

// 根据用户名生成固定的背景色
const getAvatarColor = (name: string): string => {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};
const handleCheckClick = (node, obj) => {
    selected.value = obj.checkedNodes.filter(n => n.type == 'user')
};

const handleSelectedMemberDelete = (data) => {
  const ckeys = selected.value
  const nkeys = ckeys.reduce((acc, curr) => {
    if (curr.id !== data.id) {
      acc.push(curr)
    }
    return acc
  }, [])
  selected.value = nkeys
  orgTreeRef.value.setChecked(data.id, false)
};

const remoteSearch = (query: string) => {
    searchLoading.value = true;
    searchOrganizationNode(query).then(res => {
        searchoptions.value = res.results;
    }).finally(() => {
        searchLoading.value = false;
    });
}


const highlightNode = (id: string) => {
    if (!orgTreeRef.value) return

    // 2. 递归展开目标路径
    expandPathTo(id)

    // 3. 高亮目标节点
    orgTreeRef.value.setCurrentKey(id)
}

// 辅助：递归展开从根到目标节点的路径
const expandPathTo = (targetId: string) => {
    const expandNode = (nodeId: string) => {
        const node = orgTreeRef.value?.store.nodesMap[nodeId]
        if (node) {
            node.expand()
            if (node.parent && node.parent.id !== 'root') {
                expandNode(node.parent.key)
            }
        }
    }
    expandNode(targetId)
}

const handleFilterChange = async (id) => {
    orgTreeRef.value.setExpandedKeys([id])
    setTimeout(() => {
        orgTreeRef.value.scrollToNode(id)
        orgTreeRef.value?.setCurrentKey(id)
    }, 500)
    return
}

// todo
const handleEnsureClick = () => {
    const users = selected.value.map(s => {
        const user = s.code
        const name = s.name
        return { user, name }
    })
    let t = tenantId.value
    console.log('handleEnsureClick', t)
    postUser(t, users).then(() => {
        console.log('handleEnsureClick add')
        ElMessage({
            type: "success",
            message: "添加成员成功",
        });
        emit("add");
    }).catch(err => {
        console.log(err)
        ElMessage({
            type: "warning",
            message: "添加成员失败",
        });
    })
}

const handleCancelClick = () => {
    emit("cancel");
}

</script>

<style scoped lang="less">
.add-member {
    height: 60vh;
    overflow: hidden;
    display: flex;
}
.left-col, .right-col{
  padding: 0 20px;
  flex: 1;
}

:deep(.org) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 60px);
    overflow-y: auto;
}

.normal-user {
    font-weight: 400;
    font-size: 14px;
    color: #969FAD;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    margin-top: 8px;
}

.selected-label {
    font-weight: 400;
    font-size: 14px;
    color: #969FAD;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    flex-shrink: 0;
    padding-bottom: 12px;
}

.custom-tree-node {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    flex-shrink: 0;

    .label {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
    }

}

.dialog-footer {
    display: flex;
    flex-direction: row-reverse;
    gap: 8px;
    margin-top: 16px;
}
.option-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
  margin-right: 8px;
}

.dept-avatar {
  background-color: #C0C4CC;
}

.user-name {
  flex-shrink: 0;
  margin-right: 4px;
}

.user-code {
  color: #8492a6;
  font-size: 12px;
  flex-shrink: 0;
  margin-right: 8px;
}

.user-path {
  color: #8492a6;
  font-size: 12px;
  margin-left: auto;
  text-align: right;
}
.tree-node-content {
  display: flex;
  align-items: center;
  width: 100%;

  .node-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tree-avatar {
    width: 22px;
    height: 22px;
    font-size: 10px;
    margin-right: 6px;
  }

  .user-code {
    color: #8492a6;
    font-size: 12px;
    margin-left: 8px;
    flex-shrink: 0;
  }
}
.right-col {
  border-left: 1px solid #dcdfe6;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-items: stretch;
}
.selected-list{
  flex: 1;
}
.user-info{
  display: flex;
  align-items: center;
  line-height: 32px;
  .tree-avatar{
    width: 22px;
    height: 22px;
  }
}
</style>
