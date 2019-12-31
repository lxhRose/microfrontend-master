import fetch from 'dva/fetch';
import { stringify } from 'qs';
import { notification } from 'antd';
import { URL } from "./requestUrl";
import { getParams } from "./getParams";

const BASE_URL = process.env.NODE_ENV === 'production'
  ? `${URL}/topro/`
  : 'api/';
function notifyException(data) {
  if (data.code !== 'SUCCESS') {
    notification.error({
      message: '错误提示',
      description: data.msg
    });
  }
  return data
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options?) {
  const newOptions = { ...options, credentials: 'include' };
  let newUrl = BASE_URL + url;
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (newOptions.params instanceof FormData) {
      newOptions.headers = {};
      newOptions.body = newOptions.params;
    } else {
      newOptions.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      };
      newOptions.body = JSON.stringify(newOptions.params);
    }
  } else if (newOptions.method === 'GET' || newOptions.method === 'DELETE') {
    newOptions.headers = {};
    newUrl = newOptions.params
      ? `${newUrl}?${stringify(newOptions.params)}`
      : newUrl;
  }
  const token = getParams('token');
  if (token) {
    newOptions.headers.token = token;
  }
  // if (sessionStorage.getItem('token')) {
  //   newOptions.headers.token = sessionStorage.getItem('token');
  // }
  return fetch(newUrl, newOptions)
    .then((response) => response.json())
    .then(notifyException)
    .then((data) => data)
    .catch((error) => {
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: '服务器异常',
          description: '服务器异常，请刷新页面重试！'
        });
        console.error(`请求错误: ${url} ${error.message}`);
      }
      return error;
    });
}
