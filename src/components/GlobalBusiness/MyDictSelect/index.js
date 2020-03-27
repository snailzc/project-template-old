import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import { filterOption } from '../../../../utils/utils';

const { Option } = Select;
/**
 * 饲料调度系统：公共数据字典Select框
 */
@connect()
export default class FsDictSelect extends PureComponent {
  state = {
    options: [],
  };

  componentDidMount() {
    const { dispatch, code } = this.props;
    dispatch({
      type: 'fsCommon/dict',
      payload: {
        code,
      },
      callback: data => this.setState({ options: this.formatData(data) }),
    });
  }

  formatData = (data) => {
    const rtlData = data
      .map((item) => {
        return {
          name: item.title,
          key: item.id,
        };
      });
    return rtlData;
  };

  render() {
    const { options } = this.state;
    const {
      placeholder,
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
