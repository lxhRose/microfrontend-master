import { Model } from 'dva';
import server from './app-server';

const initialState = {
  loading: false
};

export default <Model>{
  namespace: "App",
  state: initialState,
  reducers: {
    // loading
    toggleLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
    appendUserInfo(state, { payload }) {
      return {
        ...state,
        userInfo: payload.body,
        role: payload.body.role
      }
    },
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
