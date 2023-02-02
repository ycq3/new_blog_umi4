import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import style from './detail.less';
import { request } from 'umi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ArticleMenu from '@/pages/Blog/Article/compoment/artical_menu';
import dark from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark';
import { useParams } from 'umi';

export interface Menu {
  level: number;
  name: string;
}

export default () => {
  const [content, setContent] = useState('loading ...');
  const [title, setTitle] = useState('loading ...');
  const [menus, setMenu] = useState<Array<Menu>>([]);
  {
    /*const MenuContex = createContext<Array<Menu>>([]);*/
  }

  let tmpMenu = new Array<Menu>();
  const { id } = useParams();
  const loadDetail = () => {
    request(`/api/article/${id}/detail`).then((resp) => {
      console.log(resp);
      setContent(resp.data.content);
      setTitle(resp.data.title);
    });
  };
  useEffect(() => {
    loadDetail();
  }, []);

  useEffect(() => {
    setMenu(tmpMenu);
  });

  return (
    <>
      <div className={style.menu}>
        <ArticleMenu menus={menus} />
      </div>
      <Row>
        <Col offset={4} span={20}>
          <div className={style.center}>
            <div className={style.title}>{title}</div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ ...props }) => {
                  const { level, children } = props;
                  let p = children.pop();
                  if (p !== undefined && typeof p === 'string') {
                    let item: Menu = { level: level, name: p };
                    tmpMenu.push(item);
                    return <h2 id={item.name}>{item.name}</h2>;
                  } else {
                    console.log(p);
                  }
                  return <></>;
                },
                code({ inline, className, children, ...props }) {
                  // if(inline){
                  //   return;
                  // }
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={dark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </Col>
      </Row>
    </>
  );
};
