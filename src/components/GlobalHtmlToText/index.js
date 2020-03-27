import React, { Component } from 'react';

/**
 *  html富文本内容，按照html解析，转换为文本
 */
class HtmlToText extends Component {
  render() {
    const { style, content } = this.props;
    return (
      <div style={{ style }} dangerouslySetInnerHTML={{ __html: content }} />
    );
  }
}

export default HtmlToText;
