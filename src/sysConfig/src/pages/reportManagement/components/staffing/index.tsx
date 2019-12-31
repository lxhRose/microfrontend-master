import React from 'react';
import { Transfer, Table, message } from 'antd';
import difference from 'lodash/difference';
import { BaseModal } from "../../../../../../common/components/index";
import { connect } from 'dva';
import "./index.less";

interface Props {
  dispatch?: any,
  ReportManagement?: any,
  srfId?: any,
  handleOk?: Function,
  handleCancel?: Function,
}

const Columns = [
  {
    dataIndex: 'uiCode',
    title: '工号',
  },
  {
    dataIndex: 'uiName',
    title: '用户名',
  },
];

@connect((state) => ({
  ReportManagement: state.ReportManagement
}))
class Staffing extends React.PureComponent<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
      targetKeys: [],
      data: []
    }
  }

  componentDidMount = () => {
    this.getUser();
  }

  // 查询未配置人员和已配置人员
  getUser = () => {
    this.props.dispatch({
      type: 'ReportManagement/aboutUser',
      payload: {
        method: 'GET',
        params: {
          srfId: this.props.srfId
        }
      }
    }).then((res) => {
      if (res.code === "SUCCESS") {
        let data = res.data ? res.data : { selectList: [], unSelectList: [] };
        this.setState({
          data: (data.selectList.concat(data.unSelectList))
            .map((item, i) => {
              return {
                ...item,
                key: item.uiCode
              }
            }),
          targetKeys: data.selectList.map((item) => item.uiCode)
        });
      }
    });
  }

  onChange = nextTargetKeys => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  handleCancel = () => {
    this.props.handleCancel();
  };

  // 提交
  handleSubmit = () => {
    this.props.dispatch({
      type: 'ReportManagement/aboutUser',
      payload: {
        method: 'PUT',
        params: {
          id: this.props.srfId,
          codeList: this.state.targetKeys
        }
      }
    }).then((res) => {
      if (res.code === "SUCCESS") {
        message.success('修改人员配置成功!');
      }
      this.props.handleOk();
    }).catch(() => {
      this.props.handleOk();
    });
  };

  render() {
    const { targetKeys, data } = this.state;

    return (
      <BaseModal
        width={800}
        title="人员配置"
        handleCancel={this.handleCancel}
        handleOk={this.handleSubmit}
      >
        <Transfer
          titles={['未分配人员', '已分配人员']}
          showSelectAll={false}
          dataSource={data}
          targetKeys={targetKeys}
          showSearch={true}
          onChange={this.onChange}
          filterOption={(inputValue, item) =>
            item.uiCode.indexOf(inputValue) !== -1
            || item.uiName.indexOf(inputValue) !== -1
          }>
          {({
            filteredItems,
            onItemSelectAll,
            onItemSelect,
            selectedKeys: listSelectedKeys,
          }) => {
            const rowSelection = {
              onSelectAll(selected, selectedRows) {
                const treeSelectedKeys = selectedRows
                  .map(({ key }) => key);
                const diffKeys = selected
                  ? difference(treeSelectedKeys, listSelectedKeys)
                  : difference(listSelectedKeys, treeSelectedKeys);
                onItemSelectAll(diffKeys, selected);
              },
              onSelect({ key }, selected) {
                onItemSelect(key, selected);
              },
              selectedRowKeys: listSelectedKeys,
            };

            return (
              <Table
                rowSelection={rowSelection}
                columns={Columns}
                dataSource={filteredItems}
                size="small"
                onRow={({ key }) => ({
                  onClick: () => {
                    onItemSelect(key, !listSelectedKeys.includes(key));
                  },
                })}
              />
            );
          }}
        </Transfer>
      </BaseModal>
    )
  }
}

export default Staffing;
