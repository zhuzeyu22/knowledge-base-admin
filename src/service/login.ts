import request from "./request";

export const postLogin = (email: string, password: string) => {
  return request.post<{ result: string; data: any }>("/login", {
    email,
    password,
    language: "zh-Hans",
    remember_me: true,
  });
};
