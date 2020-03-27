import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Icon } from 'antd';
import styles from './index.less'

const FormItem = Form.Item;

@Form.create()
export default class DrawerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        visible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.count !== this.props.count) {
      this.setState({
        visible: true,
      });
    }
    if (nextProps.close !== this.props.close) {
      this.setState({
        visible: false,
      });
    }
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { formItem, width = 720 } = this.props;
    const formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <Drawer
          title="标题"
          width={width}
          onClose={this.onClose}
          visible={this.state.visible}
          destroyOnClose
        >
          <Form onSubmit={this.handleSubmit}>
            <Row>
              {formItem.filter(item => item.show === undefined || item.show === true).map(item => (
                <Col span={item.span !== undefined ? item.span : 12} key={item.key}>
                  <FormItem
                    label={item.label}
                    {...formLayout}
                    {...item.formLayout}
                    validateStatus={item.validateStatus}
                  >
                    {getFieldDecorator(item.key, {
                      initialValue: item.initialValue,
                      rules: item.rules || [],
                    })(item.component)}
                  </FormItem>
                </Col>
              ))}
            </Row>
            <div className={styles.operBtns}>
              <Button onClick={this.onClose} className={styles.closeBtn}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form>          
        </Drawer>
      </div>
    );
  }
}