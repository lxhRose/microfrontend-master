import { Model } from 'dva';
import server from './app-server';

const initialState = {
  collapsed: false,
  userInfo: {
    userCode: "",
    userName: "",
    roleDesc: "",
    role: -1
  },
  role: -1 // 0：超级管理员，1：医生，2：财务
};

export default <Model>{
  namespace: "App",
  state: initialState,
  reducers: {
    // 菜单伸缩
    changeCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    appendUserInfo(state, { payload }) {
      return {
        ...state,
        userInfo: payload.body,
        role: payload.body.role
      }
    },
    changeRole(state, { payload }) {
      return {
        ...state,
        role: payload.role
      }
    }
  },
  effects: {
    // 获取登录用户信息
    *loginUserInfo({ payload }, { call, put, select }) {
      const response = yield call(server.fetchLoginUserInfo);
      if (parseInt(response.meta.code, 10) === 200) {
        yield put({
          type: 'appendUserInfo',
          payload: response
        })
      }
    },
  }
}
