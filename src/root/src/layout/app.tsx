import React from 'react';
import { withRouter, Link } from 'dva/router';
import { connect } from 'dva';
import { RouteComponentProps } from 'react-router';
import './app.less';
import { Button } from 'antd';

interface Props {
  dispatch?: any,
  App?: any
}

@connect((state) => ({
  App: state.App
}))
class App extends React.PureComponent<Props & RouteComponentProps<any, any>, any> {
  render() {

    return (
      <div className="root-page" >
        <Button type="primary">
          <Link to="/inpNurse">inpNurse</Link>
        </Button>
        <Button type="primary">
          <Link to="/angular">angular</Link>
        </Button>
        <div id="inpNurse"></div>
        <div id="angular"></div>
      </div>
    );
  }
}

function withRenderApp(WrappedComponent) {
  return class WithRenderApp extends React.PureComponent<any, any> {
    render() {
      //  if (sessionStorage.getItem('token')) {
      return <WrappedComponent {...this.props} />
      //  } else {
      //    message.error('您还未登录，请先登录！');
      //    return window.location.href = '#/login';
      //  }
    }
  }
}

export default withRenderApp(withRouter(App));
