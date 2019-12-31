import React from 'react';
import { Form, Input, Select, message } from 'antd';
import { BaseModal } from "./../../../../../../common/components/index";
import { connect } from 'dva';
import "./index.less";

interface Props {
  dispatch?: any,
  ReportManagement?: any,
  form: any,
  AddModalType: any,
  editRow?: any,
  handleOk: Function,
  handleCancel: Function,
}

const { TextArea } = Input;
const { Option } = Select;
const EDIT = 'edit';

@connect((state) => ({
  ReportManagement: state.ReportManagement
}))
class AddModal extends React.PureComponent<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
      selectOption: []
    }
  }

  componentDidMount = () => {
    const { editRow, AddModalType, form } = this.props;
    const {
      srfCode,
      srfName,
      srfSupId,
      srfDescription,
      srfUrl
    } = editRow;
    if (AddModalType === EDIT) {
      form.setFieldsValue({ // 修改状态设置初始值
        srfCode,
        srfName,
        srfSupId,
        srfDescription,
        srfUrl
      });
    }
    this.getTree();
  }

  getTree = () => {
    this.props.dispatch({
      type: 'ReportManagement/getTree',
      payload: {
        isAccess: true
      }
    }).then((res) => {
      if (res.code === "SUCCESS") {
        let data = res.data ? res.data : [];
        let selectOption = [];
        this.creatOption(data, selectOption);
      }
    });
  }

  // 构造上级目录List
  creatOption = (arr, selectOption) => {
    arr.map((item) => {
      if (selectOption.indexOf(item.srfSupId) === -1) { // 去重
        selectOption.push(item.srfSupId);
      }
      if ((item.blDir || item.blDir === 'true') && item.children.length > 0) {
        this.creatOption(item.children, selectOption);
      }
    });
    this.setState({ selectOption }, () => {
      if (this.props.AddModalType !== EDIT) {
        this.props.form.setFieldsValue({
          srfSupId: this.state.selectOption[0]
        });
      }
    });
  }

  handleCancel = () => {
    this.props.handleCancel();
  };

  // 提交
  handleSubmit = (e?) => {
    if (e) e.preventDefault();
    const { editRow, AddModalType, form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { srfSupId } = values;
        let text = '新增成功！',
          payload = {
            method: 'POST',
            params: {
              ...values,
              srfSupId: srfSupId ? srfSupId : 0
            }
          };
        if (AddModalType === EDIT) {
          text = '修改成功!';
          payload = {
            method: 'PUT',
            params: {
              ...payload.params,
              srfId: editRow.srfId
            }
          }
        }
        dispatch({
          type: 'ReportManagement/aboutReport',
          payload
        }).then((res) => {
          if (res.code === "SUCCESS") {
            message.success(text);
          }
          this.props.handleOk();
        }).catch(() => {
          this.props.handleOk();
        });
      }
    });
  };

  render() {
    const { AddModalType } = this.props;
    const { selectOption } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
    };

    return (
      <BaseModal
        width={600}
        title={AddModalType === EDIT ? '修改报表' : '新增报表'}
        handleCancel={this.handleCancel}
        handleOk={this.handleSubmit}
      >
        <Form
          className="AddModal-form"
          onSubmit={this.handleSubmit}
          {...formItemLayout}>
          <Form.Item label="报表编码">
            {getFieldDecorator('srfCode', {
              rules: [{ required: true, message: '报表编码不能为空!' }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="报表名称">
            {getFieldDecorator('srfName', {
              rules: [{ required: true, message: '报表名称不能为空!' }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="上级目录">
            {getFieldDecorator('srfSupId')(
              <Select
                style={{ width: '100%' }}>
                {selectOption.map((srfSupId, i) => (
                  <Option key={i} value={srfSupId}>{srfSupId}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="文档描述">
            {getFieldDecorator('srfDescription')(
              <TextArea rows={2} />
            )}
          </Form.Item>
          <Form.Item label="URL">
            {getFieldDecorator('srfUrl', {
              rules: [{ required: true, message: 'URL不能为空!' }],
            })(
              <TextArea rows={2} />
            )}
          </Form.Item>
        </Form>
      </BaseModal>
    )
  }
}

export default Form.create<Props>({ name: 'AddModal' })(AddModal);
