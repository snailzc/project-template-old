import React, { Component } from 'react';
import { Cascader } from 'antd';
import { connect } from 'dva';

@connect()
export default class FsArea extends Component {
  state = {
    options: [], // 构建好的select option
    rawList: [], // 后台获取的原生数据集合
  };

  componentDidMount() {
    const { dispatch, level = 3 } = this.props;
    dispatch({
      type: 'fsCommon/baseInfo',
      payload: {
        limit: 1000,
      },
      service: 'fieldInfo',
      callback: data => this.setState({ rawList: data.rows }, () => this.formatData(level)),
    });
  }

  onChange = (v, option) => {
    const values = {
      provinceId: v[0],
      provinceName: option[0] && option[0].label,
      areaId: v[1],
      areaName: option[1] && option[1].label,
      fieldId: v[2],
      fieldName: option[2] && option[2].label,
    };
    this.props.onChange(v, values, option); // 传给form表单的onChange事件
  };

  formatData = (level) => {
    const {
      fieldType = [], // 场区类型名称
    } = this.props;
    const { rawList } = this.state;
    const list = [];
    let pro;
    let area;
    rawList.filter((item) => { // 过滤场区类型
      return fieldType.length === 0 ? true : fieldType.includes(item.FFieldTypeName);
    }).forEach((item) => {
      pro = list.find(proItem => proItem.value === item.FProID);
      if (!pro) {
        pro = {
          value: item.FProID,
          label: item.FProName,
          // children: [],
        };
        if (level > 1) {
          pro.children = [];
        }
        list.push(pro);
      }
      if (level > 1) {
        area = pro.children.find(areaItem => areaItem.value === item.FAreaID);
        if (!area) {
          area = {
            value: item.FAreaID,
            label: item.FAreaName,
            // children: [],
          };
          if (level > 2) {
            area.children = [];
          }
          pro.children.push(area);
        }
      }
      if (level > 2) {
        // 添加场区
        area.children.push({
          value: item.FFieldID,
          label: item.FFieldName,
        });
      }
    });
    this.setState({
      options: list,
    });
  };

  handleDefaultVal = (fieldId) => {
    if (Array.isArray(fieldId)) {
      return fieldId;
    }
    const { rawList } = this.state;
    const item = rawList.find(it => fieldId === it.FFieldID);
    const defaultVal = item && [item.FProID, item.FAreaID, fieldId];
    return defaultVal;
  };

  render() {
    const {
      value,
      placeholder = '省份/区域/场次',
      changeOnSelect,
      style = {
        minWidth: 260,
      },
      disabled = false,
    } = this.props;
    const { options } = this.state;
    return (
      <Cascader
        disabled={disabled}
        expandTrigger="hover"
        value={value && this.handleDefaultVal(value)}
        options={options}
        style={style}
        placeholder={placeholder}
        onChange={this.onChange}
        changeOnSelect={changeOnSelect}
      />
    );
  }
}
