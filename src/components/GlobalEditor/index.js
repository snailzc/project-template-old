import React, { Component } from 'react';
import { message } from 'antd';
import E from 'wangeditor';
import appConfig from '../../../config/app.config';


let editor = {};

class Editor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
    const elem = this.editorElem;
    const { value } = this.props;
    editor = new E(elem);

    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      //      'video', // 插入视频
      //      'code', // 插入代码
      'undo', // 撤销
      'redo', // 重复
    ];
    // 关闭粘贴样式的过滤,当从其他网页复制文本内容粘贴到编辑器中，编辑器会默认过滤掉复制文本中自带的样式，目的是让粘贴后的文本变得更加简洁和轻量
    // editor.customConfig.pasteFilterStyle = false;

    // 从其他页面复制过来的内容，除了包含文字还可能包含图片，这些图片一般都是外域的（可能会有盗链）。此时如果想要忽略图片，即只粘贴文字不粘贴图片，可以使用来控制。默认是可以粘贴图片的
    // editor.customConfig.pasteIgnoreImg = true;

    // 图片上传URL
    const { v4Upload } = localStorage;
    if (v4Upload) { /*
      editor.customConfig.uploadImgServer = v4Upload;
      editor.customConfig.uploadFileName = 'upload_file';
      editor.customConfig.uploadImgHeaders = {
        appCode: localStorage.appcode,
        Authorization: localStorage.getItem('user-token'),
      }; */
      editor.customConfig.customUploadImg = function (files, insert) {
        const file = files[0];
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传的图片大小不能超过2MB!');
          return false;
        }
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
          xhr.open('POST', v4Upload);
          xhr.setRequestHeader('appCode', appConfig.appShortCode);
          xhr.setRequestHeader('Authorization', localStorage.getItem('user-token'));
          const data = new FormData(); // eslint-disable-line no-undef
          data.append('upload_file', file);
          xhr.send(data);
          xhr.addEventListener('load', () => {
            const response = JSON.parse(xhr.responseText);
            if (response && response.data) {
              message.success('上传成功');
              const imgSrc = response.data.rows[0].url;
              insert(imgSrc);
            } else {
              message.error('上传失败');
            }
          });
          xhr.addEventListener('error', () => {
            message.error('上传失败');
            return false;
          });
        });
      };
    }

    // 编辑器Z-INDEX，默认为10000
    editor.customConfig.zIndex = 100;

    // 使用 onchange 函数监听内容的变化
    editor.customConfig.onchange = (html) => {
      this.props.onChange(html);
    };

    editor.create();

    // 初始化默认值
    if (value) {
      this.text(value);
    }
  }

  // 为编辑器设置内容
  text = (value) => {
    editor.txt.html(value);
  }

  render() {
    const { style } = this.props;
    return (
      <div ref={(c) => { this.editorElem = c; }} style={{ style }} />
    );
  }
}

export default Editor;
