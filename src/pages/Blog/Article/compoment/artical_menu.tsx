import React from 'react';
import { Anchor } from 'antd';
import { Menu } from '../detail';
const { Link } = Anchor;

export default class ArticleMenu extends React.Component<any, any> {
  render(): React.ReactNode {
    // console.log(this.props);debugger
    console.log();

    const { menus } = this.props;
    return (
      <>
        <Anchor onChange={(s) => console.log(s)}>
          {menus.map((m: Menu) => {
            console.log(m);
            return (
              <Link
                href={location.href + '?_to=' + m.name}
                title={m.name}
                key={m.name}
              >
                {' '}
              </Link>
            );
          })}
          {/*<Link href="#components-anchor-demo-basic" title="Basic demo" />*/}
          {/*<Link href="#components-anchor-demo-static" title="Static demo" />*/}
          {/*<Link href="#API" title="API">*/}
          {/*  <Link href="#Anchor-Props" title="Anchor Props" />*/}
          {/*  <Link href="#Link-Props" title="Link Props" />*/}
          {/*</Link>*/}
        </Anchor>
      </>
    );
  }
}
