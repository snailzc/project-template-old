import React, { Component } from 'react';
import { Button, Icon, Modal, Upload, message, notification } from 'antd';
import reqwest from 'reqwest';
import styles from './index.less';

export default class FsUploadModal extends Component {
  state = {
    fileList: [],
    uploading: false,
    show: false,
    destroyOnClose: true,
    visible: true,
  };

  componentWillReceiveProps(nextProps) {
    const { show } = nextProps;
    const curShow = this.props;
    if (show !== curShow) {
      this.setState({
        show,
      });
    }
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const { pageElement } = this.props;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file.originFileObj ? file.originFileObj : file);
    });

    this.setState({
      uploading: true,
    });

    if (pageElement.btn_upload && pageElement.btn_upload.uri) {
      reqwest({
        url: `/api${pageElement.btn_upload.uri}`,
        method: 'post',
        headers: {
          Authorization: localStorage.getItem('user-token'),
        },
        processData: false,
        data: formData,
        success: (res) => {
          this.setState({
            fileList: [],
            uploading: false,
          });
          if (res.data && res.data.rows.length) {
            this.openNotificationWithIcon(res.data.rows);
          }
          message.success('导入成功');
          this.props.getRefreshData(); // 重新获取列表数据
        },
        error: () => {
          this.setState({
            uploading: false,
          });
          message.error('导入失败');
        },
      });
    } else {
      message.error('暂无导入权限');
    }
  };

  downFile = () => {
    const { fileName, pageElement } = this.props;
    window.open(`/api${pageElement.btn_template.uri}?fileName=${fileName}&token=${localStorage.getItem('user-token')}`, 'blank');
  };

  openNotificationWithIcon = (val) => {
    notification.info({
      message: '导入提示',
      description: (
        val.map((item) => {
          return <p>{item}</p>;
        })
      ),
      duration: null,
    });
  };

  render() {
    const { pageElement } = this.props;
    const { uploading, show, destroyOnClose, visible } = this.state;
    const props = {
      action: pageElement.btn_upload ? pageElement.btn_upload.uri : '',
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };

    return (
      show
        ?
        (
          <Modal
            title="导入文件"
            footer={null}
            visible={visible}
            destroyOnClose={destroyOnClose}
            onCancel={() => this.props.cancelUpload()}
          >
            <Upload {...props}>
              <Button>
                <Icon type="upload" /> 选择文件
              </Button>
            </Upload>
            {
              pageElement && pageElement.btn_template
                ?
                <div>
                  <Button
                    className={styles.uploadButton}
                    type="primary"
                    onClick={this.handleUpload}
                    disabled={this.state.fileList.length === 0 || this.state.fileList.length > 1}
                    loading={uploading}
                  >
                    {uploading ? '上传中' : '开始上传'}
                  </Button>
                  <a onClick={this.downFile}>
                    模板下载
                  </a>
                </div>
                :
                ''
            }
          </Modal>
        )
        : ''
    );
  }
}
