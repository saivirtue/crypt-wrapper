import { createHash } from 'crypto';
import { decrypt as dec, encrypt as enc, traverseObj } from './utils';

export class Cryptor {
  /**
   * 建立Cryptor類別物件.
   *
   * 注意: 預設會有一把金鑰可以用來測試，但在生產環境中，你應該提供兩把金鑰
   *
   * @param {string} [prevKey] 加解密用的第一把金鑰
   * @param {string} [postKey] 加解密用的第二把金鑰
   * @memberof Crypt
   */
  constructor(protected prevKey: string = 'iwnjnzmdooqjdnhpetf', protected postKey?: string) {}

  private encryptObject(data: any, fields?: string[]): any {
    let returnObject = traverseObj(data, (input: string) => enc(input, this.prevKey), fields);

    const withHashEncrypt = (postKey: string) => (input: string) => {
      const encryptObj = enc(input, postKey);
      const hash = createHash('MD5').update(encryptObj).digest('hex');
      return `${hash}.${encryptObj}`;
    };

    if (this.postKey) {
      returnObject = traverseObj(returnObject, withHashEncrypt(this.postKey), fields);
    }
    return returnObject;
  }

  private decryptObject(data: any, fields?: string[]): any {
    let returnObject = data;

    const checkAndDecrypt = (postKey: string) => (input: string) => {
      const idx = String(input).indexOf('.');
      const splits = String(input).split('.');
      if (idx !== -1 && splits[0] === createHash('MD5').update(splits[1]).digest('hex')) {
        return dec(splits[1], postKey);
      } else {
        // Could not recognized the encrypted input, return empty
        return '';
      }
    };
    if (this.postKey) {
      returnObject = traverseObj(returnObject, checkAndDecrypt(this.postKey), fields);
    }
    returnObject = traverseObj(returnObject, (input: string) => dec(input, this.prevKey), fields);
    return returnObject;
  }

  /**
   * 加密輸入的instance陣列
   *
   * @template T Input資料的型態
   * @param {T[]} instances 要加密的資料陣列
   * @param {string[]} [fields] 指定要加密的欄位，預設為所有欄位
   * @return {*}  {T[]} 加密後的資料陣列
   * @memberof Crypt
   */
  encrypt<T>(instances: T[], fields?: string[]): T[] {
    const encryptedInstances = [];

    for (const instance of instances) {
      encryptedInstances.push(this.encryptObject(instance, fields));
    }

    return encryptedInstances;
  }

  /**
   * 解密輸入的instance陣列
   *
   * @template T input資料的型態
   * @param {T[]} instances 要解密的資料陣列
   * @param {string[]} [fields] 指定要解密的欄位，預設為所有欄位
   * @return {*}  {T[]} 解密後的資料陣列
   * @memberof Crypt
   */
  decrypt<T>(instances: T[], fields?: string[]): T[] {
    const decryptedInstances = [];

    for (const instance of instances) {
      decryptedInstances.push(this.decryptObject(instance, fields));
    }
    return decryptedInstances;
  }
}
