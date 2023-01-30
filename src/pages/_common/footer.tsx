import { Component, ReactNode } from 'react';
import { BackTop } from 'antd';
import styles from './_footer.less';
export default class Footer extends Component {
  render(): ReactNode {
    const time = Date.now();
    return (
      <>
        <BackTop />
        <div className={styles.footer}>
          © 2022 <a href="https://www.pipiqiang.cn">皮皮强</a>. All Rights
          Reserved. | 已在风雨中度过 {time}
          <a
            href="https://www.pipiqiang.cn/sitemap.html"
            target="_blank"
            rel="noreferrer"
          >
            Sitemap
          </a>{' '}
          <br />
          <a
            href="http://beian.miit.gov.cn"
            rel="external nofollow noreferrer"
            target="_blank"
          >
            闽ICP备18023108号-1
          </a>
          <br />
          <a
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=35020602001374"
            rel="external nofollow noreferrer"
            target="_blank"
          >
            闽公网安备 35020602001374号
          </a>
        </div>
      </>
    );
  }
}
