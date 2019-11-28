import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import {
  Form, Input, Button, Icon, Checkbox
} from 'antd';
import './login.less';

interface Props {
  dispatch?: any,
  Login?: any,
  form?: any,
}

@connect(state => ({
  Login: state.Login
}))
class Login extends React.PureComponent<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    }
  }

  componentDidMount = () => {
    let automaticLogon = localStorage.getItem("automaticLogon");
    if (automaticLogon == 'true') {
      this.setState({ checked: true });
      setTimeout(() => {
        this.submit();
      }, 2000);
    }
  }

  submit = (e?) => {
    e && e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { username, password } = values;
        this.props.dispatch({
          type: 'Login/login',
          payload: {
            username,
            password,
          }
        }).then((response) => {
          if (response.meta.code == 200) {
            sessionStorage.setItem('token', response.body.token);
            window.goThePage('#/hospitalManage');
          }
        });
      }
    });
  }

  onChange = (e) => {
    this.setState({
      checked: e.target.checked
    });
    localStorage.setItem('automaticLogon', e.target.checked ? 'true' : 'false');
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="login-page page">
        <div className="content">
          <div className="titleWrap">
            <p>
              <Icon type="appstore" theme="twoTone" className="icon" />
              <span className="title">后台管理系统</span>
            </p>
            <p>护士站大屏，床头交互屏，门头卡等</p>
          </div>
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.submit}
          >
            <div className="inputBox">
              <Form.Item>
                {getFieldDecorator(`username`, {
                  rules: [{ required: true, message: '账号不能为空！' }],
                })(
                  <Input
                    placeholder="请输入账号"
                    autofocus="autofocus"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator(`password`, {
                  rules: [{ required: true, message: '请输入密码！' }],
                })(
                  <Input
                    placeholder="请输入密码"
                    type="password"
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
                )}
              </Form.Item>
              <Checkbox
                onChange={this.onChange}
                checked={this.state.checked}>自动登录</Checkbox>
            </div>
            <div className="buttonBox">
              <Button type="primary" onClick={this.submit} htmlType="submit">登录</Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

export default withRouter(Form.create()(Login));
