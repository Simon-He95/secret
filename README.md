## secret
灵感启发于[geekris1/funnycode](https://github.com/geekris1/funnycode), 实现一种代码的加密和解密方式。


## 安装
```bash 
  npm install -g @simon_he/secret
```

## 用法
- 加密 : 需要指定一个key,作为解密的密钥

```bash
  secret --key=123
```

- 解密 : 需要指定一个key,作为解密的密钥

```bash
  secret --key=123 --decrypt
```

## 技巧
- key可在package.json中提前配置
- includes可配置需要被加密的目录或文件类型

```bash
  "secret": {
    "key": "123",
    "includes": [
      "**/*.js",
      "**/*.json"
    ]
  }
```

## 提醒:
- 以防突发的错误导致代码的丢失, 请提前做一个备份 :)
