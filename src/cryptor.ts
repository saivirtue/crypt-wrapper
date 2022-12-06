import CryptoJS from 'crypto-js';

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
