import { defineStore } from "pinia";
import { PublicFolderNode } from "@/models/public";
import {
  deleteFolder,
  getFolder,
  postCreateFolder,
  renameFolder,
} from "@/service/public";

export const MAX_LEVEL = 4;

export const usePublicStore = defineStore("public", {
  state: () =>
    // 新建的名称
    ({
      root: {
        id: "",
        level: 0,
        name: "公共知识库",
        children: [],
      } as PublicFolderNode,
    }),
  getters: {
    // 计算属性
    getPublicTree: (state) => {
      return state.root;
    },
  },
  actions: {
    // 方法
    setPublicTreeRoot(data: PublicFolderNode) {
      this.root = data;
    },
    async getNodeChildren(node: PublicFolderNode) {
      //   node.children = children;
      const res = await getFolder(node.id);
      if (node.level < MAX_LEVEL) {
        node.children = res.data;
      }
      return res;
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
      if (node.children.length > 0) {
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
  },
});
