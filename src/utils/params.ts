export function parseQuery(search = window.location.search) {
  // 去掉开头的 '?'
  const str = search.startsWith("?") ? search.slice(1) : search;
  if (!str) return {};

  const params: Record<string, string> = {};
  const pairs = str.split("&");

  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    if (key) {
      // 解码 URI 组件（处理中文、特殊字符）
      params[decodeURIComponent(key)] = value
        ? decodeURIComponent(value.replace(/\+/g, " "))
        : "";
    }
  }

  return params;
}

export function getQueryParam(key: string, search = window.location.search) {
  const params = parseQuery(search);
  return params[key] || null;
}
