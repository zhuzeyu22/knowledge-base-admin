import { defineStore } from "pinia";
import { PublicFolderNode } from "@/models/public";
import {
  deleteFolder,
  getFolder,
  postCreateFolder,
  renameFolder,
} from "@/service/public";

// 只有 0,1,2,3
export const MAX_LEVEL = 3;

export const usePublicStore = defineStore("public", {
  state: () =>
    // 新建的名称
    ({
      folderTree: [] as PublicFolderNode[],
      currentNode: null as PublicFolderNode | null,
    }),
  getters: {
    // 计算属性
    getPublicTree: (state) => {
      return state.folderTree;
    },
    // 点击的节点
    getCurrentNode: (state) => {
      return state.currentNode;
    },
  },
  actions: {
    // 方法
    setPublicTree(data: PublicFolderNode[]) {
      this.folderTree = data;
    },
    async getNodeChildren(node: PublicFolderNode) {
      if (node.level <= MAX_LEVEL) {
        const res = await getFolder(node.id)
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            // todo mock
            node.children = [
              {
                id: node.id + "-1",
                name: "新建文件夹新建文件夹",
                level: Number(node.level) + 1,
                children: [],
                parentId: node.id,
              },
            ];
          });
        // node.children = res.data;
        return node.children;
      } else {
        return [];
      }
    },
    async appendNode(node: PublicFolderNode, name: string) {
      if (node.level >= MAX_LEVEL) {
        console.log("层级已达上限");
        return false;
      }

      await postCreateFolder(name, node.level, node.id)
        .then((res) => {
          node.children.push({
            name,
            // todo 这里需要测试下
            id: res.data,
            level: Number(node.level) + 1,
            children: [],
          });
        })
        .catch((err) => {});
    },
    async deleteNode(node: PublicFolderNode) {
      if (node?.children?.length > 0) {
        throw new Error("请先删除子节点");
      }
      await deleteFolder(node.id).then((res) => {
        console.log(res);
      });
    },
    async renameNode(node: PublicFolderNode, name: string) {
      return await renameFolder(node.id, name).then((res) => {
        console.log(res);
      });
    },
    updateCurrentNode(node: PublicFolderNode) {
      this.currentNode = node;
    },
  },
});
