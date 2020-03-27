import React, { PureComponent } from 'react';
import { Select } from 'antd';

const { Option } = Select;
/**
 * 饲料调度系统：可输入的Select框
 */
export default class FsInputSelect extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            inputValue: '',
            options: this.props.options || [],
        };
    }

    handleChange = (value) => {
        // console.log(`selected ${value}`);
        this.setState({inputValue : value})
    }

    handleSearch = (value) => {
        // console.log(`input ${value}`);
        this.setState({inputValue : value})
    }

    handleBlur = (value) => {
        // console.log(`blur ${value}`);
        // console.log(this.state.options.indexOf(value));
        if(value && this.state.options.indexOf(value) == -1){
            // console.log(`add ${value}`);
            let old = this.state.options;
            old.push(value);
            this.setState({options : old,inputValue : value})
        }        
    }

    render() {
        const { placeholder = '' } = this.props;
        const { options } = this.state;
        return (
            <Select
                allowClear
                placeholder={placeholder}
                showSearch
                style={{ minWidth: 150 }}
                onChange={this.handleChange}
                onSearch={this.handleSearch}
                onBlur={this.handleBlur}
                value={this.state.inputValue}
            >
                {options.map((item,index) => (
                <Option key={index} value={item}>{item}</Option>
                ))}
            </Select>
        );
    }
}
