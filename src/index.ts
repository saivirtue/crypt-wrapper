import { isObj, traverseObj } from './utils';
const Jasypt = require('jasypt');

export class Crypt {
  private jasypt: typeof Jasypt;

  constructor() {
    this.jasypt = new Jasypt({
      iteration: 1,
      password: '@password',
    });
  }

  private encryptObject(obj: any, fields: string[] | undefined): any {
    if (!isObj(obj)) {
      return this.jasypt.encrypt(obj);
    }
    const returnObject = traverseObj(obj, fields, this.jasypt.encrypt.bind(this.jasypt));
    return returnObject;
  }

  private decryptObject(obj: any, fields: string[] | undefined): any {
    if (!isObj(obj)) {
      return this.jasypt.decrypt(obj);
    }
    const returnObject = traverseObj(obj, fields, this.jasypt.decrypt.bind(this.jasypt));
    return returnObject;
  }

  /**
   * 加密輸入的instance陣列
   *
   * @template T Input資料的型態
   * @param {T[]} instances 要加密的資料陣列
   * @param {(string[] | undefined)} [fields=undefined] 指定要加密的欄位，預設為所有欄位
   * @return {*}  {T[]} 加密後的資料陣列
   * @memberof Crypt
   */
  encrypt<T>(instances: T[], fields: string[] | undefined = undefined): T[] {
    const encryptedInstances = [];

    // TODO initial jasypt password
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
   * @param {(string[] | undefined)} [fields=undefined] 指定要解密的欄位，預設為所有欄位
   * @return {*}  {T[]} 解密後的資料陣列
   * @memberof Crypt
   */
  decrypt<T>(instances: T[], fields: string[] | undefined = undefined): T[] {
    const decryptedInstances = [];

    for (const instance of instances) {
      decryptedInstances.push(this.decryptObject(instance, fields));
    }
    return decryptedInstances;
  }
}
