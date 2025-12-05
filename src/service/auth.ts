import request from "./request";

export const getToken = (code: string) => {
  return request.get(`/yidian/queryKnowledgeToken?code=${code}`, {
    baseURL: "/aipauth",
  });
};
