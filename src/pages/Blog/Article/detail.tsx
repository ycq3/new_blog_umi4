import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col } from 'antd';
import style from './detail.less';
import { request } from 'umi';
import ArticleMenu from '@/pages/Blog/Article/compoment/artical_menu';
import { useParams } from 'umi';

import { marked } from 'marked';

export interface Menu {
  level: number;
  name: string;
}

export default () => {
  const [content, setContent] = useState('loading ...');
  const [title, setTitle] = useState('loading ...');
  // const menuContext = React.createContext<Array<Menu>>([]);

  const [menus, setMenu] = useState<Array<Menu>>([]);
  const [menus2, setMenu2] = useState(<></>);
  const [MD, setMD] = useState('');
  let tmpMenu = new Array<Menu>();
  // tmpMenu.push({ level: -1, name: 'out side' });

  const { id } = useParams();

  const loadDetail = () => {
    request(`/api/article/${id}/detail`).then((resp) => {
      setContent(resp.data.content);
      setTitle(resp.data.title);
    });
  };

  useEffect(() => {
    loadDetail();
  }, []);

  useMemo(() => {
    const renderer = {
      heading(text: string, level: 1 | 2 | 3 | 4 | 5 | 6): false {
        tmpMenu.push({ name: text, level: level });
        console.log(tmpMenu);
        setMenu(tmpMenu);
        return false;
      },
    };

    marked.use({ renderer });

    const MDt = marked.parse(content);
    setMD(MDt);
    console.log(MDt);
  }, [content]);

  useMemo(() => {
    setMenu2(<ArticleMenu menus={menus} />);
  }, [menus]);

  return (
    <>
      <div className={style.menu}>
        {/*<ArticleMenu menus={menus} />*/}
        {menus2}
      </div>
      <Row>
        <Col offset={4} span={20}>
          <div className={style.center}>
            <div className={style.title}>{title}</div>
            <pre dangerouslySetInnerHTML={{ __html: MD }}></pre>
          </div>
        </Col>
      </Row>
    </>
  );
};
