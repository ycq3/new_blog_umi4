import React from 'react';
import { Anchor } from 'antd';
import { Menu } from '../detail';
import { useParams } from '@@/exports';

export default function (props: { menus: Array<Menu> }) {
  const { _to } = useParams();

  const { menus } = props;
  return (
    <>
      <Anchor
        onChange={(s) => console.log(s)}
        getCurrentAnchor={() => _to ?? ''}
        items={menus.map((m: Menu) => {
          console.log(m);
          return {
            href: location.href + '?_to=' + m.name,
            title: m.name,
            key: m.name,
          };
        })}
      />
    </>
  );
}

// export default class ArticleMenu extends React.Component<any, any> {
//   render(): React.ReactNode {
//     // console.log(this.props);debugger
//     console.log('menu load ......');
//
//     const { menus } = this.props;
//     return (
//
//     );
//   }
// }
