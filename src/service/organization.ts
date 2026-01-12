import { OrganizationNode } from "@/models/organization";
import request from "./request";

// 获取组织结构
// organization/tree
export const getOrganizationTree = () => {
  return request.get<{
    current_user_id: string,
    tree: OrganizationNode[];
  }>(`/organization/tree`);
};

// 组织架构节点模糊查询
// /console/api/organization/search
export const searchOrganizationNode = (
  keyword: string,
  type: string = "all",
  max_count: number = 100
) => {
  return request.get<{
    results: OrganizationNode[];
    total: number;
    keyword: string;
  }>(`/organization/search`, {
    params: {
      keyword,
      type,
      max_count,
    },
  });
};
