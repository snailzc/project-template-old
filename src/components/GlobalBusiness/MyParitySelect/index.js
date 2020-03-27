import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

const { Option } = Select;
/**
 * 饲料调度系统：公共胎次Select框
 */
@connect()
export default class FsParitySelect extends PureComponent {
  state = {
    options: ['一胎', '二胎', '经产'],
  };

  render() {
    const { options } = this.state;
    const {
      placeholder = '胎次',
      ...props
    } = this.props;
    return (
      <Select
        allowClear
        placeholder={placeholder}
        showSearch
        style={{ minWidth: 130 }}
        {...props}
      >
        {options.map(item => (
          <Option key={item}>{item}</Option>
        ))}
      </Select>
    );
  }
}
