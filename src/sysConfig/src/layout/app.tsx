import React from 'react';
import { withRouter } from 'dva/router';
import { connect } from 'dva';
import { RouteComponentProps } from 'react-router';
import './app.less';

interface Props {
  dispatch?: any,
  App?: any
}

@connect((state) => ({
  App: state.App
}))
class App extends React.PureComponent<Props & RouteComponentProps<any, any>, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="sysConfig-app" >
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(App);
