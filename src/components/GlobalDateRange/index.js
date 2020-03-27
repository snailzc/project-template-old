import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

export default class GlobalDateRange extends Component {
  // 获取该组件的值
  onChange = (field, value) => {
    const newValue = { ...this.props.value, [field]: value };
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  }

  onStartChange = (date, dateString) => {
    this.onChange('startTime', dateString);
  }

  onEndChange = (date, dateString) => {
    this.onChange('endTime', dateString);
  }

  disabledStartDate = (current) => {
    // const { value = {} } = this.props;
    // if (value.endTime) {
    //   return current && current.valueOf() > moment(value.endTime, 'YYYY-MM-DD').valueOf();
    // }
  }

  disabledEndDate = (current) => {
    const { value = {} } = this.props;
    if (value.startTime) {
      return current && current.valueOf() < moment(value.startTime, 'YYYY-MM-DD').valueOf();
    }
  }

  render() {
    const {
      placeholder = ['开始时间', '结束时间'],
      value = {},
    } = this.props;
    return (
      <div className={classNames(styles.dateRange, this.props.className)}>
        <DatePicker
          disabledDate={this.disabledStartDate}
          value={value.startTime ? moment(value.startTime) : undefined}
          placeholder={placeholder[0]}
          onChange={this.onStartChange}
          size="small"
        />
        <span className={styles.line}>～</span>
        <DatePicker
          disabledDate={this.disabledEndDate}
          value={value.endTime ? moment(value.endTime) : undefined}
          placeholder={placeholder[1]}
          onChange={this.onEndChange}
          size="small"
        />
      </div>
    );
  }
}
