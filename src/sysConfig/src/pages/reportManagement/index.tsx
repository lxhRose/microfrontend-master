import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import {
  Icon,
  Switch,
  Table,
  message
} from "antd";
import { ColumnProps } from 'antd/lib/table';
import AddModal from "./components/addModal/index";
import Staffing from "./components/staffing/index";
import "./index.less";

const { Column } = Table;

interface Props {
  dispatch?: any,
  ReportManagement?: any
}

@connect((state) => ({
  ReportManagement: state.ReportManagement
}))
class ReportManagement extends React.PureComponent<Props, any> {
  private columns: Array<ColumnProps<any>>;
  constructor(props) {
    super(props);
    this.state = {
      showDiscard: false,
      showAddModal: false,
      showStaffing: false,
      AddModalType: 'add',
      editRow: {},
      srfId: null
    }
    this.columns = [
      {
        dataIndex: 'srfCode',
        title: '编码'
      }, {
        dataIndex: 'srfName',
        title: '报表名称'
      }, {
        dataIndex: 'supName',
        title: '上级目录',
      }, {
        dataIndex: 'srfDescription',
        title: '报表描述',
      }, {
        dataIndex: 'srfUrl',
        title: 'url'
      }, {
        dataIndex: 'operator',
        title: '更新人'
      }, {
        dataIndex: 'time',
        title: '更新时间'
      }
    ].map((item) => {
      return {
        ...item,
        render: (text, record, index) => {
          return parseInt(record.srfIsDel, 10) === -1
            ? <s style={{ color: 'red' }}>{text}</s>
            : text
        }
      }
    });

  }

  componentDidMount = () => {
    this.loadList();
  }

  // 显示作废
  onShowDiscard = (showDiscard) => {
    this.setState({ showDiscard }, () => {
      this.loadList();
    });
  }

  loadList = () => {
    this.props.dispatch({
      type: 'ReportManagement/loadList',
      payload: {
        showDel: this.state.showDiscard
      }
    });
  }

  // 显示/隐藏 新增/修改弹框
  onShowAddModal = (bol: boolean) => {
    this.setState({ showAddModal: bol });
  }

  // 显示/隐藏 人员配置
  onShowStaffing = (bol: boolean) => {
    this.setState({ showStaffing: bol });
  }

  onStaffing = (srfId) => {
    this.setState({ srfId });
    this.onShowStaffing(true);
  }

  // 刷新列表
  refresh = () => {
    this.loadList();
    this.onShowAddModal(false);
    this.onShowStaffing(false);
  }

  // 新增报表
  addReport = () => {
    this.setState({
      AddModalType: 'add'
    });
    this.onShowAddModal(true);
  }

  // 修改报表
  editReport = (editRow) => {
    this.setState({
      AddModalType: 'edit',
      editRow
    });
    this.onShowAddModal(true);
  }

  // 作废配置 / 作废还原
  onDelReport = (srfId, isDel) => {
    let type = '', text = '', payload = {};
    if (isDel) {
      type = "ReportManagement/aboutReport";
      text = '已作废!';
      payload = {
        method: 'DELETE',
        params: { srfId }
      };
    } else {
      type = "ReportManagement/setRecovery";
      text = '已还原!';
      payload = { srfId };
    }
    this.props.dispatch({
      type,
      payload
    }).then((res) => {
      if (res.code === "SUCCESS") {
        message.success(text);
        this.loadList();
      }
    });
  }

  render() {
    const {
      showDiscard,
      showAddModal,
      AddModalType,
      editRow,
      showStaffing,
      srfId
    } = this.state;
    const { data } = this.props.ReportManagement;

    return (
      <div className="ReportManagement-page">
        <div className="header-box">
          <Icon type="plus"
            className="action-icon"
            onClick={this.addReport} />
          <span className="header-switch-box">
            <Switch checked={showDiscard} onChange={this.onShowDiscard} />
            <span>显示已作废</span>
          </span>
        </div>
        <div className="content-table-box">
          <Table
            dataSource={data}
            rowKey="srfCode"
            className="content-table"
            pagination={false}
            scroll={{ y: `calc(100vh - 124px)` }}>
            {this.columns.map((column, i) => <Column {...column} key={i} align={"center"} />)}
            <Column
              title="操作"
              dataIndex="action"
              width="150px"
              align={"center"}
              render={(text, record: any) => {
                return parseInt(record.srfIsDel, 10) === -1 ?
                  <Icon type="rollback"
                    onClick={() => this.onDelReport(record.srfId, false)}
                    className="action-icon" />
                  : <span className="action-box">
                    <Icon type="team"
                      onClick={() => this.onStaffing(record.srfId)} className="action-icon" />
                    <Icon type="edit"
                      onClick={() => this.editReport(record)} className="action-icon" />
                    <Icon type="delete"
                      onClick={() => this.onDelReport(record.srfId, true)}
                      className="action-icon" />
                  </span>
              }} />
          </Table>
        </div>
        {showAddModal && <AddModal
          AddModalType={AddModalType}
          editRow={editRow}
          handleCancel={() => this.onShowAddModal(false)}
          handleOk={this.refresh} />}
        {showStaffing && <Staffing
          srfId={srfId}
          handleOk={this.refresh}
          handleCancel={() => this.onShowStaffing(false)} />}
      </div>
    )
  }
}

export default withRouter(ReportManagement);
