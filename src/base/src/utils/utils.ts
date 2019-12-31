import * as moment from 'moment';

/**
 * @file 获取url参数值
 * @param {string} name 需要获取的参数名
 * @param {string} url 可选，需要获取参数的url
 * @return {string} 返回获取的参数值
 */

export const getUrlParam = (name: string, url?: string) => {
  if (!name) {
    return '';
  }
  url = url || location.search || location.hash;
  name = name.replace(/(?=[\\^$*+?.():|{}])/, '\\');
  const reg = new RegExp('(?:[?&]|^)' + name + '=([^?&#]*)', 'i');
  const match = url.match(reg);
  return !match ? '' : decodeURIComponent(match[1]);
};
