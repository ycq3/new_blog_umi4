import React, { Component } from 'react';
import { Image } from 'antd';

export class WechatQrCode extends Component {
  render() {
    return (
      <>
        <Image src={require('@/assets/image/wechat.png')} height={'100px'} />
        <Image src={require('@/assets/image/donate.png')} height={'100px'} />
      </>
    );
  }
}
