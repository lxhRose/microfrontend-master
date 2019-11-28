import * as React from 'react';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Router, Route, Switch, Redirect } from 'dva/router';

import {
  App,
} from './layout/index';

const ROUT_ARR = [
];

// 路由配置
function RouterConfig({ history, app }) {
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/" render={(props) => (
            <App>
              <Switch>
                {ROUT_ARR.map((item, i) => (
                  <Route path={item.path} key={i} exact component={item.component} />
                ))}
                <Route path="/" exact render={() => <Redirect to="/hospitalManage" />} />
              </Switch>
            </App>
          )} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
