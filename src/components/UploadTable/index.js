import React, { Component } from 'react/index.js';
import { Button } from 'antd';
import UploadModal from './UploadModal.js';
import { exportTableExcel } from '../../utils/utils.js';

class Upload extends Component {
  state = {
    ifUpload: false,
  }

  // 导入
  upload = () => {
    this.setState({
      ifUpload: true,
    });
  }

  // 取消导入
  cancelUpload = () => {
    this.setState({
      ifUpload: false,
    });
  }

  // 导出
  exportTable = () => {
    this.props.searchData(exportTableExcel);
  }

  render() {
    const { pageElement, fileName, modelName } = this.props;
    const { ifUpload } = this.state;

    return (
      <span>
        {
          pageElement && pageElement.excel_upload
          ?
            <Button
              type="primary"
              icon="schedule"
              size="small"
              className="ant-btn-plus-margin"
              onClick={this.upload}
            >
              {pageElement.excel_upload.name}
            </Button>
          :
            ''
        }
        {
          pageElement && pageElement.excel_down
          ?
            <Button
              type="primary"
              icon="rollback"
              className="ant-btn-plus-margin"
              size="small"
              onClick={this.exportTable}
            >
              {pageElement.excel_down.name}
            </Button>
          :
            ''
        }
        <UploadModal
          show={ifUpload}
          cancelUpload={this.cancelUpload}
          fileName={fileName}
          modelName={modelName}
          pageElement={pageElement}
          getRefreshData={this.props.getRefreshData}
        />
      </span>
    );
  }
}

export default Upload;
