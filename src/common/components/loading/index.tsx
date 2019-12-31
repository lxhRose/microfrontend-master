import React from 'react';
import { Spin } from 'antd';
import "./index.less";

export default class Loading extends React.PureComponent<any, any> {
  render() {
    return (
      <div className="loading-component">
        <Spin size="large" />
      </div>
    )
  }
}
