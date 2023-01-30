import styles from './index.less';
import ArticleList from '../_index/article_list';

function IndexPage() {
  return (
    <>
      <div className={styles.title}>
        <div className={styles.h1}>皮皮强</div>
        <div className={styles.h2}>皮这一下就够了？</div>
      </div>
      <ArticleList />
    </>
  );
}

IndexPage.menu = {
  name: '博客',
};

IndexPage.layout = {
  hideMenu: true,
  hideNav: true,
  hideFooter: false,
};

export default IndexPage;
