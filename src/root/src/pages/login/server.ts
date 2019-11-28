import request from '../../utils/request';

// 登录
const fetchLogin = async function (params) {
  return request('/login', {
    method: 'POST',
    params
  });
}

export default {
  fetchLogin
}
