import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import { filterOption } from '../../../../utils/utils';

const { Option } = Select;
/**
 * 饲料调度系统：公共期次Select框
 */
@connect()
export default class FsPeriodSelect extends PureComponent {
  state = {
    options: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fsCommon/baseInfo',
      payload: {
        limit: 1000,
      },
      service: 'periodInfo',
      callback: data => this.setState({ options: data }),
    });
  }

  render() {
    const { options } = this.state;
    const {
      placeholder = '期次',
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
          <Option key={item.id}>{item.period}</Option>
        ))}
      </Select>
    );
  }
}
