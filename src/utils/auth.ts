import { getToken } from "@/service/auth";
import router from '@/router'

export function goUnifiedlogin() {
  const urlParams = location.protocol + "//" + location.host + "/";
  const encodestr: string = encodeURIComponent(urlParams);
  // 这里后续做开发环境的登陆跳转对接
  location.href = `${import.meta.env.VITE_SSO_LOGIN_URL
    }?redirect_url=${encodestr}&response_type=code&state=${Date.now()}`;
}

// 同步登录中台信息
export const accessUnitlogin = async () => {
  console.log("开始同步中台信息", import.meta.env.MODE);
  if (import.meta.env.MODE !== "production") {
    await accessUnitloginBydev();
  } else {
    await accessUnitloginByprod();
  }
};

// 开发环境
// 需要 console_token
const accessUnitloginBydev = async () => {
  router.push('/signin')
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
