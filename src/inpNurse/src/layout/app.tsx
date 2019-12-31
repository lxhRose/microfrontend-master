import React from 'react';
import { withRouter } from 'dva/router';
import { connect } from 'dva';
import { RouteComponentProps } from 'react-router';
import { Loading } from "./../../../common/components/index";
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
    const { loading } = this.props.App;
    return (
      <div className="inpNurse-app" >
        {this.props.children}
        {loading && <Loading />}
      </div>
    );
  }
}

export default withRouter(App);
