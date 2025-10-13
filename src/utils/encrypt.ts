import JSEncrypt from 'jsencrypt'
// btoa base64 编码
const PKeyA = 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FDZms5YTRZWGhzMHdoMkljb1ZoZ25ZUy96QwpsZDZZSDd6NHdUN0NGQXB5N3J2UDF3YVhoZUhHQVB0Q3B6ZWE5ZzFVd1NNaWorK1dHM2pLK3R1cXRFV1JMb2htCjRnY0h3NFJKOUdja0RVNUxZTElvdzVBbDZRb0xQZVNZYmpLZ0g5c1NaRnEvYVZBbld1a1ByVGZjZkM2dHk5bUEKdWVNdW4zTWdpdTErUGpXZ1R3SURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQ=='
/**
 * 加m
 * @param {String} 待加m
 * */
export function rsaEncrypt(data: string) {
  // 使用公钥加ma
  let encryptor = new JSEncrypt() // 新建JSEncrypt对象
  encryptor.setPublicKey(atob(PKeyA)) // 设置公钥
  const rsaDta = encryptor.encrypt(data) // 进行加m
  return rsaDta
}