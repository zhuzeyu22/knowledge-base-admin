import { getTokenList } from "@/service/tenant";
import { getToken } from "@/service/auth";
import { rsaEncrypt } from "./encrypt";

export function goUnifiedlogin() {
  const urlParams = location.protocol + "//" + location.host + "";
  const encodestr: string = encodeURIComponent(urlParams);
  location.href = `${
    import.meta.env.VITE_SSO_LOGIN_URL
  }?redirectUrl=${encodestr}&respoense_type=code&state=${Date.now()}`;
}

// 同步登录中台信息
export const accessUnitlogin = async () => {
  console.log("开始同步中台信息",  import.meta.env.MODE);
  if (import.meta.env.MODE !== "production") {
    await accessUnitloginBydev();
  } else {
    await accessUnitloginByprod();
  }
};

// 开发环境
// 需要 console_token
const accessUnitloginBydev = async () => {
  const url = new URL(location.href);
  const certifiedName = url.searchParams.get("certifiedName");
  // token 没有使用，后续也许会用
  const token = url.searchParams.get("token");

  //  更新用户信息
  if (certifiedName) {
    localStorage.setItem("maasUser", certifiedName);
  }

  const storageName = localStorage.getItem("maasUser");

  if (storageName) {
    const targetObject = {
      username: localStorage.getItem("maasUser"), //?.replace(/\@.*$/, ''),
      email: localStorage.getItem("maasUser"),
    };
    const HTTP_USER_INFO = rsaEncrypt(JSON.stringify(targetObject)) || "";
    try {
      const { data } = await getTokenList(HTTP_USER_INFO);
      localStorage.setItem("console_token", data.access_token);
      globalThis.location.reload();
    } catch (e) {
      console.log(e);
    }
  } else {
    goUnifiedlogin();
  }
};

// 生产环境
const accessUnitloginByprod = async () => {
  const url = new URL(location.href);
  const code = url.searchParams.get("code");
  if (code) {
    await getToken(code).then((res) => {
      localStorage.setItem("console_token", res.data.access_token);
    });
  }
};
