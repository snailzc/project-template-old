import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import { filterOption } from '../../../../utils/utils';

const { Option } = Select;
/**
 * 饲料调度系统：公共工段Select框
 */
@connect()
export default class FsSegmentSelect extends PureComponent {
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
      service: 'segmentInfo',
      callback: data => this.setState({ options: this.formatData(data) }),
    });
  }

  formatData = (data) => {
    const { list = [] } = this.props;
    const rtlData = data.rows
      .filter((item) => {
        return list.length > 0 ? list.includes(item.FName) : true;
      })
      .map((item) => {
        return {
          name: item.FName,
          key: item.FItemID,
        };
      });
    return rtlData;
  };

  render() {
    const { options } = this.state;
    const {
      placeholder = '工段',
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
