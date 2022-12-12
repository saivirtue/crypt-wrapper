![Repo Version](https://img.shields.io/github/package-json/v/saivirtue/wistroni40-crypt)
![License](https://img.shields.io/github/license/saivirtue/wistroni40-crypt)
![Node Version](https://img.shields.io/node/v/wistroni40-crypt)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/saivirtue/wistroni40-crypt/Node.js%20CI)

# Wistron i4.0 Crypto Utility

This is a wrapper encryption utility of [crypto-js](https://www.npmjs.com/package/crypto-js).

- [Quick Start](#quick-start)
- [Encrypt](#encrypt)
- [Decrypt](#decrypt)

# Quick Start

1. Install package

```bash
> npm i wistroni40-crypt
```

2. Simple Usage

```js
import { Cryptor } from 'wistroni40-crypt';

const cryptor = new Cryptor();
const data = { simple: 'data' };
[data] === cryptor.decrypt(cryptor.encrypt([data])); // true
```

# Encrypt

```js
import { Cryptor } from 'wistroni40-crypt';

// 使用預設的金鑰來測試 (只會加密一次)
// const cryptor = new Cryptor();

// 指定加密金鑰 (可以只給一組；生產環境建議給兩組)
const cryptor = new Cryptor('@PreV_k$y', '@P0sT_k$y');

// 加密回來的資料格式與加密前相同
const data = {
  bar: 'foo',
  aInt: 123,
  hello: 'crypt',
};
const cryptedData = cryptor.encrypt([data]); // 'bar' in cryptedData[0]

// 可以傳入陣列資料
const array = [
  {
    bar: 'foo',
    aInt: 123,
    hello: 'crypt',
  },
];
const cryptedData = cryptor.encrypt(array);

// 可以指定要加密的欄位
const array = [
  {
    bar: 'foo',
    aInt: 123,
    hello: 'crypt',
    nested: {
      hi: 'i am here',
    },
  },
];
const cryptedData = cryptor.encrypt(array, ['hello', 'nested.hi']);
cryptedData[0].bar === 'foo'; // true
cryptedData[0].nested.hi !== 'i am here'; // true
```

# Decrypt

```js
import { Cryptor } from 'wistroni40-crypt';

const cryptor = new Cryptor('@PreV_k$y', '@P0sT_k$y');

// 解密時需要用同一個Cryptor Instance
const array = [
  {
    bar: 'foo',
    aInt: 123,
    hello: 'crypt',
  },
];
const cryptedData = cryptor.encrypt(array);
array === cryptor.decrypt(cryptedData); // true

// 如果有指定欄位加密，解密時一樣要需要指定
const array = [
  {
    bar: 'foo',
    aInt: 123,
    hello: 'crypt',
  },
];
const cryptedData = cryptor.encrypt(array, ['bar']);
array === cryptor.decrypt(cryptedData, ['bar']); // true
```
