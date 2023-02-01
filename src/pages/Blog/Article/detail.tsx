import React, { createContext, useState, useEffect } from 'react';
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

// export class ArticleDetail extends React.Component<any> {
//   public static layout = {
//     hideMenu: true,
//     hideNav: true,
//     hideFooter: false,
//   };
//
//   state = {
//     data: { content: '', title: '' },
//     content: 'loading',
//     menus: [],
//   };
//
//   componentDidMount() {
//     this.loadDetail();
//   }
//
//   loadDetail() {
//     const { id } = this.props.params;
//     request(`/api/article/${id}/detail`).then((resp) => {
//       this.setState({ data: resp.data }, () => {
//         // this.renderBody();
//       });
//     });
//   }
//
//   // renderBody() {
//   //   const {
//   //     data: { content },
//   //   } = this.state;
//   //
//   //   let menus: Menu[] = [];
//   //
//   //   let md = (
//   //
//   //   );
//   //   // React.createElement()
//   //
//   //   // ReactDOM.(md)
//   //   this.setState({ content: md }, () => {
//   //     this.setState({ menus: menus });
//   //   });
//   // }
//
//   render(): ReactNode {
//     if (this.state.data === null) {
//       return <></>;
//     }
//
//     const {
//       data: { title },
//       menus,
//       content,
//     } = this.state;
//
//     return (
//       <>
//         <div className={style.menu}>
//           <ArticleMenu menus={menus}></ArticleMenu>
//           {/*<Test*/}
//           {/*  source={content}*/}
//           {/*  updateHashAuto={false}*/}
//           {/*  ordered={false}*/}
//           {/*  declarative={true}*/}
//           {/*/>*/}
//         </div>
//         <Row>
//           <Col offset={4} span={20}>
//             <div className={style.center}>
//               <div className={style.title}>{title}</div>
//               <ReactMarkdown
//                 remarkPlugins={[remarkGfm]}
//                 rehypePlugins={[rehypeRaw]}
//                 components={{
//                   h2: ({ ...props }) => {
//                     const { level, children } = props;
//                     let p = children.pop();
//                     if (p !== undefined && typeof p === 'string') {
//                       let item:Menu = { level: level, name: p };
//                       // menus.push(item);
//                       return <h2 id={item.name}>{item.name}</h2>;
//                     } else {
//                       console.log(p);
//                     }
//                     return <></>;
//                   },
//                   code({ inline, className, children, ...props }) {
//                     // if(inline){
//                     //   return;
//                     // }
//                     const match = /language-(\w+)/.exec(className || '');
//                     return !inline && match ? (
//                       <SyntaxHighlighter
//                         // children={String(children).replace(/\n$/, '')}
//                         style={dark}
//                         language={match[1]}
//                         PreTag='div'
//                         {...props}
//                       />
//                     ) : (
//                       <code className={className} {...props}>
//                         {children}
//                       </code>
//                     );
//                   },
//                 }}
//               >
//                 {content}
//               </ReactMarkdown>
//             </div>
//           </Col>
//         </Row>
//       </>
//     );
//   }
// }

// export withRouter(ArticleDetail);
export default () => {
  const [content, setContent] = useState('loading ...');
  const [title, setTitle] = useState('loading ...');
  // const [menus, setMenu] = useReducer(,<Array<Menu>>{});
  const MenuContex = createContext<Array<Menu>>([]);

  let menus = new Array<Menu>();
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

  return (
    <>
      <div className={style.menu}>
        <MenuContex.Provider value={menus}>
          <ArticleMenu menus={menus} />
        </MenuContex.Provider>
      </div>
      <Row>
        <Col offset={4} span={20}>
          <div className={style.center}>
            <div className={style.title}>{title}</div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h2: ({ ...props }) => {
                  const { level, children } = props;
                  let p = children.pop();
                  if (p !== undefined && typeof p === 'string') {
                    let item: Menu = { level: level, name: p };
                    menus.push(item);
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
                      // children={String(children).replace(/\n$/, '')}
                      style={dark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    />
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
