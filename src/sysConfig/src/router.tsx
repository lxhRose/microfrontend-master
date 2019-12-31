import * as React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Router, Route, Switch, Redirect } from 'dva/router';

import {
  App,
  ReportManagement
} from './layout/index';

const BASE_URL = '/sysConfig';
const ROUT_ARR = [
  { path: '/reportManagement', component: ReportManagement }
];

// 路由配置
function RouterConfig({ history, app }) {
  return (
    <ConfigProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path={BASE_URL} render={(props) => (
            <App>
              <Switch>
                {ROUT_ARR.map((item, i) => (
                  <Route path={`${BASE_URL}${item.path}`} key={i} exact component={item.component} />
                ))}
                <Route path={BASE_URL} exact render={() => <Redirect to={`${BASE_URL}/reportManagement`} />} />
              </Switch>
            </App>
          )} />
        </Switch>
      </Router>
    </ConfigProvider>
  );
}

export default RouterConfig;
