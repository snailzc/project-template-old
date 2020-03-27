import React, { Component } from 'react';
import { Form, Cascader, Select, Row, Col } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
/**
 * 公用区域、场区组件
 * params => size => 当前控件大小
 *
 */

@connect(({ common }) => ({
  common,
}))
@Form.create()
export default class GlobalAreaInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchData: {
        areaId: '',
        fieldId: '',
      },
      selectedArea: [], // 选中的区域
      areaList: [],
      fieldList: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/fetch',
      payload: {
        data: {
          limit: 20000,
        },
        type: 'area',
      },
    });
  }

  /**
   * count用于判断当前是否清空联级选择框，需要在引用父组件中清空操作时，将count设置为this.state.count+1
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.count !== this.props.count) {
      this.props.form.resetFields();
      if (this.props.form.getFieldValue('areaId')) {
        this.setState({
          areaList: [],
          fieldList: [],
        });
      }
    } else {
      this.setState({
        areaList: nextProps.common.areaList,
        fieldList: nextProps.common.fieldList,
      });
    }
  }

  getFieldInfo = (val) => {
    const { dispatch } = this.props;
    this.setState({
      selectedArea: val,
    });
    dispatch({
      type: 'common/fetch',
      payload: {
        data: {
          areaId: val[1],
          limit: 200000,
        },
        type: 'field',
      },
    });
    this.props.changeField(val, '');
  };

  areaChange = (value, selectedOptions) => {
    this.props.form.resetFields('fieldId');
    this.getFieldInfo(value);
    if (this.props.changeArea) {
      this.props.changeArea(value, selectedOptions);
    }
  };

  /**
   * 更改场区触发事件
   * @params => 选中场区和区域的值
   */
  changeField = (val) => {
    this.props.changeField(this.state.selectedArea, val);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { searchData, areaList, fieldList } = this.state;
    const {
      size, // 控件大小，默认为default 正常
      width = '100%',
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    return (
      <Row>
        <Col span={12}>
          <FormItem label="区域" {...formItemLayout} key="areaKey">
            {getFieldDecorator('areaId', {
              initialValue: searchData.areaId,
            })(
              <Cascader
                options={areaList}
                style={{ width }}
                size={size || 'default'}
                placeholder=""
                onChange={this.areaChange}
              />,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="分场" {...formItemLayout} key="fieldKey">
            {getFieldDecorator('fieldId', {
              initialValue: searchData.fieldId,
            })(
              <Select
                style={{ width }}
                size={size || 'default'}
                onChange={this.changeField}
                allowClear
              >
                {fieldList.map(item => (
                  <Option key={item.FFieldID}>{item.FFieldName}</Option>
                ))}
              </Select>,
            )}
          </FormItem>
        </Col>
      </Row>
    );
  }
}
