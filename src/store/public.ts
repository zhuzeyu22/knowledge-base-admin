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
      nodeMap: {} as Record<string, PublicFolderNode>,
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
    // 递归构建节点映射表
    buildNodeMap(nodes: PublicFolderNode[]) {
      nodes.forEach((node) => {
        this.nodeMap[node.id] = node;
        if (node.children) this.buildNodeMap(node.children);
      });
    },
    async initPublicTree() {
      await getFolder().then((res) => {
        this.setPublicTree(res.data);
      });
    },
    setPublicTree(data: PublicFolderNode[]) {
      this.folderTree = data;
      this.nodeMap = {};
      this.buildNodeMap(data);
    },
    async getNodeChildren(node: PublicFolderNode) {
      if (node.level <= MAX_LEVEL) {
        const res = await getFolder(node.id).catch((err) => {
          console.log(err);
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

      await postCreateFolder(name, node.level, node.id).then((res) => {
        node.id = res.data.folder_id;
        if (node.parent_id != null && node.parent_id != undefined) {
          const folder = this.nodeMap[node.parent_id];
          folder.children.push(node);
        } else {
          this.folderTree.push(node);
        }
        this.nodeMap[node.id] = node;
      });
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
      this.currentNode = this.nodeMap[node.id];
    },
  },
});
