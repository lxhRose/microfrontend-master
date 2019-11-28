import fetch from 'dva/fetch';
import { stringify } from 'qs';
import { Modal } from 'antd';

// const TEST_URL = "/api";
const TEST_URL = "";
let modal = [];
function notifyException(data) {
  if (parseInt(data.meta.code, 10) !== 200) {
    if (parseInt(data.meta.code, 10) === 401) {
      location.href = '#/login';
    } else {
      if (modal.length > 0) {
        modal.map((item) => {
          item.destroy();
        });
        modal = [];
      }
      let m = Modal.error({ title: '错误提示', content: data.meta.message });
      modal.push(m);
    }
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
  let newUrl = TEST_URL + url;
  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE') {
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
  } else if (newOptions.method === 'GET') {
    newOptions.headers = {};
    newUrl = newOptions.params ? `${newUrl}?${stringify(newOptions.params)}` : newUrl;
  }
  if (sessionStorage.getItem('token')) {
    newOptions.headers.token = sessionStorage.getItem('token');
  }
  return fetch(newUrl, newOptions)
    .then((response) => response.json())
    .then(notifyException)
    .then((data) => data)
    .catch((error) => {
      if ('stack' in error && 'message' in error) {
        if (modal.length > 0) {
          modal.map((item) => {
            item.destroy();
          });
          modal = [];
        } else {

        }
        let m = Modal.error({
          title: '服务器异常',
          content: '服务器异常，请刷新页面重试！',
        });
        modal.push(m);
        console.error(`请求错误: ${url} ${error.message}`);
      }
      return error;
    });
}
