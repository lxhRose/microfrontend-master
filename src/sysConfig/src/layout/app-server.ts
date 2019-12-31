import request from '../utils/request';

// 获取登录用户信息
const fetchLoginUserInfo = async function () {
  return request('/loginUserInfo', {
    method: 'GET',
  });
}

export default {
  fetchLoginUserInfo
}
