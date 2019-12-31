import * as React from "react";
import './loading.less';
import { Icon } from 'antd';

class Loading extends React.PureComponent<any, any> {
  private timer;
  constructor(props) {
    super(props);
    this.state = {
      runStr: '...'
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => this.run(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  run = () => {
    let runArr = this.state.runStr.split('');
    if (runArr.length < 3) {
      this.setState({
        runStr: this.state.runStr + '.'
      });
    } else {
      this.setState({
        runStr: ''
      });
    }
  }

  render() {
    const { runStr } = this.state;

    return (
      <div className="loading-page">
        <div className="loadContent">
          <Icon type="loading" /><br />
          <span className="text">{this.props.text}{runStr}</span>
        </div>
      </div>
    )
  }
}

export default Loading;
