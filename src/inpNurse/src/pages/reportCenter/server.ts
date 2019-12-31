import request from '../../utils/request';

const BASE_URL = 'sys/v1/reportForm';
// 报表树
export async function getTree(params) {
  return request(`${BASE_URL}/tree`, {
    method: 'GET',
    params,
  });
}

