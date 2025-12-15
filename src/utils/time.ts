export function formatTimestamp(timestamp: number) {
  // 自动判断是秒（10位）还是毫秒（13位）
  const isInSeconds = String(timestamp).length === 10;
  const timeInMs = isInSeconds ? timestamp * 1000 : timestamp;

  const date = new Date(timeInMs);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}