import request from "./request";

export const getTokenList = (HTTP_USER_INFO: string) => {
  return request.post(
    "/app/account/sso_login",
    { HTTP_USER_INFO },
    {
      baseURL: "/tenant/api",
    }
  );
};
