import React, { Component } from 'react';
import styles from './index.less';


export default class GlobalImageSingleViewer extends Component {
  handleImage = (val) => {
    this.props.changeImage(val);
  }
  render() {
    const { images, curImage } = this.props;
    return (
      <div className={styles.imgWrap}>
        <div className={styles.imgBanner}>
          <ul className={styles.imgList}>
            {
              images.length && images.map((item, index) => {
                return (
                  <li id={index} onClick={() => this.handleImage(index)} key={item} className={index === curImage && styles.active} >
                    <img src={item} alt="" />
                  </li>
                );
              })
            }
          </ul>
        </div>
        <div className={styles.curImage}>
          <img alt="" src={images[curImage]} />
        </div>
      </div>
    );
  }
}
