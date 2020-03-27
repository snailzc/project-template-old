import React, { PureComponent } from 'react';
import { Radio } from 'antd';

const RadioGroup = Radio.Group;
/**
 * 全局状态单选Radio组件
 * label: 文本
 * value: 值
 */
export default class GlobalRadio extends PureComponent {
  render() {
    const {
      allowAll,
      options,
      defaultValue,
      ...props
    } = this.props;
    const newOptions = allowAll ? [{ label: '全部', value: '' }, ...options] : [...options];
    return (
      <RadioGroup
        defaultValue={defaultValue || (newOptions.length > 0 && newOptions[0].value)}
        {...props}
      >
        {newOptions.map(item => (
          <Radio key={item.value} value={item.value} label={item.label}>{item.label}</Radio>
        ))}
      </RadioGroup>
    );
  }
}

GlobalRadio.defaultProps = {
  options: [],
};
