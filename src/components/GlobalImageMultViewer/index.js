import React, { PureComponent } from 'react';
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';

/**
 * 全局多图片图片查看组件
 * https://github.com/infeng/react-viewer
 */
export default class GlobalImageMultViewer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      imgList: [],
      curIndex: 0,
    };
  }

  componentWillMount() {
    this.handleImgs(this.props);
  }


  componentWillReceiveProps(nextProps) {
    this.handleImgs(nextProps);
  }
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  show = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  handleImgs = (props) => {
    const { imgs, data, activeIndex = 0 } = props;
    if (imgs) {
      this.setState({
        imgList: imgs,
        curIndex: activeIndex,
      });
    } else {
      const old = [];
      data.forEach((item) => {
        if (item.url) {
          const fileN = item.fileName.split('.');
          const stuff = fileN[fileN.length - 1];
          const imgArr = ['png', 'jpg', 'jpeg', 'gif', 'ico'];
          if (imgArr.includes(stuff)) {
            old.push({
              src: item.url,
              alt: item.fileName,
            });
          }
        }
      });
      this.setState({
        imgList: old,
        curIndex: activeIndex,
      });
    }
  };

  render() {
    const {
      ...props
    } = this.props;
    const { imgList, visible, curIndex } = this.state;
    return (
      <div>
        <Viewer
          ref={viewer => this.form = viewer}
          visible={visible}
          onClose={this.onClose}
          activeIndex={curIndex}
          images={imgList}
          zIndex={999999}
          {...props}
        />
      </div>
    );
  }
}
