import { getTokenList } from "../service/tenant";
import { rsaEncrypt } from "./encrypt";

export function goUnifiedlogin() {
  const urlParams = location.protocol + "//" + location.host + "/apps/projects";
  const encodestr: string = encodeURIComponent(urlParams);
  location.href = `${
    import.meta.env.VITE_SSO_LOGIN_URL
  }?redirectUrl=${encodestr}`;
}

// 同步登录中台信息
export const accessUnitlogin: ({
  certifiedName,
  uuid,
  token,
}?: {
  certifiedName?: string;
  uuid?: string;
  token?: string;
}) => Promise<any> = async (params) => {
  const url = new URL(location.href);
  const certifiedName =
    params?.certifiedName || url.searchParams.get("certifiedName");
  const uuid = params?.uuid || url.searchParams.get("uuid");
  const token = params?.token || url.searchParams.get("token");
  const storageName = localStorage.getItem("maasUser");
  if (certifiedName || storageName) {
    if (certifiedName) {
      const urlUser: string = certifiedName as string;
      localStorage.setItem("maasUser", urlUser);
    }

    const targetObject = {
      username: localStorage.getItem("maasUser"), //?.replace(/\@.*$/, ''),
      email: localStorage.getItem("maasUser"),
    };
    const HTTP_USER_INFO = rsaEncrypt(JSON.stringify(targetObject)) || "";
    try {
      const { data } = await getTokenList(HTTP_USER_INFO);
      localStorage.setItem("console_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      globalThis.location.reload();
    } catch (e) {
      console.log(e);
    }
  } else {
    goUnifiedlogin();
  }
};
