import * as CryptoJS from 'crypto-js';
import {xqooConstants} from "../../../config/xqooConstants";
const key = CryptoJS.enc.Utf8.parse(xqooConstants.aesKey);
const data = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
};

export const aesEncode = (content: string) : string => {
  try {
    const code = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(content), key, data);
    return code.toString()
  }catch (e) {
    console.error('encode AES error!',e)
    return ''
  }
};

export const aesDecode = (content: string) : string => {
  try {
    const code = CryptoJS.AES.decrypt(content, key, data);
    return code.toString(CryptoJS.enc.Utf8)
  }catch (e) {
    console.error('decode AES error!',e)
    return ''
  }
};
