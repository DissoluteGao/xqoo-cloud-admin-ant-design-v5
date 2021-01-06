/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import {xqooConstants} from "../../config/xqooConstants";

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

// 获取随机字符串或者自定字符串中随机抽取
export const randomString = (length: number, charSet?: string | undefined): string => {
  let defaultStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  if (charSet) {
    defaultStr = charSet;
  }
  let randomStr = '';
  for (let i = 0; i < length; i += 1) {
    const randomPoz = Math.floor(Math.random() * defaultStr.length);
    randomStr += defaultStr.substring(randomPoz, randomPoz + 1);
  }
  return randomStr;
};

// 设置本地缓存
export const setLocalStorage = (key: string, value: any, type: 'json' | 'other'): void => {
  try {
    if (type === 'json') {
      localStorage.setItem(xqooConstants.storagePrefix + key, JSON.stringify(value));
      return;
    }
    localStorage.setItem(xqooConstants.storagePrefix + key, value);
  } catch (e) {
    console.log('setLocalStorage error!', e);
  }
};

// 获取本地缓存
export const getLocalStorage = (
  key: string,
  type: 'json' | 'other',
): object | string | undefined => {
  const value = localStorage.getItem(xqooConstants.storagePrefix + key) || '';
  if (!value) {
    return undefined;
  }
  try {
    if (type === 'json') {
      return JSON.parse(value);
    }
    return value;
  } catch (e) {
    console.log('getLocalStorage error!', e);
    return undefined;
  }
};

// 清除本地缓存
export const removeLocalStorage = (key: string): void =>{
  localStorage.removeItem(xqooConstants.storagePrefix + key);
}
