import React from 'react';
import { withRouter, Link } from 'dva/router';
import { connect } from 'dva';
import { RouteComponentProps } from 'react-router';
import { Layout, Menu, Icon } from 'antd';
import './app.less';

interface Props {
  dispatch?: any,
  App?: any
}

const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;
const MenuArr = [
  {
    label: '护士站交互屏', path: '/main', icon: "desktop",
    children: [
      { label: '功能配置', path: '/nurseScreen/fun' },
      { label: '内容配置', path: '/nurseScreen/connect' },
      { label: '账户配置', path: '/nurseScreen/account' },
    ]
  },
  { label: '床头交互屏', path: '/1', icon: "tablet" },
];

@connect((state) => ({
  App: state.App
}))
class App extends React.PureComponent<Props & RouteComponentProps<any, any>, any> {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      selectedKey: '/hospitalManage',
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  componentDidMount() {
    this.changeSelectedKey();
  }

  componentDidUpdate() {
    this.changeSelectedKey();
  }

  changeSelectedKey = () => {
    let nowPath = this.props.location.pathname;
    if (nowPath.startsWith('/nurseScreen/fun')) {
      nowPath = '/nurseScreen/fun'
    }
    if (nowPath.startsWith('/nurseScreen/account')) {
      nowPath = '/nurseScreen/account'
    }
    this.setState({ selectedKey: nowPath });
    // MenuArr.map((item, i) => {
    //     if (nowPath.indexOf(item.path) > -1) {
    //         this.setState({ selectedKey: i.toString() });
    //         this.setState({ selectedKey: item.path });
    //     }
    // });
  }

  render() {
    const { collapsed, selectedKey } = this.state;

    return (
      <div className="App-page" >
        <Layout className="app-layout">
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
          >
            <div className="logo" >{!collapsed && "后台管理系统"}</div>
            <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} defaultOpenKeys={['/main']}>
              {MenuArr.map((item, i) => {
                if (item.children) {
                  return (
                    <SubMenu
                      key={item.path}
                      title={
                        <span>
                          <Icon type={item.icon} />
                          <span>{item.label}</span>
                        </span>
                      }>
                      {
                        item.children.map((item, index) => (
                          <Menu.Item key={item.path}>
                            <Link to={item.path}>
                              <span>{item.label}</span>
                            </Link>
                          </Menu.Item>
                        ))
                      }
                    </SubMenu>
                  )
                } else {
                  return (
                    <Menu.Item key={item.path}>
                      <Link to={item.path}>
                        <Icon type={item.icon} />
                        <span>{item.label}</span>
                      </Link>
                    </Menu.Item>
                  )
                }
              })}
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              <div className="grade">
                <span>超级管理员</span>
              </div>
            </Header>
            <Content className="App-content">
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default withRouter(App);
