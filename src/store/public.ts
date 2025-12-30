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

// 后续可以放到 utils 里面
function flat(tree: PublicFolderNode[], nodeMap: Record<string, PublicFolderNode>) {
  if (!Array.isArray(tree)) {
    return nodeMap
  }

  for (const node of tree) {
    nodeMap[node.id] = node
    if (node.children && node.children.length > 0) {
      flat(node.children, nodeMap)
    } else {
      node.children = []
    }
  }

  return nodeMap
}

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
    async initPublicTree() {
      const res = await getFolder()
      console.log(res)
      this.nodeMap = {};
      this.folderTree = res.data as unknown as PublicFolderNode[];
      flat(this.folderTree, this.nodeMap)
      return this.folderTree
    },
    async getNodeChildren(node: PublicFolderNode) {
      // init
      if (node instanceof Array) {
        await this.initPublicTree()
        return []
      }

      if (node.level <= MAX_LEVEL) {
        const res = await getFolder(node.id).catch((err) => {
          console.log(err);
        });
        console.log('res')
        const folder = this.nodeMap[node.id];
        folder.children = res.data;
        folder.children.forEach((c) => {
          this.nodeMap[c.id] = c
        })
        return folder.children;
      } else {
        return [];
      }
    },
    async appendNode(node: PublicFolderNode, name: string) {
      if (node.level >= MAX_LEVEL) {
        console.log("层级已达上限");
        return false;
      }
      const res = await postCreateFolder(name, Number(node.level) + 1, node.id)
      const id = res.folder_id
      const newNode = {
        id,
        name,
        level: Number(node.level) + 1,
        children: [],
        parent_id: node.id
      }
      if (newNode.parent_id) {
        const folder = this.nodeMap[newNode.parent_id];
        folder.children.push(newNode);
      } else {
        this.folderTree.push(newNode);
      }
      this.nodeMap[id] = newNode;
    },
    async deleteNode(node: PublicFolderNode) {
      if (node?.children?.length > 0) {
        throw new Error("请先删除子节点");
      }
      console.log('deleteNode', node)
      await deleteFolder(node.id).then(() => {
        if (node.parent_id) {
          const index = this.nodeMap[node.parent_id].children.findIndex(x => x.id == node.id)
          if (index != -1) {
            this.nodeMap[node.parent_id].children.splice(index, 1)
          } else {
            console.log('deleteFolder not found index ', node.parent_id)
          }
          this.nodeMap[node.parent_id].children.splice(index, 1)
        } else {
          const index = this.folderTree.findIndex(x => x.id == node.id)
          if (index != -1) {
            this.folderTree.splice(index, 1)
          } else {
            console.log('deleteFolder not found index.')
          }
          this.folderTree = [...this.folderTree]
        }
        delete this.nodeMap[node.id]
      });
    },
    async renameNode(node: PublicFolderNode, name: string) {
      return await renameFolder(node.id, name).then((res) => {
        this.nodeMap[node.id].name = name 
      });
    },
    updateCurrentNode(node: PublicFolderNode) {
      this.currentNode = this.nodeMap[node.id];
    },
  },
});
