import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import styles from './index.less';

/**
 * 该组件为时间选择框
 * 不需要传值，直接使用即可
 * @export
 * @class Index
 * @extends {PureComponent}
 */
export default class Index extends PureComponent {
  onChange = (field, value) => {
    const newValue = { ...this.props.value, [field]: value };
    this.props.onChange(newValue);
  }

  onStartChange = (date, dateString) => {
    this.onChange('startDate', dateString);
  }

  onEndChange = (date, dateString) => {
    this.onChange('endDate', dateString);
  }

  disabledStartDate = (startDate) => {
    const { value = {} } = this.props;
    if (!startDate || !value.endDate) {
      return false;
    }
    return moment(startDate, 'YYYY-MM-DD').valueOf() > moment(value.endDate, 'YYYY-MM-DD').valueOf();
  }

  disabledEndDate = (endDate) => {
    const { value = {} } = this.props;
    if (!endDate || !value.startDate) {
      return false;
    }
    return moment(endDate, 'YYYY-MM-DD').valueOf() < moment(value.startDate, 'YYYY-MM-DD').valueOf();
  }

  render() {
    const { value = {}, placeholder = ['开始时间', '结束时间'] } = this.props;
    return (
      <div className={classNames(styles.dateRange, this.props.className)}>
        <DatePicker
          disabledDate={this.disabledStartDate}
          value={value.startDate ? moment(value.startDate) : undefined}
          placeholder={placeholder[0]}
          onChange={this.onStartChange}
        />
        <span className={styles.line}>-</span>
        <DatePicker
          disabledDate={this.disabledEndDate}
          value={value.endDate ? moment(value.endDate) : undefined}
          placeholder={placeholder[1]}
          onChange={this.onEndChange}
        />
      </div>
    );
  }
}
