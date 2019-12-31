import { Model } from 'dva';
import {
  fetchPatients,
  aboutReport,
  getTree,
  aboutUser,
  setRecovery
} from './server';

const initialState = {
  data: [], // 列表
};

export default <Model>{
  namespace: 'ReportManagement',
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
    // 列表
    *loadList({ payload }, { call, put, select }) {
      const applyState = yield select(state => state.ReportManagement);
      const { pageIndex, pageSize } = applyState;
      const params = {
        pageIndex,
        pageSize,
        ...payload,
      };
      const response = yield call(fetchPatients, payload);
      yield put({
        type: 'appendList',
        payload: response,
      });
    },
    *aboutReport({ payload }, { call, put, select }) {
      const response = yield call(aboutReport, payload);
      return response;
    },
    *getTree({ payload }, { call, put, select }) {
      const response = yield call(getTree, payload);
      return response;
    },
    *aboutUser({ payload }, { call, put, select }) {
      const response = yield call(aboutUser, payload);
      return response;
    },
    *setRecovery({ payload }, { call, put, select }) {
      const response = yield call(setRecovery, payload);
      return response;
    },
  }
}
