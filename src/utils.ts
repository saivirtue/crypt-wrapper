import CryptoJS from 'crypto-js';

function hierarchyFields(fields?: string[]) {
  if (!fields) return undefined;
  const extractedFields = [];
  for (const field of fields) {
    extractedFields.push(field.substring(field.indexOf('.') + 1));
  }
  return extractedFields;
}

export function isObj(obj: any) {
  return !!obj && typeof obj === 'object' && !Array.isArray(obj);
}

export function isArray(obj: any) {
  return !!obj && Array.isArray(obj);
}

export function isString(obj: any) {
  return typeof obj === 'string' || obj instanceof String;
}

export function traverseObj(obj: any, fn: (input: string) => string, fields?: string[]) {
  if (isString(obj)) {
    return fn(obj);
  }
  const returnObject = structuredClone(obj);
  for (const key in obj) {
    // check if the fields was defined AND no matched fields in data
    if (!!fields && fields.every((field) => !field.startsWith(key))) {
      continue;
    }
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    const value = obj[key];
    if (isObj(value)) {
      returnObject[key] = traverseObj(value, fn, hierarchyFields(fields));
    } else if (isString(value)) {
      const decryptedValue = fn(value);
      returnObject[key] = decryptedValue;
    } else if (isArray(value)) {
      const decryptedArray: any[] = [];
      for (const item of value) {
        decryptedArray.push(traverseObj(item, fn, hierarchyFields(fields)));
      }
      returnObject[key] = decryptedArray;
    }
  }
  return returnObject;
}

const key256bits = (secret: string, salt: CryptoJS.lib.WordArray) =>
  CryptoJS.PBKDF2(secret, salt, { keySize: 256 / 32 });

const cipherOption = (iv: CryptoJS.lib.WordArray) => ({
  iv,
  padding: CryptoJS.pad.Pkcs7,
  module: CryptoJS.mode.CBC,
});

export function encrypt(input: string, secret: string) {
  // random 16 bytes salt string (equal to 32 hex string)
  const salt = CryptoJS.lib.WordArray.random(16);
  // random 16 bytes initial vector (equal to 32 hex string)
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(input, key256bits(secret, salt), cipherOption(iv));
  const encryptedMsg = salt.toString() + iv.toString() + encrypted.toString();
  return encryptedMsg;
}

export function decrypt(input: string, secret: string) {
  const key = key256bits(secret, CryptoJS.enc.Hex.parse(input.substring(0, 32)));
  const decrypted = CryptoJS.AES.decrypt(
    input.substring(64),
    key,
    cipherOption(CryptoJS.enc.Hex.parse(input.substring(32, 64))),
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}
