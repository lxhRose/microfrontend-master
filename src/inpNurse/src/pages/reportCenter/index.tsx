import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { Tree, Input } from "antd";
import "./index.less";
import assess from "./../../../../common/images/icon/assess.png";
import fileclose from "./../../../../common/images/icon/fileclose.png";
import fileopen from "./../../../../common/images/icon/fileopen.png";

const { TreeNode, DirectoryTree } = Tree;
const { Search } = Input;

interface Props {
  dispatch?: any,
  ReportCenter?: any
}

@connect((state) => ({
  ReportCenter: state.ReportCenter
}))
class ReportCenter extends React.PureComponent<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      dataList: [],
      data: [],
      timeOut: false,
    }
  }
  componentDidMount = () => {
    this.loadList();
  }

  loadList = () => {
    this.props.dispatch({
      type: 'ReportCenter/getTree',
      payload: {
        isAccess: true
      }
    }).then((res) => {
      if (res.code === 'SUCCESS') {
        let data = res.data || [],
          dataList = [];
        this.setState({ data });
        this.generateList(data, dataList);
        this.setState({ dataList });
        // if (dataList.length > 0) {
        // this.changeIframeSrc(dataList[0].srfUrl);
        // }
      }
    });
  }

  // 构造一个轻量查询数组
  generateList = (data, dataList) => {
    data.map((item) => {
      const { srfName, srfId, srfUrl } = item;
      dataList.push({ srfId, srfName, srfUrl });
      if (item.children && item.children.length > 0) {
        this.generateList(item.children, dataList);
      }
    });
  }

  // 获取父级key
  getParentKey = (srfId, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.srfId === srfId)) {
          parentKey = node.srfId;
        } else if (this.getParentKey(srfId, node.children)) {
          parentKey = this.getParentKey(srfId, node.children);
        }
      }
    }
    return parentKey;
  };

  // 搜索
  onSearch = e => {
    const { value } = e.target;
    const { dataList, data } = this.state;
    const expandedKeys = dataList
      .map(item => {
        if (item.srfName.indexOf(value) > -1) {
          return this.getParentKey(item.srfId, data);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }

  // 展开/收起节点时触发
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onSelect = (selectedKeys, e) => {
    let selecObj = this.state.dataList
      .find((item) => `${item.srfId}` === selectedKeys[0]);
    this.props.dispatch({ // 开始loading
      type: 'App/toggleLoading',
      payload: true
    });
    this.changeIframeSrc(selecObj ? selecObj.srfUrl : null)
    // console.log(selectedKeys, selecObj)
  }

  changeIframeSrc = (url) => { // 改变iframe src属性
    // console.log(url)
    this.setState({ timeOut: false }, () => { // 恢复正常页面
      let time = setTimeout(() => { // 监听超时
        this.onLoad(time);
        this.setState({ timeOut: true }); // 显示超时页面
      }, 2000);
      let iframe: any = document.getElementById('ReportCenter-content-iframe');
      iframe.src = url;
      if (iframe.attachEvent) { // 兼容IE
        iframe.attachEvent("onload", () => {
          this.onLoad(time); // 加载完成
        });
      } else {
        iframe.onload = () => {
          this.onLoad(time); // 加载完成
        };
      }
    });
  }

  onLoad = (time) => {
    clearTimeout(time);
    this.props.dispatch({
      type: 'App/toggleLoading',
      payload: false
    });
  }

  // 构造tree
  loop = (data, searchValue) =>
    data.map(item => {
      const index = item.srfName.indexOf(searchValue);
      const beforeStr = item.srfName.substr(0, index);
      const afterStr = item.srfName.substr(index + searchValue.length);
      const srfName =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
            <span>{item.srfName}</span>
          );
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode key={item.srfId} title={srfName}
            icon={({ expanded }) => {
              console.log(expanded)
              return <img className="tree-icon"
                src={expanded ? fileopen : fileclose} />
            }}>
            {this.loop(item.children, searchValue)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.srfId} title={srfName}
        icon={({ expanded }) =>
          <img className="tree-icon"
            src={assess} />} />;
    });

  render() {
    const {
      searchValue,
      expandedKeys,
      autoExpandParent,
      data,
      timeOut
    } = this.state;

    return (
      <div className="ReportCenter-page">
        <div className="menu">
          <Search className="Search-box"
            placeholder="Search"
            onChange={this.onSearch} />
          <DirectoryTree
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onSelect={this.onSelect}
          >
            {this.loop(data, searchValue)}
          </DirectoryTree>
        </div>
        <div className="content">
          {timeOut
            ? <div className="time-out">
              请求超时（可能文档访问路径是错误的），请稍后重试！
            </div>
            : <iframe
              name="ReportCenter-content-iframe"
              id="ReportCenter-content-iframe"
              width="100%"
              height="100%"
              frameBorder={0}
              scrolling="yes">
            </iframe>}
        </div>
      </div>
    )
  }
}

export default withRouter(ReportCenter);
