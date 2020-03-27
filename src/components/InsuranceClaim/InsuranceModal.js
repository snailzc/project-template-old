import React, { PureComponent } from 'react';
import { Modal, Form, Select, DatePicker, Input, Button } from 'antd';
import moment from 'moment';
import ScPageForm from '../Biz/Global/ScPageForm';
import GlobalUpload from '../Global/GlobalUpload';


const FormItem = Form.Item;
const { Option } = Select;


export default class InsuranceModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      attachements: [],
    };
    this.myRef = React.createRef();
  }
  componentDidMount() {
  }

  handleUpload = (val) => {
    this.setState({
      attachements: val,
    });
  };

  handleSubmit = (vals) => {
    const { attachements } = this.state;
    const newValues = {
      ...vals,
      attachements,
      billStartTime: `${moment(vals.billStartTime).format('YYYY-MM-DD')} 00:00:00`,
      billEndTime: `${moment(vals.billEndTime).format('YYYY-MM-DD')} 23:59:59`,
    };
    this.props.handleSubmit(newValues);
  }

  handleCancel = () => {
    this.props.handleCancel();
  }

  render() {
    const { visible, record } = this.props;
    const { attachements } = this.state;
    const formItem = [
      {
        key: 'id',
        label: 'id',
        initialValue: record && record.id,
        span: 0,
        component: <Input />,
      },
      {
        key: 'billNo',
        label: '保单编号',
        initialValue: record && record.billNo,
        span: 6,
        component: <Input />,
      },
      {
        key: 'billStartTime',
        label: '保单开始时间',
        span: 6,
        initialValue: record && record.billStartTime && moment(record.billStartTime),
        component: (<DatePicker
          format="YYYY-MM-DD"
        />),
        rules: [
          {
            required: true,
          },
        ],
      },
      {
        key: 'billEndTime',
        label: '保单结束时间',
        span: 6,
        initialValue: record && record.billEndTime && moment(record.billEndTime),
        component: (<DatePicker
          format="YYYY-MM-DD"
        />),
        rules: [
          {
            required: true,
          },
        ],
      },
      {
        key: 'attachments',
        label: '附件',
        span: 12,
        component: (
          <GlobalUpload
            handleUpload={this.handleUpload}
            attachements={attachements}
          />
        ),
      },
    ];
    return (
      <Modal
        visible={visible}
        destroyOnClose
        width="60%"
        maskClosable={false}
        footer={null}
        onCancel={this.handleCancel}
      >
        <ScPageForm
          key="addForm"
          formItem={formItem}
          handleSubmit={this.handleSubmit}
          goBack={this.props.goBack}
          wrappedComponentRef={form => this.form = form}
          pageElement={this.props.pageElement}
          loading={this.props.loading}
        />,
      </Modal>
    );
  }
}
