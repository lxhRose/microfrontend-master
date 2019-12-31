import React from 'react';
import { Modal } from 'antd';
import "./index.less";

interface Props {
  title: string,
  children: any,
  width?: any,
  handleOk: Function,
  handleCancel: Function,
}

export default class BaseModal extends React.PureComponent<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  componentDidMount = () => {
    this.setState({ visible: true });
  }

  handleOk = e => {
    // console.log(e);
    this.setState({
      visible: false,
    });
    this.props.handleOk();
  };

  handleCancel = e => {
    // console.log(e);
    this.setState({
      visible: false,
    });
    this.props.handleCancel();
  };

  render() {
    const {
      title,
      children,
      width
    } = this.props;

    return (
      <Modal
        className="system-modal"
        title={title}
        width={width}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        centered={true}
      >
        {children}
      </Modal>
    )
  }
}
