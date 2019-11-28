import { Model } from 'dva';
import server from './server';

const initialState = {
};

export default <Model>{
  namespace: "Login",
  state: initialState,
  reducers: {
    // 菜单伸缩
    changeCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
  },
  effects: {
    // 登录
    *login({ payload }, { call, put, select }) {
      const response = yield call(server.fetchLogin, payload);
      return response;
    },
  }
}
