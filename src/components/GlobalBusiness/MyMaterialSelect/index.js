import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import { filterOption } from '../../../../utils/utils';

const { Option } = Select;
/**
 * 饲料调度系统：公共物料编码Select框
 */
@connect()
export default class FsMaterialSelect extends PureComponent {
  state = {
    options: [],
  };

  componentDidMount() {
    this.setState({
      options: this.handleCodeArray(),
    });
  }

  handleCodeArray = () => {
    const arr = [];
    for (let i = 65; i < 91; i += 1) {
      arr.push(String.fromCharCode(i));
    }
    return arr;
  };

  render() {
    const { options } = this.state;
    const {
      placeholder = '物料',
      changeOnSelect,
      ...props
    } = this.props;
    return (
      <Select
        allowClear
        placeholder={placeholder}
        showSearch
        filterOption={filterOption}
        changeOnSelect={changeOnSelect}
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
