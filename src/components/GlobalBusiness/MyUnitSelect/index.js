import React, { PureComponent } from 'react';
import { Select, message } from 'antd';
import { connect } from 'dva';
import { filterOption } from '../../../../utils/utils';

const { Option } = Select;
/**
 * 饲料调度系统：单元Select框
 */
@connect()
export default class FsUnitSelect extends PureComponent {
  state = {
    options: [],
  };

  componentWillMount() {
    const { conditions } = this.props;
    if (conditions && conditions[0]) {
      this.loadData(conditions);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { conditions } = nextProps;
    if (conditions && conditions[0] && conditions !== this.props.conditions) {
      this.loadData(conditions);
    }
  }

  loadData = (value) => {
    if (value[0]) {
      this.props.dispatch({
        type: 'fsCommon/baseInfo',
        payload: {
          fieldId: value[0],
          segmentId: value[1],
        },
        service: 'unitInfo',
        callback: data => this.setState({ options: this.formatData(data) }),
      });
    } else {
      message.error('请先选择场区');
    }
  };

  formatData = (data) => {
    const rtlData = data.map((item) => {
      return {
        name: item.unitnum,
        key: item.id,
      };
    });
    return rtlData;
  };

  render() {
    const { options } = this.state;
    const {
      placeholder = '单元',
      onChange,
      ...props
    } = this.props;
    return (
      <Select
        allowClear
        placeholder={placeholder}
        showSearch
        style={{ minWidth: 130 }}
        filterOption={filterOption}
        onChange={onChange}
        {...props}
      >
        {options.map(item => (
          <Option key={item.key}>{item.name}</Option>
        ))}
      </Select>
    );
  }
}
