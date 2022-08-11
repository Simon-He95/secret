import fs from 'fs'
import Ncrypt from 'ncrypt-js'
import { getPkg, transformArgv } from 'simon-js-tool'
import fg from 'fast-glob'
import type { Secret } from './types'
export async function secret() {
  const pkg = await getPkg('./package.json')
  const secret = pkg.secret as Secret
  if (!secret)
    throw new Error('secret is not defined in package.json')
  const { key, decrypt } = transformArgv()
  const ncryptObject = new Ncrypt(secret.key || key)
  const includes = secret.includes || []
  const flag = '// encrypted'
  const entries = await fg(includes)
  entries.forEach(entry => endecrypt(entry))
  function endecrypt(url: string) {
    const content = fs.readFileSync(url, 'utf8')
    let encryptedContent = ''
    let decryptedContent = ''
    if (content.startsWith(flag) && !decrypt)
      return
    if (!content.startsWith(flag)) {
      const _encryptedContent = ncryptObject.encrypt(content)
      encryptedContent = _encryptedContent && flag + _encryptedContent
    }
    if (decrypt) {
      if (!content.startsWith(flag))
        throw new Error('can\'t decrypted not encrypted content')
      decryptedContent = ncryptObject.decrypt(content.slice(12))
    }
    fs.writeFileSync(
      url,
      decrypt
        ? decryptedContent
        : encryptedContent,
      'utf8')
  }
}

secret()

