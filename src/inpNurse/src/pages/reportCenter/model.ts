import { Model } from 'dva';
import {
  getTree,
} from './server';

const initialState = {
  data: [], // 列表
};

export default <Model>{
  namespace: 'ReportCenter',
  state: initialState,
  reducers: {
    appendList(state, { payload }) {
      return {
        ...state,
        data: payload.data,
      };
    },
  },
  effects: {
    *getTree({ payload }, { call, put, select }) {
      const response = yield call(getTree, payload);
      if (response.code === 'SUCCESS') {
        put({
          type: 'appendList',
          payload: response
        });
      }
      return response;
    },
  }
}
