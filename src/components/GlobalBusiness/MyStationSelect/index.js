import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

const { Option } = Select;
/**
 * 饲料调度系统：站号Select框
 */
@connect()
export default class FsStationSelect extends PureComponent {
  state = {
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  };

  render() {
    const { options } = this.state;
    const {
      placeholder = '',
      onChange,
      ...props
    } = this.props;
    return (
      <Select
        allowClear
        placeholder={placeholder}
        showSearch
        style={{ minWidth: 130 }}
        onChange={onChange}
        {...props}
      >
        {options.map(item => (
          <Option key={item}>{item}</Option>
        ))}
      </Select>
    );
  }
}
