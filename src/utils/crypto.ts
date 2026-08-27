import CryptoJS from 'crypto-js'

// 加密密钥，建议在不同环境中使用不同的密钥，并且不要将密钥提交到版本控制系统中,可以创建 .env.**.local 来存储密钥
const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY || 'default-key'

export const encrypt = (data: any): string => {
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data)
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString()
}

export const decrypt = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
    if (!decryptedString) return null
    try {
      return JSON.parse(decryptedString)
    } catch {
      return decryptedString
    }
  } catch {
    return null
  }
}

export const serializer = {
  serialize: (state: any) => encrypt(state),
  deserialize: (data: string) => decrypt(data)
}
