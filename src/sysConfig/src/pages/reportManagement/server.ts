import request from '../../utils/request';

const BASE_URL = 'sys/v1/reportForm';

export async function fetchPatients(params) {
  return request(`${BASE_URL}/list`, {
    method: 'GET',
    params,
  });
}
// 新增报表 / 编辑报表
export async function aboutReport(option) {
  return request(BASE_URL, option);
}
// 报表树
export async function getTree(params) {
  return request(`${BASE_URL}/tree`, {
    method: 'GET',
    params,
  });
}
// 查询未配置人员和已配置人员/ 修改人员配置
export async function aboutUser(option) {
  return request(`${BASE_URL}/user`, option);
}
// 作废还原
export async function setRecovery(params) {
  return request(`${BASE_URL}/recovery`, {
    method: 'PUT',
    params,
  });
}

