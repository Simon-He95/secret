import fs from 'fs'
import Ncrypt from 'ncrypt-js'
import { getPkg, jsShell } from 'simon-js-tool'
import figlet from 'figlet'
import fg from 'fast-glob'
import ora from 'ora'
import type { Secret } from './types'
export function secret() {
  figlet('secret', async (err, data) => {
    if (err)
      return console.log('Something went wrong...')
    console.log(data)
    const action = jsShell('gum choose "encrypt" "decrypt"')?.trim()
    const decrypt = action === 'decrypt'
    const spinner = ora(`Loading ${action}`).start()
    const pkg = await getPkg('./package.json')
    const hasCache = jsShell('test -f ~/secret_key.txt && echo "true" || echo "false"')?.trim()
    const secret = pkg.secret as Secret
    const key = (hasCache === 'true'
      && jsShell('cat ~/secret_key.txt')?.trim())
      || (secret.key || jsShell('gum input --placeholder "input key"'))?.trim()
    if (!secret)
      return spinner.fail('secret is not defined in package.json')
    if (!key)
      return spinner.fail('key is not defined or empty')
    const ignore = secret.ignore || []
    if (!key)
      return spinner.fail('secret key is not defined in package.json or arguments')
    const ncryptObject = new Ncrypt(key)
    const includes = secret.includes || []
    const flag = '// encrypted'
    const entries = await fg(includes, {
      ignore: ['**.jpg', '**.png', '**.gif', ...ignore],
    })
    try {
      entries.forEach(entry => endecrypt(entry))
      spinner.succeed(`${action} completed`)
    }
    catch (error: any) {
      spinner.fail(error?.message ?? error)
    }
    function endecrypt(url: string) {
      spinner.text = `${action} ${url}`
      const content = fs.readFileSync(url, 'utf8')
      let encryptedContent = ''
      let decryptedContent = ''
      if (content.startsWith(flag) && !decrypt)
        return
      if (!content.startsWith(flag)) {
        const _encryptedContent = ncryptObject.encrypt(content)
        encryptedContent = _encryptedContent && flag + _encryptedContent
        jsShell(`echo ${key}> ~/secret_key.txt`)
      }
      if (decrypt) {
        if (!content.startsWith(flag))
          throw new Error('can\'t decrypted not encrypted content')
        try {
          decryptedContent = ncryptObject.decrypt(content.slice(12))
        }
        catch (error) {
          jsShell('echo ""> ~/secret_key.txt')
          throw new Error('decrypted key is not valid')
        }
      }
      fs.writeFileSync(
        url,
        decrypt
          ? decryptedContent
          : encryptedContent,
        'utf8')
    }
  })
}

secret()

